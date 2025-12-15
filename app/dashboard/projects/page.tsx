"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Upload, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
    const { userId } = useAuth();
    const projects = useQuery(
        api.projects.getProjects,
        userId ? { userId } : "skip"
    );

    // Loading state
    if (projects === undefined) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="glass-card p-12 rounded-2xl max-w-md">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                        <FolderOpen className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">No Projects Yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Upload your first podcast to get started with AI-powered content generation.
                    </p>
                    <Link href="/dashboard/upload">
                        <Button
                            size="lg"
                            className="gradient-emerald text-white hover-glow"
                        >
                            <Upload className="mr-2 h-5 w-5" />
                            Upload Podcast
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        {projects.length} {projects.length === 1 ? "project" : "projects"}
                    </p>
                </div>
                <Link href="/dashboard/upload">
                    <Button className="gradient-emerald text-white hover-glow">
                        <Upload className="mr-2 h-4 w-4" />
                        New Upload
                    </Button>
                </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project._id}
                        id={project._id}
                        displayName={project.displayName}
                        fileName={project.fileName}
                        fileSize={project.fileSize}
                        fileDuration={project.fileDuration}
                        status={project.status}
                        createdAt={project._creationTime}
                    />
                ))}
            </div>
        </div>
    );
}
