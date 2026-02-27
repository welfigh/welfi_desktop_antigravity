// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
    data: {
        sessionToken: string;
    };
}

export interface UserData {
    customer_id: string;
    profile_id: string;
    user_id: string;
    email: string;
    role: string;
    investor_code: number;
    investor_number?: number;
    investor_profile?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
}

// ─── Engine: Dashboard panel ──────────────────────────────────────────────────

export interface PanelData {
    /** Total de tenencias en ARS (todo mi dinero) */
    balance: number;
    /** Rendimiento diario (%) */
    daily_performance: number;
    /** Rendimiento mensual (%) */
    monthly_performance: number;
    /** Rendimiento histórico (%) */
    historic_performance: number;
    /** Rendimiento diario en pesos */
    daily_performance_pesos: number;
    /** Rendimiento mensual en pesos */
    monthly_performance_pesos: number;
    /** ARS disponibles para operar */
    available_in_pesos: number;
    /** USD disponibles para operar */
    available_in_dollars: number;
    /** ARS pendientes */
    pending_in_pesos: number;
    /** USD pendientes */
    pending_in_dollars: number;
    /** Factor de conversión ARS/USD */
    dollar_value: number;
    /** Tenencias Welfi Pesos */
    welfi_pesos_holdings: number;
    welfi_pesos_performance: number;
    /** Tenencias Objetivos/Estrategias */
    goals_holdings: number;
    goals_performance: number;
    /** Tenencias Packs */
    packs_holdings: number;
    packs_performance: number;
    /** Estado del cliente */
    customer_status: string;
    client_account_available: boolean;
    mep_available: boolean;
}

export interface PanelResponse {
    cached: boolean;
    data: PanelData;
}

// ─── Engine: Available balance ────────────────────────────────────────────────

export interface AvailableProfileResponse {
    data: {
        available_pesos: number;
        available_dollars: number;
        to_operate_in_dollars: number;
    };
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Portfolio {
    id: string;
    name: string;
    currency: string;
    total_value: number;
    performance: number;
    [key: string]: unknown;
}

export interface WelfiPesosPortfolio {
    id: string;
    name: string;
    total_value: number;
    daily_performance: number;
    [key: string]: unknown;
}

export interface WelfiDollarsPortfolio {
    id: string;
    name: string;
    total_value_usd: number;
    daily_performance: number;
    [key: string]: unknown;
}

export interface Objective {
    id: string;
    name: string;
    type: string;
    currency: string;
    total_value: number;
    [key: string]: unknown;
}

// ─── Generic API error ────────────────────────────────────────────────────────

export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
