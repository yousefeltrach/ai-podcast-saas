"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContentViewerProps {
    title: string;
    content: string;
    type?: "text" | "json";
    className?: string;
}

export function ContentViewer({
    title,
    content,
    type = "text",
    className,
}: ContentViewerProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    // Parse JSON if type is json
    let displayContent = content;
    if (type === "json") {
        try {
            const parsed = JSON.parse(content);
            displayContent = JSON.stringify(parsed, null, 2);
        } catch {
            // If parsing fails, display as-is
        }
    }

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" />
                            Copy
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg bg-muted p-4 max-h-96 overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                        {displayContent}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}
