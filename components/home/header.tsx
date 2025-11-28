'use client'
import { Sparkles, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ModeToggle } from "../ui/mode-toggle";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
];

export default function Header() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setMobileMenuOpen(false);
            }
        }
    };

    return (
        <header
            className={
                isDashboard
                    ? "gradient-emerald sticky top-0 transition-all shadow-xl backdrop-blur-sm z-50 border-b border-white/10"
                    : "glass-nav sticky top-0 transition-all z-50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
            }
        >
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 lg:gap-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 group"
                        >
                            <div
                                className={
                                    isDashboard
                                        ? "p-2 rounded-xl bg-white/95 group-hover:bg-white group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
                                        : "p-2 rounded-xl gradient-emerald group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
                                }
                            >
                                <Sparkles
                                    className={
                                        isDashboard
                                            ? "h-5 w-5 text-emerald-600 group-hover:rotate-12 transition-transform duration-300"
                                            : "h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300"
                                    }
                                />
                            </div>
                            <span
                                className={
                                    isDashboard
                                        ? "text-xl font-bold text-white tracking-tight"
                                        : "text-xl font-bold gradient-emerald-text tracking-tight"
                                }
                            >
                                Podassti
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {!isDashboard && (
                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Desktop Auth Buttons */}
                    {!isDashboard && (
                        <div className="hidden md:flex items-center gap-3">
                            <ModeToggle />
                            <Button
                                variant="ghost"
                                asChild
                                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button
                                asChild
                                className="gradient-emerald text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                        </div>
                    )}

                    {/* Dashboard User Menu */}
                    {isDashboard && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/10"
                            >
                                Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    {!isDashboard && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile Menu */}
                {!isDashboard && mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col gap-2 mb-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-2 px-4">
                            <ModeToggle />
                            <Button
                                variant="outline"
                                asChild
                                className="w-full"
                            >
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full gradient-emerald text-white hover:opacity-90 shadow-lg"
                            >
                                <Link href="/register">Get Started Free</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

