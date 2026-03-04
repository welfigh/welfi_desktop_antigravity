import { authApi, engineApi, productsApi } from "@/lib/api";
import type {
    UserData,
    PanelResponse,
    PanelData,
    AvailableProfileResponse,
    Portfolio,
    WelfiFundObjective,
    Objective,
    ObjectivesResponse,
    ObjectiveDetail,
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

/**
 * GET /products-microservice/api/v01/objectives?objective_type=FUND
 * Returns ALL fund objectives. We fetch once and split by currency.
 */
async function fetchAllFunds(): Promise<WelfiFundObjective[]> {
    try {
        const { data } = await productsApi.get<{ data: { portfolios: WelfiFundObjective[] } }>(
            "/objectives", { params: { objective_type: "FUND" } }
        );
        const portfolios = data?.data?.portfolios;
        return Array.isArray(portfolios) ? portfolios : [];
    } catch (err) {
        console.warn("[fetchAllFunds] Error:", err);
        return [];
    }
}

/** Welfi Pesos = FUND objectives with currency_code ARS */
export async function fetchWelfiPesos(): Promise<WelfiFundObjective[]> {
    const all = await fetchAllFunds();
    return all.filter((f) => f.currency_code === "ARS");
}

/** Welfi Dólares = FUND objectives with currency_code USD */
export async function fetchWelfiDollars(): Promise<WelfiFundObjective[]> {
    const all = await fetchAllFunds();
    return all.filter((f) => f.currency_code === "USD");
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

// ─── Real objectives fetching (typed response) ────────────────────────────────

/**
 * GET /welfi-engine/api/v01/get_objectives
 * Returns the real typed response with customs[] and recommended[] arrays.
 */
export async function fetchObjectivesReal(): Promise<ObjectivesResponse["data"]> {
    const { data } = await engineApi.get<ObjectivesResponse>("/get_objectives");
    return data.data;
}

// ─── Objective detail ─────────────────────────────────────────────────────────

/**
 * GET /welfi-engine/api/v01/get_current_position/{objective_id}
 * Returns full objective detail including portfolio instruments.
 */
export async function fetchObjectiveDetail(objectiveId: string): Promise<ObjectiveDetail | null> {
    try {
        const { data } = await engineApi.get<{ data: ObjectiveDetail }>(
            `/get_current_position/${objectiveId}`
        );
        return data.data ?? data as unknown as ObjectiveDetail;
    } catch (err) {
        console.warn("[fetchObjectiveDetail] Error:", err);
        return null;
    }
}

/**
 * GET /welfi-engine/api/v01/get_tracing/{objective_id}
 * Returns the FULL objective tracing: name, objective_type, configuration,
 * current_position_value, portfolio[], etc.
 */
export async function fetchObjectiveTracing(objectiveId: string): Promise<ObjectiveDetail | null> {
    try {
        const { data } = await engineApi.get<{ data: ObjectiveDetail }>(
            `/get_tracing/${objectiveId}`
        );
        return data.data ?? data as unknown as ObjectiveDetail;
    } catch (err) {
        console.warn("[fetchObjectiveTracing] Error:", err);
        return null;
    }
}

/**
 * GET /products-microservice/api/v01/welfi_pesos/{objective_id}
 * Returns fund-specific detail for FUND-type objectives (Welfi Pesos).
 * Falls back to /objective/{objective_id} if the first call fails.
 */
export async function fetchFundDetail(objectiveId: string): Promise<WelfiFundObjective | null> {
    try {
        const { data } = await productsApi.get<WelfiFundObjective>(
            `/welfi_pesos/${objectiveId}`
        );
        return data;
    } catch {
        try {
            const { data } = await productsApi.get<WelfiFundObjective>(
                `/objective/${objectiveId}`
            );
            return data;
        } catch (err) {
            console.warn("[fetchFundDetail] Error:", err);
            return null;
        }
    }
}

/**
 * GET /welfi-engine/api/v01/objective/{objective_id}/dashboard
 * Returns objective dashboard with rentability data.
 */
export async function fetchObjectiveDashboard(
    objectiveId: string,
    timeFrame = "HISTORICAL",
    currency = "ARS"
) {
    try {
        const { data } = await engineApi.get(
            `/objective/${objectiveId}/dashboard`,
            { params: { time_frame: timeFrame, currency } }
        );
        return data;
    } catch {
        return null;
    }
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
