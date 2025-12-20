/**
 * Retry Job Function - Retries Individual Failed Generation Steps
 */
import { api } from "@/convex/_generated/api";
import { convex } from "@/lib/convex-client";
import type { PlanName, FeatureName } from "@/lib/tier-config";
import { FEATURE_TO_JOB_MAP } from "@/lib/tier-config";
import { planHasFeature } from "@/lib/tier-utils";
import { generateHashtags } from "../steps/ai-generation/hashtags";
import { generateKeyMoments } from "../steps/ai-generation/key-moments";
import { generateSocialPosts } from "../steps/ai-generation/social-posts";
import { generateSummary } from "../steps/ai-generation/summary";
import { generateTitles } from "../steps/ai-generation/titles";
import { generateYouTubeTimestamps } from "../steps/ai-generation/youtube-timestamps";
import type { TranscriptWithExtras } from "../types/assemblyai";
import type { Id } from "@/convex/_generated/dataModel";

export async function retryJob({
  projectId,
  job,
  originalPlan,
  currentPlan,
}: {
  projectId: Id<"projects">;
  job: string;
  originalPlan?: string;
  currentPlan?: string;
}) {
  // Check if user has upgraded and now has access to this feature
  const currentUserPlan = (currentPlan as PlanName) || "free";
  const originalUserPlan = (originalPlan as PlanName) || "free";

  // Get feature key from job name using the shared mapping
  const jobToFeature = Object.fromEntries(
    Object.entries(FEATURE_TO_JOB_MAP).map(([k, v]) => [v, k])
  );

  // Check if user has access to this feature with current plan
  const featureKey = jobToFeature[job];
  if (
    featureKey &&
    !planHasFeature(currentUserPlan, featureKey as FeatureName)
  ) {
    throw new Error(
      `This feature (${job}) is not available on your current plan. Please upgrade to access it.`
    );
  }

  // Log if this is an upgrade scenario
  if (originalUserPlan !== currentUserPlan) {
    console.log(
      `User upgraded from ${originalUserPlan} to ${currentUserPlan}. Generating ${job}.`
    );
  }

  // Get project to access transcript
  const project = await convex.query(api.projects.getProject, { projectId });
  if (!project?.transcript) {
    throw new Error("Project or transcript not found");
  }

  // Validate we have the complete transcript data needed for generation
  const transcript = project.transcript as TranscriptWithExtras;

  // Basic validation: All jobs need transcript text
  if (!transcript.text || transcript.text.length === 0) {
    throw new Error(
      "Cannot generate content: transcript text is empty. Please re-upload the file."
    );
  }

  // Job-specific validation for jobs that require chapters
  const jobsRequiringChapters = ["keyMoments", "youtubeTimestamps"];
  if (jobsRequiringChapters.includes(job)) {
    if (!transcript.chapters || transcript.chapters.length === 0) {
      throw new Error(
        `Cannot generate ${job}: transcript has no chapters. This podcast may be too short or lack distinct topics for chapter detection.`
      );
    }
  }

  // Other jobs (summary, socialPosts, titles, hashtags) can work with just text
  // They will use chapters if available for better context, but don't require them

  // Regenerate the specific job
  try {
    let result: any;

    switch (job) {
      case "keyMoments": {
        result = await generateKeyMoments(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          keyMoments: result,
        });
        break;
      }

      case "summary": {
        result = await generateSummary(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          summary: result,
        });
        break;
      }

      case "socialPosts": {
        result = await generateSocialPosts(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          socialPosts: result,
        });
        break;
      }

      case "titles": {
        result = await generateTitles(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          titles: result,
        });
        break;
      }

      case "hashtags": {
        result = await generateHashtags(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          hashtags: result,
        });
        break;
      }

      case "youtubeTimestamps": {
        result = await generateYouTubeTimestamps(transcript);
        await convex.mutation(api.projects.saveGeneratedContent, {
          projectId,
          youtubeTimestamps: result,
        });
        break;
      }

      default:
        throw new Error(`Unknown job type: ${job}`);
    }

    // Clear the error for this job after successful completion
    const currentErrors = project.jobErrors || {};
    const updatedErrors = { ...currentErrors };
    delete updatedErrors[job as keyof typeof updatedErrors];

    await convex.mutation(api.projects.saveJobErrors, {
      projectId,
      jobErrors: updatedErrors,
    });

    return { success: true, job };
  } catch (error) {
    // Save the error back to Convex
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await convex.mutation(api.projects.saveJobErrors, {
      projectId,
      jobErrors: {
        [job]: errorMessage,
      },
    });

    throw error;
  }
}
