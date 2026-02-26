import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
    title: "Welfi - Inversiones",
    description: "Plataforma de inversiones Welfi",
};

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
