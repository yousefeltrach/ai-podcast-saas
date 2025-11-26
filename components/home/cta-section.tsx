import { Button } from "../ui/button";

export default function CtaSection() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-lg mb-8">Sign up for free and start using our podcast generator today.</p>
                    <Button className="w-full sm:w-auto">Get Started</Button>
                </div>
            </div>
        </section>
    );
}