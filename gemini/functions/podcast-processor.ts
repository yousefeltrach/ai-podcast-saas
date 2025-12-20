/**
 * Podcast Processing Workflow - Main Orchestration
 *
 * This is the core of the application - a standard async function that:
 * 1. Analyzes audio using AssemblyAI
 * 2. Generates AI content in parallel based on user's plan
 * 3. Saves all results to Convex 
 */
import { api } from "@/convex/_generated/api";
import type { PlanName } from "@/lib/tier-config";
import { generateHashtags } from "../steps/ai-generation/hashtags";
import { generateKeyMoments } from "../steps/ai-generation/key-moments";
import { generateSocialPosts } from "../steps/ai-generation/social-posts";
import { generateSummary } from "../steps/ai-generation/summary";
import { generateTitles } from "../steps/ai-generation/titles";
import { generateYouTubeTimestamps } from "../steps/ai-generation/youtube-timestamps";
import { saveResultsToConvex } from "../steps/persistence/save-to-convex";
import { transcribeWithAssemblyAI } from "../steps/transcription/assemblyai";
import { convex } from "@/lib/convex-client";
import type { Id } from "@/convex/_generated/dataModel";

export async function processPodcast({
  projectId,
  fileUrl,
  plan: userPlan,
}: {
  projectId: Id<"projects">;
  fileUrl: string;
  plan?: string;
}) {
  const plan = (userPlan as PlanName) || "free";

  console.log(`Processing project ${projectId} for ${plan} plan`);

  try {
    // Mark project as processing in Convex
    await convex.mutation(api.projects.updateProjectStatus, {
      projectId,
      status: "processing",
    });

    // Update jobStatus: transcription starting
    await convex.mutation(api.projects.updateJobStatus, {
      projectId,
      transcription: "running",
    });

    // Step 1: Transcribe audio with AssemblyAI
    const transcript = await transcribeWithAssemblyAI(fileUrl, projectId, plan);

    // Update jobStatus: transcription complete
    await convex.mutation(api.projects.updateJobStatus, {
      projectId,
      transcription: "completed",
    });

    // Update jobStatus: content generation starting
    await convex.mutation(api.projects.updateJobStatus, {
      projectId,
      contentGeneration: "running",
    });

    // Step 2: Run AI generation tasks in parallel based on plan
    const jobs: Promise<any>[] = [];
    const jobNames: string[] = [];

    // Summary - available to all plans
    jobs.push(generateSummary(transcript));
    jobNames.push("summary");

    // PRO and ULTRA features
    if (plan === "pro" || plan === "ultra") {
      jobs.push(generateSocialPosts(transcript));
      jobNames.push("socialPosts");

      jobs.push(generateTitles(transcript));
      jobNames.push("titles");

      jobs.push(generateHashtags(transcript));
      jobNames.push("hashtags");
    }

    // ULTRA-only features
    if (plan === "ultra") {
      jobs.push(generateKeyMoments(transcript));
      jobNames.push("keyMoments");

      jobs.push(generateYouTubeTimestamps(transcript));
      jobNames.push("youtubeTimestamps");
    }

    // Run all enabled jobs in parallel
    const results = await Promise.allSettled(jobs);

    // Extract successful results
    const generatedContent: Record<string, any> = {};
    const jobErrors: Record<string, string> = {};

    results.forEach((result, idx) => {
      const jobName = jobNames[idx];
      if (result.status === "fulfilled") {
        generatedContent[jobName] = result.value;
      } else {
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        jobErrors[jobName] = errorMessage;
        console.error(`Failed to generate ${jobName}:`, result.reason);
      }
    });

    // Save errors to Convex if any jobs failed
    if (Object.keys(jobErrors).length > 0) {
      await convex.mutation(api.projects.saveJobErrors, {
        projectId,
        jobErrors,
      });
    }

    // Update jobStatus: content generation complete
    await convex.mutation(api.projects.updateJobStatus, {
      projectId,
      contentGeneration: "completed",
    });

    // Step 3: Save all results to Convex
    await saveResultsToConvex(projectId, generatedContent);

    return { success: true, projectId, plan };
  } catch (error) {
    console.error("Podcast processing failed:", error);

    try {
      await convex.mutation(api.projects.recordError, {
        projectId,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        step: "workflow",
        details: error instanceof Error ? error.stack : String(error),
      });
    } catch (cleanupError) {
      console.error("Failed to update project status:", cleanupError);
    }

    throw error;
  }
}

