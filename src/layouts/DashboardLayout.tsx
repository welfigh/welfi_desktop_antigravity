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
            <div className="flex-1 flex flex-col min-w-0 relative bg-[#f5f5f7]">
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
                        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        className={`lg:hidden rounded-2xl p-2.5 transition-all ${isDashboard ? "hover:bg-black/5 text-gray-800" : "backdrop-blur-md bg-white/20 hover:bg-white/30 text-white"
                                            }`}
                                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    >
                                        <Menu className="size-5" />
                                    </button>
                                    <h1 className={`text-base lg:text-[19px] font-bold tracking-tight truncate ${isDashboard ? "text-gray-900" : "text-white"}`}>
                                        Hola, Fran <span className="text-xl">👋</span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className={`rounded-xl p-2.5 transition-all relative ${isDashboard ? "hover:bg-black/5 text-gray-600" : "backdrop-blur-md bg-white/20 hover:bg-white/30 text-white"
                                        }`}>
                                        <Bell className="size-5" />
                                        <div className="absolute top-2 right-2.5 bg-[#e5582f] rounded-full w-2 h-2 border border-[#f5f5f7]" />
                                    </button>
                                    <button className={`rounded-xl p-2.5 transition-all ${isDashboard ? "hover:bg-black/5 text-gray-600" : "backdrop-blur-md bg-white/20 hover:bg-white/30 text-white"
                                        }`}>
                                        <Settings className="size-5" />
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
