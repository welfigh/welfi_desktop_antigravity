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
