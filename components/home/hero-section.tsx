import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden mesh-background">
            <div className="container mx-auto px-4 py-24 md:pb-32 md:pt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 animate-float">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card hover-glow mb-8 animate-shimmer">
                            <Sparkles className="h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                AI-Powered Podcast Processing
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
                            <span className="gradient-emerald-text">Transform</span> Your
                            <br />
                            Podcasts with AI
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Upload your podcast audio and get AI-generated summaries,
                            transcripts, social posts, key moments, and more - all in minutes.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="gradient-emerald text-white hover-glow text-lg px-8 py-6 rounded-xl shadow-lg"
                    >
                        Get Started
                        <Sparkles className="ml-2 h-6 w-6" />
                    </Button>
                    <Link href="/dashboard/projects">
                        <Button
                            size="lg"
                            variant="outline"
                            className="hover-glow text-lg px-8 py-6 rounded-xl"
                        >
                            View Projects
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}