"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { ContentViewer } from "@/components/content-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    Edit2,
    Trash2,
    FileAudio,
    Clock,
    Lock,
    Sparkles,
    Youtube,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { formatBytes, formatDuration } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";
import { deleteProjectAction, updateDisplayNameAction } from "@/app/actions/projects";

interface ProjectDetailPageProps {
    params: Promise<{
        id: Id<"projects">;
    }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = use(params);
    const { userId } = useAuth();
    const router = useRouter();
    const project = useQuery(api.projects.getProject, { projectId: id });

    const [isEditingName, setIsEditingName] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Loading state
    if (project === undefined) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    // Not found or unauthorized
    if (!project || project.userId !== userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold mb-3">Project Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    This project doesn't exist or you don't have access to it.
                </p>
                <Link href="/dashboard/projects">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </Link>
            </div>
        );
    }

    const handleEditName = async () => {
        if (!isEditingName) {
            setDisplayName(project.displayName || project.fileName);
            setIsEditingName(true);
            return;
        }

        try {
            await updateDisplayNameAction(id, displayName);
            toast.success("Display name updated");
            setIsEditingName(false);
        } catch (error) {
            toast.error("Failed to update display name");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteProjectAction(id);
            toast.success("Project deleted");
            router.push("/dashboard/projects");
        } catch (error) {
            toast.error("Failed to delete project");
            setIsDeleting(false);
        }
    };

    const title = project.displayName || project.fileName;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                </Button>
            </Link>

            {/* Project Header */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="text-3xl font-bold w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleEditName();
                                        if (e.key === "Escape") setIsEditingName(false);
                                    }}
                                />
                            ) : (
                                <h1 className="text-3xl font-bold">{title}</h1>
                            )}
                            {project.displayName && (
                                <p className="text-muted-foreground mt-1">{project.fileName}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={project.status} />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEditName}
                                disabled={isEditingName}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1.5">
                            <FileAudio className="h-4 w-4" />
                            <span>{formatBytes(project.fileSize)}</span>
                        </div>
                        {project.fileDuration && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(project.fileDuration)}</span>
                            </div>
                        )}
                        <span>•</span>
                        <span>
                            Created {formatDistanceToNow(project._creationTime, { addSuffix: true })}
                        </span>
                        {project.sourceUrl && project.sourceType === "youtube" && (
                            <>
                                <span>•</span>
                                <a
                                    href={project.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                                >
                                    <Youtube className="h-4 w-4" />
                                    <span>Source Video</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </>
                        )}
                    </div>

                    {/* Error Message */}
                    {project.status === "error" && project.error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>Error:</strong> {project.error}
                            </p>
                        </div>
                    )}
                </CardHeader>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="transcription" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="transcription">Transcription</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="social">Social Posts</TabsTrigger>
                    <TabsTrigger value="titles">Titles</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                    <TabsTrigger value="moments">Key Moments</TabsTrigger>
                </TabsList>

                {/* Transcription Tab */}
                <TabsContent value="transcription" className="space-y-4">
                    {project.transcription ? (
                        <ContentViewer
                            title="Transcription"
                            content={project.transcription}
                            type="text"
                        />
                    ) : (
                        <LockedFeature
                            title="Transcription"
                            message={
                                project.status === "processing"
                                    ? "Transcription is being generated..."
                                    : "Transcription not available yet"
                            }
                            isProcessing={project.status === "processing"}
                        />
                    )}
                </TabsContent>

                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-4">
                    {project.summary ? (
                        <ContentViewer title="Summary" content={project.summary} type="text" />
                    ) : (
                        <LockedFeature
                            title="Summary"
                            message={
                                project.status === "processing"
                                    ? "Summary is being generated..."
                                    : "Summary not available yet"
                            }
                            isProcessing={project.status === "processing"}
                        />
                    )}
                </TabsContent>

                {/* Social Posts Tab */}
                <TabsContent value="social" className="space-y-4">
                    {project.socialPosts ? (
                        <ContentViewer
                            title="Social Media Posts"
                            content={project.socialPosts}
                            type="json"
                        />
                    ) : (
                        <LockedFeature
                            title="Social Media Posts"
                            message="Upgrade to Pro to unlock AI-generated social media posts"
                            planRequired="Pro"
                        />
                    )}
                </TabsContent>

                {/* Titles Tab */}
                <TabsContent value="titles" className="space-y-4">
                    {project.titles ? (
                        <ContentViewer
                            title="Title Suggestions"
                            content={project.titles}
                            type="json"
                        />
                    ) : (
                        <LockedFeature
                            title="Title Suggestions"
                            message="Upgrade to Pro to unlock AI-generated title suggestions"
                            planRequired="Pro"
                        />
                    )}
                </TabsContent>

                {/* Hashtags Tab */}
                <TabsContent value="hashtags" className="space-y-4">
                    {project.hashtags ? (
                        <ContentViewer
                            title="Hashtag Suggestions"
                            content={project.hashtags}
                            type="json"
                        />
                    ) : (
                        <LockedFeature
                            title="Hashtag Suggestions"
                            message="Upgrade to Pro to unlock AI-generated hashtag strategies"
                            planRequired="Pro"
                        />
                    )}
                </TabsContent>

                {/* Key Moments Tab */}
                <TabsContent value="moments" className="space-y-4">
                    {project.keyMoments ? (
                        <ContentViewer
                            title="Key Moments"
                            content={project.keyMoments}
                            type="json"
                        />
                    ) : (
                        <LockedFeature
                            title="Key Moments"
                            message="Upgrade to Ultra to unlock key moments extraction"
                            planRequired="Ultra"
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Locked Feature Component
function LockedFeature({
    title,
    message,
    planRequired,
    isProcessing = false,
}: {
    title: string;
    message: string;
    planRequired?: string;
    isProcessing?: boolean;
}) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                    {isProcessing ? (
                        <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
                    ) : (
                        <Lock className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground mb-4">{message}</p>
                {planRequired && !isProcessing && (
                    <Button className="gradient-emerald text-white hover-glow">
                        Upgrade to {planRequired}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
