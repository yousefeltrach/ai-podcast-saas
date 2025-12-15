"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDistanceToNow } from "date-fns";
import { FileAudio, Clock } from "lucide-react";
import Link from "next/link";
import { formatDuration, formatFileSize, formatSmartDate } from "@/lib/format";

interface ProjectCardProps {
    id: string;
    displayName?: string;
    fileName: string;
    fileSize: number;
    fileDuration?: number;
    status: "uploaded" | "processing" | "completed" | "error";
    createdAt: number;
}

export function ProjectCard({
    id,
    displayName,
    fileName,
    fileSize,
    fileDuration,
    status,
    createdAt,
}: ProjectCardProps) {
    const title = displayName || fileName;

    return (
        <Link href={`/dashboard/projects/${id}`}>
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 hover:border-emerald-500/50 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {title}
                            </h3>
                            {displayName && (
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                    {fileName}
                                </p>
                            )}
                        </div>
                        <StatusBadge status={status} />
                    </div>
                </CardHeader>

                <CardContent className="relative pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <FileAudio className="h-4 w-4" />
                            <span>{formatBytes(fileSize)}</span>
                        </div>
                        {fileDuration && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(fileDuration)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="relative pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(createdAt, { addSuffix: true })}
                    </p>
                </CardFooter>
            </Card>
        </Link>
    );
}
