/**
 * Podcast Uploader Component
 *
 * Main orchestration component for podcast file uploads.
 * Manages the complete upload flow from file selection to project creation.
 *
 * Upload Flow:
 * 1. User selects file (via UploadDropzone)
 * 2. Extract audio duration (for time estimates)
 * 3. Pre-validate against plan limits (via server action)
 * 4. Upload file to Vercel Blob (direct upload with progress tracking)
 * 5. Create project in Convex (via server action)
 * 6. Trigger Inngest workflow (via server action)
 * 7. Redirect to project detail page
 *
 * State Management:
 * - selectedFile: Current file awaiting upload
 * - fileDuration: Extracted or estimated duration
 * - uploadProgress: 0-100% upload progress
 * - uploadStatus: idle | uploading | processing | completed | error
 *
 * Architecture:
 * - Pre-validation via server action prevents cryptic Vercel Blob errors
 * - Direct upload to Blob bypasses Next.js server (handles large files)
 * - Server actions provide type-safe, clean API for validation and project creation
 */
"use client";

import { useAuth } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  createProjectAction,
  getYouTubeMetadataAction,
  processYouTubeLinkAction,
  validateUploadAction,
} from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/upload-dropzone";
import { UploadProgress } from "@/components/upload-progress";
import { estimateDurationFromSize, getAudioDuration } from "@/lib/audio-utils";
import type { UploadStatus } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Youtube, ExternalLink, FileAudio, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PodcastUploader() {
  const router = useRouter();
  const { userId } = useAuth(); // Clerk authentication

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState<number | undefined>(
    undefined,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Link state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [youtubeMetadata, setYoutubeMetadata] = useState<{
    title: string;
    duration: number;
    thumbnail: string;
    videoId: string;
  } | null>(null);

  /**
   * Handle file selection from dropzone
   *
   * Extracts duration for better UX (shows processing time estimates)
   * Falls back to size-based estimation if extraction fails
   */
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);

    // Attempt to extract accurate duration from audio file
    try {
      const duration = await getAudioDuration(file);
      setFileDuration(duration);
      console.log(`Audio duration extracted: ${duration} seconds`);
    } catch (err) {
      // Fallback: Estimate duration based on file size
      // Rough estimate: 1MB ≈ 60 seconds at 128kbps
      console.warn("Could not extract duration from audio file:", err);
      const estimated = estimateDurationFromSize(file.size);
      setFileDuration(estimated);
      console.log(`Using estimated duration: ${estimated} seconds`);
    }
  };

  /**
   * Handle upload button click
   *
   * Upload Flow:
   * 1. Pre-validate upload limits (server action - clean and type-safe)
   * 2. Upload file to Vercel Blob (with progress tracking)
   * 3. Create project and trigger workflow
   * 4. Redirect to project detail page
   */
  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Step 1: Pre-validate upload using server action
      const validation = await validateUploadAction({
        fileSize: selectedFile.size,
        duration: fileDuration,
      });

      if (!validation.success) {
        throw new Error(validation.error || "Validation failed");
      }

      // Step 2: Upload file to Vercel Blob
      const blob = await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => {
          setUploadProgress(percentage);
        },
      });

      // Step 3: Create project and trigger workflow
      setUploadStatus("processing");
      setUploadProgress(100);

      const { projectId } = await createProjectAction({
        fileUrl: blob.url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        fileDuration,
      });

      toast.success("Upload completed! Processing your podcast...");
      setUploadStatus("completed");

      // Step 4: Navigate to project detail page
      router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload file. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Handle fetching YouTube metadata
   */
  const handleFetchMetadata = async () => {
    if (!youtubeUrl) return;

    setIsFetchingMetadata(true);
    setYoutubeMetadata(null);
    setError(null);

    try {
      const result = await getYouTubeMetadataAction(youtubeUrl);
      if (result.success && result.metadata) {
        setYoutubeMetadata(result.metadata);
      } else {
        setError(result.error || "Failed to fetch video information");
        toast.error(result.error || "Failed to fetch video information");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching video info");
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  /**
   * Handle YouTube link processing
   */
  const handleProcessLink = async () => {
    if (!youtubeUrl || !userId) {
      toast.error("Please provide a valid YouTube link");
      return;
    }

    try {
      setUploadStatus("processing");
      setUploadProgress(0);

      const { projectId } = await processYouTubeLinkAction(youtubeUrl);

      toast.success("Link received! Extracting audio and processing...");
      setUploadStatus("completed");
      setUploadProgress(100);

      router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      console.error("Link processing error:", err);
      setUploadStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to process link";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Reset upload state to allow new upload
   */
  const handleReset = () => {
    setSelectedFile(null);
    setFileDuration(undefined);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);
    setYoutubeUrl("");
    setYoutubeMetadata(null);
  };

  return (
    <div className="space-y-6">
      {/* Show selection only when idle or error and no file/metadata is being processed */}
      {!selectedFile && !youtubeMetadata && uploadStatus === "idle" && (
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="file" className="gap-2">
              <FileAudio className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="link" className="gap-2">
              <Youtube className="h-4 w-4" />
              YouTube Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <UploadDropzone
              onFileSelect={handleFileSelect}
              disabled={uploadStatus !== "idle"}
            />
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="glass-card p-8 rounded-2xl border-2 border-emerald-100/50">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="rounded-3xl p-6 glass-card border-emerald-200">
                  <Youtube className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Paste YouTube Video Link</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Enter a YouTube URL to automatically extract audio and generate your social kit.
                  </p>
                </div>

                <div className="flex w-full max-w-md gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      className="pl-10 h-12 rounded-xl"
                      value={youtubeUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYoutubeUrl(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleFetchMetadata()}
                    />
                  </div>
                  <Button
                    onClick={handleFetchMetadata}
                    disabled={!youtubeUrl || isFetchingMetadata}
                    size="lg"
                    className="rounded-xl px-6"
                  >
                    {isFetchingMetadata ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Go"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Show link preview */}
      {youtubeMetadata && !selectedFile && uploadStatus === "idle" && (
        <div className="glass-card p-6 rounded-2xl border-2 border-emerald-200 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={youtubeMetadata.thumbnail}
                alt={youtubeMetadata.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <Youtube className="h-12 w-12 text-white/80" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold line-clamp-2">{youtubeMetadata.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4" />
                    {Math.floor(youtubeMetadata.duration / 60)}:{(youtubeMetadata.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on YouTube
                  </a>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleProcessLink} className="flex-1 rounded-xl h-12 text-lg">
                  Start AI Processing
                </Button>
                <Button onClick={handleReset} variant="outline" className="rounded-xl h-12">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show progress card for both file and link */}
      {(selectedFile || uploadStatus !== "idle") && !youtubeMetadata && (
        <>
          <UploadProgress
            fileName={selectedFile?.name || (youtubeMetadata as any)?.title || "Podcast Audio"}
            fileSize={selectedFile?.size || 0}
            fileDuration={fileDuration || (youtubeMetadata as any)?.duration}
            progress={uploadProgress}
            status={uploadStatus}
            error={error || undefined}
          />

          {/* Action buttons (show when idle or error) */}
          {(uploadStatus === "idle" || uploadStatus === "error") && (
            <div className="flex gap-3">
              <Button onClick={handleUpload} className="flex-1">
                {uploadStatus === "error" ? "Try Again" : "Start Upload"}
              </Button>
              <Button onClick={handleReset} variant="outline">
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
