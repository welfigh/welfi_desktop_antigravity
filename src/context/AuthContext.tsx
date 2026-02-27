"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { authApi, setSessionToken } from "@/lib/api";
import type { LoginResponse, UserData } from "@/types/api.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
    user: UserData | null;
    sessionToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    /** Step 1: sends OTP to the user's email */
    sendOtp: (email: string) => Promise<void>;
    /** Step 2: verifies OTP code and establishes session */
    verifyOtp: (email: string, code: string) => Promise<void>;
    logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TOKEN_KEY = "welfi_session_token";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [sessionToken, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // true while restoring session

    // ── Restore session from sessionStorage on mount ──
    useEffect(() => {
        const stored = sessionStorage.getItem(SESSION_TOKEN_KEY);
        if (stored) {
            setSessionToken(stored); // inject into Axios
            setTokenState(stored);
            // Fetch user data with the restored token
            fetchUserData(stored);
        } else {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Listen for 401 events from Axios interceptor ──
    useEffect(() => {
        const handler = () => logout();
        window.addEventListener("welfi:unauthorized", handler);
        return () => window.removeEventListener("welfi:unauthorized", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Internal helpers ──────────────────────────────────────────────────────

    const persistToken = (token: string) => {
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        setSessionToken(token); // Axios interceptor
        setTokenState(token);
    };

    const fetchUserData = async (token: string) => {
        try {
            setSessionToken(token);
            const { data } = await authApi.get<UserData>("/user/data");
            setUser(data);
        } catch {
            // Token invalid or expired — clear session
            clearSession();
        } finally {
            setIsLoading(false);
        }
    };

    const clearSession = () => {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
        setSessionToken(null);
        setTokenState(null);
        setUser(null);
    };

    // ── Public API ────────────────────────────────────────────────────────────

    const sendOtp = useCallback(async (email: string) => {
        await authApi.post("/auth/generate-otp", { email });
    }, []);

    const verifyOtp = useCallback(async (email: string, code: string) => {
        const { data } = await authApi.post<LoginResponse>("/auth/login", {
            email,
            code,
            ip: "-",
            deviceInfo: "web",
        });
        const token = data.data.sessionToken;
        persistToken(token);
        await fetchUserData(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = useCallback(() => {
        clearSession();
    }, []);

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <AuthContext.Provider
            value={{
                user,
                sessionToken,
                isAuthenticated: !!sessionToken && !!user,
                isLoading,
                sendOtp,
                verifyOtp,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
