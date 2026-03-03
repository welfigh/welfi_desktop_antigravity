import { authApi, engineApi } from "@/lib/api";
import type {
    UserData,
    PanelResponse,
    PanelData,
    AvailableProfileResponse,
    Portfolio,
    WelfiPesosPortfolio,
    WelfiDollarsPortfolio,
    Objective,
} from "@/types/api.types";

// ─── Auth microservice ────────────────────────────────────────────────────────

export async function fetchUserData(): Promise<UserData> {
    const { data } = await authApi.get<UserData>("/user/data");
    return data;
}

// ─── Engine microservice ──────────────────────────────────────────────────────

/**
 * GET /welfi-engine/api/v01/get_panel_for_profile
 * Devuelve el panel completo del usuario: balance total, rendimientos,
 * tenencias por producto, disponible, etc.
 * El backend identifica al usuario por el JWT Bearer token.
 */
export async function fetchPanel(): Promise<PanelData> {
    const { data } = await engineApi.get<PanelResponse>("/get_panel_for_profile");
    return data.data;
}

/**
 * GET /welfi-engine/api/v01/get_available_profile
 * Devuelve los fondos disponibles para operar (ARS y USD).
 */
export async function fetchAvailableBalance(): Promise<AvailableProfileResponse["data"]> {
    const { data } = await engineApi.get<AvailableProfileResponse>("/get_available_profile/");
    return data.data;
}

// ─── Products microservice (kept for future pages) ────────────────────────────

export async function fetchPortfolios(): Promise<Portfolio[]> {
    const { data } = await engineApi.get<{ data: Portfolio[] }>("/get_objectives");
    return data.data ?? (data as unknown as Portfolio[]);
}

export async function fetchWelfiPesos(): Promise<WelfiPesosPortfolio[]> {
    const { data } = await engineApi.get<{ data: WelfiPesosPortfolio[] }>("/get_objectives");
    return data.data ?? (data as unknown as WelfiPesosPortfolio[]);
}

export async function fetchWelfiDollars(): Promise<WelfiDollarsPortfolio[]> {
    const { data } = await engineApi.get<{ data: WelfiDollarsPortfolio[] }>("/get_objectives");
    return data.data ?? (data as unknown as WelfiDollarsPortfolio[]);
}

export async function fetchObjectives(
    type?: "INVESTMENT" | "FUND" | "PACK"
): Promise<Objective[]> {
    const params = type ? { objective_type: type } : {};
    const res = await engineApi.get("/get_objectives", { params });
    const raw = res.data;
    // Handle both { data: [...] } and raw array responses
    const arr = raw?.data ?? raw?.portfolios ?? raw;
    return Array.isArray(arr) ? arr : [];
}

// ─── Historical portfolio data ─────────────────────────────────────────────────

export type HistoricalPeriod = "1M" | "3M" | "6M" | "1A" | "Todo";

export interface HistoricalDataPoint {
    date: string;
    value: number;
}

/**
 * GET /welfi-engine/api/v01/customer/historical_portfolio?period={period}
 * Devuelve la evolución histórica del portfolio del usuario autenticado.
 * El JWT se inyecta automáticamente via engineApi interceptor.
 *
 * Errors are caught internally and return [] to avoid triggering the
 * global 401-interceptor logout when the endpoint is temporarily unavailable.
 */
export async function fetchHistoricalPortfolio(
    period: HistoricalPeriod
): Promise<HistoricalDataPoint[]> {
    const periodMap: Record<HistoricalPeriod, string> = {
        "1M": "1M",
        "3M": "3M",
        "6M": "6M",
        "1A": "1A",
        "Todo": "ALL",
    };
    try {
        const res = await engineApi.get<{ data: HistoricalDataPoint[] }>(
            "/customer/historical_portfolio",
            { params: { period: periodMap[period] } }
        );
        // Accept both { data: [...] } and raw array
        const raw = res.data;
        const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
        return arr;
    } catch (err: unknown) {
        // Silently return empty array on any error (401, 404, 500, network).
        // This prevents the global Axios interceptor from dispatching
        // welfi:unauthorized and logging the user out when this endpoint
        // is unavailable or returns an auth error.
        if (err && typeof err === "object" && "response" in err) {
            const status = (err as { response: { status: number } }).response?.status;
            console.warn(`[fetchHistoricalPortfolio] Error ${status} — returning empty data`);
        }
        return [];
    }
}
