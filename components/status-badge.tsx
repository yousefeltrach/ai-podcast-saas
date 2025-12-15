"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "uploaded" | "processing" | "completed" | "error";
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = {
        uploaded: {
            label: "Uploaded",
            icon: Clock,
            className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        processing: {
            label: "Processing",
            icon: Loader2,
            className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            animate: true,
        },
        completed: {
            label: "Completed",
            icon: CheckCircle2,
            className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        },
        error: {
            label: "Error",
            icon: XCircle,
            className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
    };

    const { label, icon: Icon, className: statusClassName, animate } = config[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                "gap-1.5 font-medium border-0",
                statusClassName,
                className
            )}
        >
            <Icon className={cn("h-3.5 w-3.5", animate && "animate-spin")} />
            {label}
        </Badge>
    );
}
