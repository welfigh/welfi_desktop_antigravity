"use client";

import { User, Shield, Bell, Globe, ChevronRight } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

export default function SettingsPage() {
    const { logout } = useAuth();
    const sections = [
        {
            title: "Cuenta",
            items: [
                { icon: User, label: "Información personal", desc: "Nombre, Email, Teléfono" },
                { icon: Shield, label: "Seguridad y acceso", desc: "Contraseña, FaceID, 2FA" },
            ]
        },
        {
            title: "Preferencias",
            items: [
                { icon: Bell, label: "Notificaciones", desc: "Push, Email, WhatsApp" },
                { icon: Globe, label: "Idioma y Región", desc: "Español (AR), ARS/USD" },
            ]
        }
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                <h1 className="text-gray-900 text-3xl font-black">Configuración</h1>
            </div>

            <div className="grid gap-8">
                {sections.map((section) => (
                    <section key={section.title} className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {section.items.map((item) => (
                                    <button key={item.label} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left group">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-[#3246ff]/10 group-hover:text-[#3246ff] transition-colors">
                                            <item.icon className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{item.label}</div>
                                            <div className="text-sm text-gray-500">{item.desc}</div>
                                        </div>
                                        <ChevronRight className="size-5 text-gray-400 group-hover:text-[#3246ff] transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-red-600">Zona de peligro</h2>
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left group"
                        >
                            <div className="flex-1">
                                <div className="font-semibold text-red-600">Cerrar sesión</div>
                                <div className="text-sm text-gray-500">Cierra tu sesión en este dispositivo</div>
                            </div>
                        </button>
                    </div>
                </section>
            </div>

            <div className="text-center text-sm text-gray-400 py-8">
                Versión 1.0.0 (Web Beta)
            </div>
        </div>
    );
}
