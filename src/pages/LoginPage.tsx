import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            login("scale-token-123", { id: "1", name: "Fran", email: "fran@welfi.com" });
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Visual Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#030213] overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#3246ff]/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4856ff]/20 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
                    <div className="text-2xl font-bold tracking-tight">welfi.</div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight">
                            Ordená y hacé <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3246ff] to-[#4856ff]">
                                crecer tu plata.
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Diseñamos una plataforma para ayudarte a tomar el control de tu futuro.
                            Alcanzá tus metas más rápido invirtiendo de forma inteligente.
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>© 2026 Welfi</span>
                        <span>•</span>
                        <span>Privacidad</span>
                        <span>•</span>
                        <span>Términos</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2 lg:text-left">
                        <h2 className="text-3xl font-bold text-[#030213]">Bienvenido de nuevo</h2>
                        <p className="text-gray-500">Ingresá tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3246ff] transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3246ff]/20 focus:border-[#3246ff] transition-all"
                                        placeholder="hola@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                    <a href="#" className="text-sm font-medium text-[#3246ff] hover:text-[#2536cc] transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#3246ff] transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3246ff]/20 focus:border-[#3246ff] transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-[#3246ff] to-[#4856ff] hover:from-[#2536cc] hover:to-[#3644cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3246ff] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Ingresar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">O continuá con</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                            Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" />
                            GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        ¿No tenés cuenta?{" "}
                        <a href="#" className="font-semibold text-[#3246ff] hover:text-[#2536cc] transition-colors">
                            Crear cuenta gratis
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
