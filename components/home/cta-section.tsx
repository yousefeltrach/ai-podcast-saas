import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CtaSection() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="rounded-3xl p-12 md:p-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary drop-shadow-lg">
                            Ready to supercharge your podcast workflow?
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed drop-shadow-md">
                            Upload your first podcast and see the magic happen in minutes.
                        </p>
                        <Link href="/dashboard/upload">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:scale-105 transition-all duration-300 text-lg px-10 py-7 rounded-xl shadow-xl shadow-emerald-500/20 font-bold border-0"
                            >
                                <Upload className="mr-2 h-6 w-6" />
                                Upload Your First Podcast
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}