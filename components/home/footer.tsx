import { Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-gradient-to-br bg-background to-emerald-50/30">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg gradient-emerald">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-lg gradient-emerald-text">
                                    Podcassti
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                AI-powered podcast processing that transforms your content into
                                engagement gold.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="/"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/dashboard/projects"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Projects
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/dashboard/upload"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Upload
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-bold mb-4 text-foreground">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-emerald-600 transition-colors text-sm"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-center text-sm text-forground">
                            {new Date().getFullYear()} Podassti. Made with ❤️ by Mr. Yousef Eltrach.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}