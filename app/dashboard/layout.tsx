import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/dashboard-nav";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Dashboard Header */}
            <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo / Brand */}
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold text-white">
                                Podassti
                            </h1>
                            {/* Navigation */}
                            <DashboardNav />
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-3">
                            <ModeToggle />
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                <p>© 2025 Podassti. All rights reserved.</p>
            </footer>
        </div>
    );
}
