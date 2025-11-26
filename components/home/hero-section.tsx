import { Sparkles } from "lucide-react";

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
            </div>
        </section>
    );
}