import { Button } from "../ui/button";

export default function CtaSection() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 gradient-emerald"></div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float"></div>
            <div
                className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-float"
                style={{ animationDelay: "1.5s" }}
            ></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="rounded-3xl p-12 md:p-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black drop-shadow-lg">
                            Ready to supercharge your podcast workflow?
                        </h2>
                        <p className="text-xl md:text-2xl text-black mb-10 leading-relaxed drop-shadow-md">
                            Upload your first podcast and see the magic happen in minutes.
                        </p>
                        <Button className="w-full sm:w-auto">Get Started</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}