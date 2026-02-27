import axios, { AxiosInstance } from "axios";

// ─── Token store (module-level singleton) ──────────────────────────────────────
let _sessionToken: string | null = null;

export function setSessionToken(token: string | null) {
    _sessionToken = token;
}

export function getSessionToken(): string | null {
    return _sessionToken;
}

// ─── Client factory ───────────────────────────────────────────────────────────
function createClient(baseURL: string): AxiosInstance {
    const instance = axios.create({
        baseURL,
        timeout: 15000,
        headers: { "Content-Type": "application/json" },
    });

    // Inject Bearer token on every request
    instance.interceptors.request.use((config) => {
        const token = getSessionToken();
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    });

    // On 401 → dispatch logout event (AuthContext listens)
    instance.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response?.status === 401 && typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("welfi:unauthorized"));
            }
            return Promise.reject(err);
        }
    );

    return instance;
}

// ─── Three microservice clients ───────────────────────────────────────────────
// All routes go through Next.js server-side proxy (next.config.mjs rewrites)
// to avoid CORS issues in the browser. The proxy forwards:
//   /api/welfi/*    → https://api.welfi.ar/microservice-auth/api/v01/*
//   /api/products/* → https://api.welfi.ar/products-microservice/api/v01/*
//   /api/engine/*   → https://api.welfi.ar/welfi-engine/api/v01/*

export const authApi = createClient("/api/welfi");
export const productsApi = createClient("/api/products");
export const engineApi = createClient("/api/engine");

export default authApi;
