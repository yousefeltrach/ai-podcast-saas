// 'use client'
// import { Sparkles, Menu, X } from "lucide-react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { ModeToggle } from "../ui/mode-toggle";

// const navLinks = [
//     { href: "#features", label: "Features" },
//     { href: "#pricing", label: "Pricing" },
//     { href: "#how-it-works", label: "How It Works" },
//     { href: "#testimonials", label: "Testimonials" },
// ];

// export default function Header() {
//     const pathname = usePathname();
//     const isDashboard = pathname?.startsWith("/dashboard");
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
//         if (href.startsWith("#")) {
//             e.preventDefault();
//             const element = document.querySelector(href);
//             if (element) {
//                 element.scrollIntoView({ behavior: "smooth", block: "start" });
//                 setMobileMenuOpen(false);
//             }
//         }
//     };

//     return (
//         <header
//             className={
//                 isDashboard
//                     ? "gradient-emerald sticky top-0 transition-all shadow-xl backdrop-blur-sm z-50 border-b border-white/10"
//                     : "glass-nav sticky top-0 transition-all z-50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
//             }
//         >
//             <div className="container mx-auto px-4 lg:px-6">
//                 <div className="flex items-center justify-between h-16">
//                     {/* Logo */}
//                     <div className="flex items-center gap-2 lg:gap-8">
//                         <Link
//                             href="/"
//                             className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-300 group"
//                         >
//                             <div
//                                 className={
//                                     isDashboard
//                                         ? "p-2 rounded-xl bg-white/95 group-hover:bg-white group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
//                                         : "p-2 rounded-xl gradient-emerald group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
//                                 }
//                             >
//                                 <Sparkles
//                                     className={
//                                         isDashboard
//                                             ? "h-5 w-5 text-emerald-600 group-hover:rotate-12 transition-transform duration-300"
//                                             : "h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300"
//                                     }
//                                 />
//                             </div>
//                             <span
//                                 className={
//                                     isDashboard
//                                         ? "text-xl font-bold text-white tracking-tight"
//                                         : "text-xl font-bold gradient-emerald-text tracking-tight"
//                                 }
//                             >
//                                 Podassti
//                             </span>
//                         </Link>

//                         {/* Desktop Navigation */}
//                         {/* {!isDashboard && (
//                             <nav className="hidden md:flex items-center gap-1">
//                                 {navLinks.map((link) => (
//                                     <a
//                                         key={link.href}
//                                         href={link.href}
//                                         onClick={(e) => scrollToSection(e, link.href)}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200"
//                                     >
//                                         {link.label}
//                                     </a>
//                                 ))}
//                             </nav>
//                         )} */}
//                     </div>

//                     {/* Desktop Auth Buttons */}
//                     {!isDashboard && (
//                         <div className="hidden md:flex items-center gap-3">
//                             <ModeToggle />
//                             <Button
//                                 variant="ghost"
//                                 asChild
//                                 className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
//                             >
//                                 <Link href="/login">Sign In</Link>
//                             </Button>
//                             <Button
//                                 asChild
//                                 className="gradient-emerald text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
//                             >
//                                 <Link href="/register">Get Started Free</Link>
//                             </Button>
//                         </div>
//                     )}

//                     {/* Dashboard User Menu */}
//                     {isDashboard && (
//                         <div className="flex items-center gap-3">
//                             <Button
//                                 variant="ghost"
//                                 className="text-white hover:bg-white/10"
//                             >
//                                 Dashboard
//                             </Button>
//                         </div>
//                     )}

//                     {/* Mobile Menu Button */}
//                     {!isDashboard && (
//                         <button
//                             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                             className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                             aria-label="Toggle menu"
//                         >
//                             {mobileMenuOpen ? (
//                                 <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
//                             ) : (
//                                 <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
//                             )}
//                         </button>
//                     )}
//                 </div>

//                 {/* Mobile Menu */}
//                 {!isDashboard && mobileMenuOpen && (
//                     <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
//                         {/* <nav className="flex flex-col gap-2 mb-4">
//                             {navLinks.map((link) => (
//                                 <a
//                                     key={link.href}
//                                     href={link.href}
//                                     onClick={(e) => scrollToSection(e, link.href)}
//                                     className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200"
//                                 >
//                                     {link.label}
//                                 </a>
//                             ))}
//                         </nav> */}
//                         <div className="flex flex-col gap-2 px-4">
//                             <ModeToggle />
//                             <Button
//                                 variant="outline"
//                                 asChild
//                                 className="w-full"
//                             >
//                                 <Link href="/login">Sign In</Link>
//                             </Button>
//                             <Button
//                                 asChild
//                                 className="w-full gradient-emerald text-white hover:opacity-90 shadow-lg"
//                             >
//                                 <Link href="/register">Get Started Free</Link>
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }


"use client";

import { SignInButton, UserButton, useAuth, Protect } from "@clerk/nextjs";
import { Home, Sparkles, Zap, Crown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useState } from "react";

export function Header() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const showDashboardNav = isDashboard;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className={
                isDashboard
                    ? "gradient-emerald sticky top-0 transition-all shadow-xl backdrop-blur-sm z-50 border-b border-white/10"
                    : "glass-nav sticky top-0 transition-all z-50 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
            }
        >
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
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
                                Podassi
                            </span>
                        </Link>

                        {/* Dashboard Navigation inline with logo */}
                        {showDashboardNav && (
                            <div className="flex items-center pl-2 sm:pl-4 border-l border-white/20">
                                <DashboardNav />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        {isSignedIn ? (
                            <>
                                {/* Show "Upgrade to Pro" for Free users */}
                                <Protect
                                    condition={(has) =>
                                        !has({ plan: "pro" }) && !has({ plan: "ultra" })
                                    }
                                    fallback={null}
                                >
                                    <Link href="/dashboard/upgrade">
                                        <Button
                                            className={
                                                isDashboard
                                                    ? "bg-white/95 text-emerald-600 hover:bg-white hover:scale-105 gap-2 shadow-lg font-semibold transition-all duration-300 border border-white/20"
                                                    : "gradient-emerald text-white hover-glow hover:scale-105 gap-2 shadow-lg transition-all duration-300"
                                            }
                                        >
                                            <Zap className="h-4 w-4" />
                                            <span className="hidden lg:inline">Upgrade to Pro</span>
                                            <span className="lg:hidden">Pro</span>
                                        </Button>
                                    </Link>
                                </Protect>

                                {/* Show "Upgrade to Ultra" for Pro users */}
                                <Protect
                                    condition={(has) =>
                                        has({ plan: "pro" }) && !has({ plan: "ultra" })
                                    }
                                    fallback={null}
                                >
                                    <Link href="/dashboard/upgrade">
                                        <Button
                                            className={
                                                isDashboard
                                                    ? "bg-white/95 text-emerald-600 hover:bg-white hover:scale-105 gap-2 shadow-lg font-semibold transition-all duration-300 border border-white/20"
                                                    : "gradient-emerald text-white hover-glow hover:scale-105 gap-2 shadow-lg transition-all duration-300"
                                            }
                                        >
                                            <Crown className="h-4 w-4" />
                                            <span className="hidden lg:inline">Upgrade to Ultra</span>
                                            <span className="lg:hidden">Ultra</span>
                                        </Button>
                                    </Link>
                                </Protect>

                                {/* Show Ultra badge for Ultra users */}
                                <Protect
                                    condition={(has) => has({ plan: "ultra" })}
                                    fallback={null}
                                >
                                    <Badge
                                        className={
                                            isDashboard
                                                ? "gap-1.5 hidden md:flex bg-white/95 text-emerald-600 border-0 px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300"
                                                : "gap-1.5 hidden md:flex gradient-emerald text-white border-0 px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300"
                                        }
                                    >
                                        <Crown className="h-3.5 w-3.5" />
                                        <span className="font-semibold">Ultra</span>
                                    </Badge>
                                </Protect>

                                {!showDashboardNav && (
                                    <Link href="/dashboard/projects">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={
                                                isDashboard
                                                    ? "hover-scale text-white hover:bg-white/20 transition-all duration-300"
                                                    : "hover-scale transition-all duration-300"
                                            }
                                        >
                                            <span className="hidden lg:inline">My Projects</span>
                                            <span className="lg:hidden">Projects</span>
                                        </Button>
                                    </Link>
                                )}
                                {showDashboardNav && (
                                    <Link href="/" className="hidden lg:block">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={
                                                isDashboard
                                                    ? "gap-2 hover-scale text-white hover:bg-white/20 transition-all duration-300"
                                                    : "gap-2 hover-scale transition-all duration-300"
                                            }
                                        >
                                            <Home className="h-4 w-4" />
                                            Home
                                        </Button>
                                    </Link>
                                )}
                                <ModeToggle />
                                <div className="scale-110 hover:scale-125 transition-transform duration-300">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </>
                        ) : (
                            <>
                                <ModeToggle />
                                <SignInButton mode="modal">
                                    <Button
                                        className={
                                            isDashboard
                                                ? "bg-white/95 text-emerald-600 hover:bg-white hover:scale-105 shadow-lg font-semibold transition-all duration-300"
                                                : "gradient-emerald text-white hover-glow hover:scale-105 shadow-lg transition-all duration-300"
                                        }
                                    >
                                        Sign In
                                    </Button>
                                </SignInButton>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className={isDashboard ? "h-6 w-6 text-white" : "h-6 w-6 text-gray-700 dark:text-gray-300"} />
                            ) : (
                                <Menu className={isDashboard ? "h-6 w-6 text-white" : "h-6 w-6 text-gray-700 dark:text-gray-300"} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className={
                        isDashboard
                            ? "lg:hidden py-4 border-t border-white/20 animate-in slide-in-from-top-2 duration-200"
                            : "lg:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200"
                    }>
                        <div className="flex flex-col gap-3 px-4">
                            <ModeToggle />
                            {isSignedIn ? (
                                <>
                                    {!showDashboardNav && (
                                        <Link href="/dashboard/projects" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                My Projects
                                            </Button>
                                        </Link>
                                    )}
                                    {showDashboardNav && (
                                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full gap-2">
                                                <Home className="h-4 w-4" />
                                                Home
                                            </Button>
                                        </Link>
                                    )}
                                    <Protect
                                        condition={(has) => !has({ plan: "pro" }) && !has({ plan: "ultra" })}
                                        fallback={null}
                                    >
                                        <Link href="/dashboard/upgrade" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full gradient-emerald text-white gap-2">
                                                <Zap className="h-4 w-4" />
                                                Upgrade to Pro
                                            </Button>
                                        </Link>
                                    </Protect>
                                    <Protect
                                        condition={(has) => has({ plan: "pro" }) && !has({ plan: "ultra" })}
                                        fallback={null}
                                    >
                                        <Link href="/dashboard/upgrade" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full gradient-emerald text-white gap-2">
                                                <Crown className="h-4 w-4" />
                                                Upgrade to Ultra
                                            </Button>
                                        </Link>
                                    </Protect>
                                </>
                            ) : (
                                <SignInButton mode="modal">
                                    <Button className="w-full gradient-emerald text-white">
                                        Sign In
                                    </Button>
                                </SignInButton>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
