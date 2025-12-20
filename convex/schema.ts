import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema
 *
 * Defines the structure of all tables in the database.
 * After modifying this file, run `npx convex dev` to sync changes.
 */

export default defineSchema({
    projects: defineTable({
        // User & File Info
        userId: v.string(), // Clerk user ID
        inputUrl: v.string(), // Vercel Blob URL to audio file
        fileName: v.string(), // Original filename
        fileSize: v.number(), // File size in bytes
        fileDuration: v.optional(v.number()), // Duration in seconds
        fileFormat: v.string(), // File extension (mp3, wav, etc.)
        mimeType: v.string(), // MIME type

        // Display & Metadata
        displayName: v.optional(v.string()), // User-editable display name
        deletedAt: v.optional(v.number()), // Soft delete timestamp

        // Processing Status
        status: v.union(
            v.literal("uploaded"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("error")
        ),
        processingStartedAt: v.optional(v.number()),
        processingCompletedAt: v.optional(v.number()),
        error: v.optional(v.string()), // Error message if status is "error"

        // Generated Content (AI outputs)
        // Transcription is available to ALL plans
        transcription: v.optional(v.string()),

        // Feature-gated content (based on plan)
        summary: v.optional(v.string()), // FREE+
        socialPosts: v.optional(v.string()), // PRO+ (JSON string of platform posts)
        titles: v.optional(v.string()), // PRO+ (JSON string of title suggestions)
        hashtags: v.optional(v.string()), // PRO+ (JSON string of hashtag suggestions)
        keyMoments: v.optional(v.string()), // ULTRA (JSON string of key moments)
        youtubeTimestamps: v.optional(v.string()), // ULTRA (formatted timestamps)
        speakerDiarization: v.optional(v.string()), // ULTRA (JSON string of speaker segments)

        // Job Tracking & Errors
        transcriptionStatus: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("error"))),
        contentGenerationStatus: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("error"))),
        transcript: v.optional(v.string()), // Full TranscriptWithExtras object as JSON string
        jobErrors: v.optional(v.string()), // JSON string of Record<string, string>
        lastErrorStep: v.optional(v.string()),
        lastErrorDetails: v.optional(v.string()),
    })
        // Indexes for efficient queries
        .index("by_userId", ["userId"])
        .index("by_userId_and_status", ["userId", "status"])
        .index("by_userId_and_deletedAt", ["userId", "deletedAt"]),
});
