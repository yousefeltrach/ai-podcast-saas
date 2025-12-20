/**
 * Convex Projects Mutations and Queries
 *
 * Backend functions for project CRUD operations.
 * Called from Next.js server actions and Inngest workflows.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new project
 *
 * Called after file upload to Vercel Blob.
 * Initial status is "uploaded", will be updated by Inngest workflow.
 */
export const createProject = mutation({
    args: {
        userId: v.string(),
        inputUrl: v.string(),
        fileName: v.string(),
        fileSize: v.number(),
        fileDuration: v.optional(v.number()),
        fileFormat: v.string(),
        mimeType: v.string(),
        sourceUrl: v.optional(v.string()),
        sourceType: v.union(v.literal("file"), v.literal("youtube"), v.literal("spotify")),
    },
    handler: async (ctx, args) => {
        const projectId = await ctx.db.insert("projects", {
            userId: args.userId,
            inputUrl: args.inputUrl,
            fileName: args.fileName,
            fileSize: args.fileSize,
            fileDuration: args.fileDuration,
            fileFormat: args.fileFormat,
            mimeType: args.mimeType,
            sourceUrl: args.sourceUrl,
            sourceType: args.sourceType,
            status: "uploaded",
            // displayName defaults to fileName if not set
        });

        return projectId;
    },
});

/**
 * Get a single project by ID
 *
 * Returns null if project not found or user doesn't own it.
 */
export const getProject = query({
    args: {
        projectId: v.optional(v.id("projects")),
    },
    handler: async (ctx, args) => {
        if (!args.projectId) return null;
        const project = await ctx.db.get(args.projectId);
        return project;
    },
});

/**
 * Get all projects for a user
 *
 * Excludes soft-deleted projects.
 * Ordered by creation time (newest first).
 */
export const getProjects = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const projects = await ctx.db
            .query("projects")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("deletedAt"), undefined))
            .order("desc")
            .collect();

        return projects;
    },
});

/**
 * Get project count for a user
 *
 * Used for plan limit validation.
 * FREE plan: counts all projects (including deleted)
 * PRO plan: counts only active projects (excludes deleted)
 */
export const getUserProjectCount = query({
    args: {
        userId: v.string(),
        includeDeleted: v.boolean(),
    },
    handler: async (ctx, args) => {
        let projects = await ctx.db
            .query("projects")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        // Filter out deleted projects if not including them
        if (!args.includeDeleted) {
            projects = projects.filter((p) => !p.deletedAt);
        }

        return projects.length;
    },
});

/**
 * Delete a project (soft delete)
 *
 * Sets deletedAt timestamp instead of removing from database.
 * Validates user ownership before deletion.
 */
export const deleteProject = mutation({
    args: {
        projectId: v.id("projects"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.userId !== args.userId) {
            throw new Error("Unauthorized - not your project");
        }

        // Soft delete by setting timestamp
        await ctx.db.patch(args.projectId, {
            deletedAt: Date.now(),
        });

        // Return inputUrl so caller can delete from Blob storage
        return { inputUrl: project.inputUrl };
    },
});

/**
 * Update project display name
 *
 * Validates user ownership before update.
 */
export const updateProjectDisplayName = mutation({
    args: {
        projectId: v.id("projects"),
        userId: v.string(),
        displayName: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.userId !== args.userId) {
            throw new Error("Unauthorized - not your project");
        }

        await ctx.db.patch(args.projectId, {
            displayName: args.displayName,
        });
    },
});

/**
 * Update project status
 *
 * Called by Inngest workflow to track processing progress.
 */
export const updateProjectStatus = mutation({
    args: {
        projectId: v.id("projects"),
        status: v.union(
            v.literal("uploaded"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("error")
        ),
        error: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const updates: any = {
            status: args.status,
        };

        if (args.status === "processing" && !args.error) {
            updates.processingStartedAt = Date.now();
        }

        if (args.status === "completed") {
            updates.processingCompletedAt = Date.now();
        }

        if (args.error) {
            updates.error = args.error;
        }

        await ctx.db.patch(args.projectId, updates);
    },
});

/**
 * Update project with generated content
 *
 * Called by Inngest workflow as AI content is generated.
 * Allows partial updates (only update fields that are provided).
 */
export const updateProjectContent = mutation({
    args: {
        projectId: v.id("projects"),
        transcription: v.optional(v.string()),
        summary: v.optional(v.string()),
        socialPosts: v.optional(v.string()),
        titles: v.optional(v.string()),
        hashtags: v.optional(v.string()),
        keyMoments: v.optional(v.string()),
        youtubeTimestamps: v.optional(v.string()),
        speakerDiarization: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { projectId, ...content } = args;

        // Only update fields that are provided
        const updates: any = {};
        for (const [key, value] of Object.entries(content)) {
            if (value !== undefined) {
                updates[key] = value;
            }
        }

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(projectId, updates);
        }
    },
});

/**
 * Save transcription and speakers to Convex
 */
export const saveTranscript = mutation({
    args: {
        projectId: v.id("projects"),
        transcript: v.any(), // Flexible object since it contains nested arrays/objects
    },
    handler: async (ctx, args) => {
        const { projectId, transcript } = args;

        // Extract speakers from utterances if not provided as a separate field
        // This maintains the speakerDiarization field for the UI (in seconds)
        let speakerDiarization = undefined;
        if (transcript.utterances) {
            const speakers = (transcript.utterances as any[]).map(utterance => ({
                speaker: utterance.speaker,
                start: utterance.start / 1000,
                end: utterance.end / 1000,
                text: utterance.text,
                confidence: utterance.confidence,
            }));
            speakerDiarization = JSON.stringify(speakers);
        }

        await ctx.db.patch(projectId, {
            transcription: transcript.text,
            speakerDiarization: speakerDiarization,
            transcript: JSON.stringify(transcript),
        });
    },
});

/**
 * Update the status of specific job steps
 */
export const updateJobStatus = mutation({
    args: {
        projectId: v.id("projects"),
        transcription: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("error"))),
        contentGeneration: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("error"))),
    },
    handler: async (ctx, args) => {
        const { projectId, ...statuses } = args;
        const updates: any = {};

        if (statuses.transcription) updates.transcriptionStatus = statuses.transcription;
        if (statuses.contentGeneration) updates.contentGenerationStatus = statuses.contentGeneration;

        await ctx.db.patch(projectId, updates);
    },
});

/**
 * Save errors from parallel AI generation steps
 */
export const saveJobErrors = mutation({
    args: {
        projectId: v.id("projects"),
        jobErrors: v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.projectId, {
            jobErrors: JSON.stringify(args.jobErrors),
        });
    },
});

/**
 * Record a critical error in the workflow
 */
export const recordError = mutation({
    args: {
        projectId: v.id("projects"),
        message: v.string(),
        step: v.string(),
        details: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.projectId, {
            status: "error",
            error: args.message,
            lastErrorStep: args.step,
            lastErrorDetails: args.details,
        });
    },
});
