"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Settings } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import headerBg from "../assets/72384e84861ccea0025a5cb04af72b6dbb5d53f9.png";

// Helper type for page (can be refined)
type PageType = "home" | "stats" | "investments" | "movements" | "settings";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop?
    const pathname = usePathname();

    // Check if we are on the dashboard (home) page to style header differently
    const isDashboard = pathname === '/' || pathname === '/dashboard';

    // Header background classes: transparent for dashboard (to blend with page bg), gradient for others
    const headerClasses = isDashboard
        ? "relative bg-transparent shrink-0 z-50"
        : "relative bg-gradient-to-br from-[#3246ff] via-[#4856ff] to-[#3d4eff] overflow-hidden shrink-0 z-50";

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f5f5f7]">
            {/* Sidebar - using NavLink internally for active state */}
            <Sidebar />

            {/* Main content */}
            <div className={`flex-1 flex flex-col min-w-0 relative ${isDashboard ? 'bg-gradient-to-br from-[#3246ff] via-[#4856ff] to-[#3d4eff]' : ''}`}>
                {/* Header */}
                <header className={headerClasses}>
                    {/* Background pattern & orbs - hidden on dashboard where header is transparent */}
                    {!isDashboard && (
                        <>
                            <div className="absolute inset-0 opacity-20">
                                <img
                                    src={headerBg.src}
                                    alt=""
                                    className="w-full h-full object-cover mix-blend-overlay"
                                />
                            </div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5582f]/20 rounded-full blur-3xl pointer-events-none" />
                        </>
                    )}

                    {/* Header content */}
                    <div className="relative z-10 w-full py-3 lg:py-3">
                        <div className="px-4 sm:px-6 lg:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        className="lg:hidden backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-2xl p-2.5 transition-all"
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    >
                                        <Menu className="size-5 text-white" />
                                    </button>
                                    <h1 className="text-white text-base lg:text-lg font-semibold truncate">Hola, Fran 👋</h1>
                                </div>

                                <div className="flex items-center gap-3">

                                    <button className="backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-all relative">
                                        <Bell className="size-4 text-white" />
                                        <div className="absolute -top-1 -right-1 bg-[#e5582f] rounded-full w-2 h-2" />
                                    </button>
                                    <button className="backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-all">
                                        <Settings className="size-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 w-full overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
