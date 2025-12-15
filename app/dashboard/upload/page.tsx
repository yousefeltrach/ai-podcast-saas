"use client";

import { PodcastUploader } from "@/components/podcast-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio, Zap, Shield, Clock } from "lucide-react";

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold">
                    Upload <span className="gradient-emerald-text">Podcast</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Upload your podcast audio and let AI generate amazing content
                </p>
            </div>

            {/* Upload Component */}
            <div className="glass-card-strong rounded-2xl p-8">
                <PodcastUploader />
            </div>

            {/* Upload Tips */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileAudio className="h-5 w-5 text-emerald-600" />
                            Supported Formats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>
                            MP3, WAV, M4A, AAC, OGG, FLAC, and more. Maximum file size and
                            duration depend on your plan.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5 text-emerald-600" />
                            Fast Processing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>
                            AI processing typically takes 2-5 minutes depending on file length.
                            You'll get real-time updates as content is generated.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-emerald-600" />
                            Secure Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>
                            Your files are securely stored and encrypted. Only you have access
                            to your projects and generated content.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5 text-emerald-600" />
                            Plan Limits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>
                            Free: 3 projects, 10MB, 10min | Pro: 30 projects, 200MB, 2hr |
                            Ultra: Unlimited
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
