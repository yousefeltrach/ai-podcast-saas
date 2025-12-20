/**
 * YouTube Utility
 * 
 * Helpers for validating YouTube URLs and extracting metadata/audio.
 * Uses @distube/ytdl-core for reliable extraction.
 */

import ytdl from "@distube/ytdl-core";
import { Readable } from "stream";

/**
 * Helper to convert a Node.js Readable stream to a Buffer
 */
export async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", (err) => {
            console.error("Stream error during conversion:", err);
            reject(err);
        });
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * Validate if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
    return ytdl.validateURL(url);
}

/**
 * Get metadata for a YouTube video
 * 
 * Returns title, duration, and thumbnail to show a preview to the user.
 */
export async function getYouTubeMetadata(url: string) {
    try {
        const info = await ytdl.getBasicInfo(url);
        const { title, lengthSeconds, thumbnails } = info.videoDetails;

        return {
            title,
            duration: parseInt(lengthSeconds),
            thumbnail: thumbnails[thumbnails.length - 1].url, // Best quality thumbnail
            videoId: info.videoDetails.videoId,
        };
    } catch (error) {
        console.error("Error fetching YouTube metadata:", error);
        throw new Error("Failed to fetch video information. Please check the URL.");
    }
}

/**
 * Get an audio-only readable stream from a YouTube URL
 * 
 * Optimized for AssemblyAI:
 * - Filter for audio only
 * - Highest quality audio stream
 */
export async function getYouTubeAudioStream(url: string) {
    try {
        return ytdl(url, {
            filter: "audioonly",
            quality: "highestaudio",
        });
    } catch (error) {
        console.error("Error getting YouTube audio stream:", error);
        throw new Error("Failed to extract audio from YouTube.");
    }
}
