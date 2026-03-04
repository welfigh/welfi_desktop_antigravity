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
    /** Rendimiento histórico en pesos */
    historic_performance_pesos: number;
    /** Rendimiento general (%) */
    general_performance: number;
    /** Rendimiento general en pesos (%) */
    general_performance_pesos: number;
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
    /** Tenencias Welfi Dólares */
    welfi_dolares_holdings: number;
    welfi_dolares_performance: number;
    welfi_dolares_pending: number;
    /** Tenencias Objetivos/Estrategias */
    goals_holdings: number;
    goals_performance: number;
    goals_performance_pesos: number;
    /** Tenencias Packs */
    packs_holdings: number;
    packs_performance: number;
    packs_performance_pesos: number;
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
    type: "INVESTMENT" | "FUND" | "PACK" | "RETIREMENT" | "EMERGENCY" | string;
    /** API field name for objective type */
    objective_type?: "INVESTMENT" | "FUND" | "PACK" | "RETIREMENT" | "EMERGENCY" | string;
    currency: string;
    total_value: number;
    /** Position value in USD */
    current_position_value?: number;
    /** Position value in ARS */
    current_position_value_pesos?: number;
    [key: string]: unknown;
}

// ─── Engine: Real objectives from get_objectives (get_tracing_by_profile_id) ──

/** Single objective as returned inside `customs[]` / `recommended[]` */
export interface TracingObjective {
    id: string;
    title: string;
    currency_code: string;
    objective_type: "INVESTMENT" | "RETIREMENT" | "EMERGENCY" | "PACK" | string;
    /** Current position in USD */
    current_position_value: number;
    /** Current position in ARS */
    current_position_value_pesos: number;
    /** Pending amount in USD */
    pending_amount: number;
    /** Pending amount in ARS */
    pending_amount_ars: number;
    /** Daily performance (fraction, e.g. 0.005 = 0.5%) */
    performance: number;
    /** Daily performance in pesos (fraction) */
    performance_pesos: number;
    /** Emoji icon */
    icon: string;
}

/** Top-level response from GET /get_objectives */
export interface ObjectivesResponse {
    cached?: boolean;
    data: {
        /** Weighted avg performance (fraction) */
        performance: number;
        performance_pesos: number;
        /** Total amount in USD */
        amount: number;
        customs: TracingObjective[];
        recommended: TracingObjective[];
    };
}

// ─── Engine: Objective detail from get_current_position ────────────────────────

export interface InstrumentHolding {
    instrument_id: string;
    instrument_code: string;
    /** Quantity held */
    qty: number;
    /** Current price per unit */
    price: number;
    /** Total amount originally bought */
    bought_amount: number;
    /** Current market value */
    current_amount: number;
    /** Percentage of portfolio */
    percentage: number;
    /** Instrument type: EQUITY, BOND, FUND, CEDEAR, GUARANTEE, etc. */
    type: string;
    instrument_type?: string;
}

export interface ObjectiveDetailConfig {
    starting_amount?: number;
    monthly_amount?: number;
    goal_amount?: number;
}

export interface ObjectiveDetail {
    id: string;
    profile_id: string;
    name: string;
    created_at?: string;
    objective_type: string;
    configuration: ObjectiveDetailConfig;
    bought_position_value: number | null;
    current_position_value: number;
    current_position_value_usd: number;
    rentability: number | null;
    has_pending_orders: boolean | null;
    currency_code: string;
    items_qty: number | null;
    packets: number;
    investment_strategy?: string;
    goal_deadline?: string;
    portfolio: InstrumentHolding[];
    objective_configuration_id?: string;
    /** Earned in pesos (from tracing.py) */
    earned_pesos?: number;
    /** Day-over-day percentage change */
    percentage_change?: number;
}

// ─── Tickets / Movimientos ────────────────────────────────────────────────────

export type TicketOrderType = 0 | 1 | 2 | 3 | 4;
// 0=Suscripción (BUY), 1=Rescate (SELL), 2=Comisión, 3=Rebalanceo compra, 4=Rebalanceo venta

export type TicketStatus = 0 | 1 | 2 | 3 | 4 | 5 | 10;
// 0=Pendiente, 1=En proceso, 2=Ejecutada, 3=Cancelada, 4=Rechazada, 5=Error, 10=Programada

export interface TicketItem {
    id: string;
    instrument_code: string;
    instrument_type: string;
    qty: number | null;
    price: number | null;
    amount: number;
    market_order_status_id: string | null;
    settlement_date: string | null;
}

export interface MepConversion {
    direction: "usd_to_ars" | "ars_to_usd"; // usd_to_ars = sell USD, buy ARS; ars_to_usd = sell ARS, buy USD
    original_currency: string;   // currency sold
    original_amount: number;     // amount sold
    target_currency: string;     // currency received
    mep_rate: number;            // market_quote from OrderMep
    converted_amount: number;    // amount received
}

export interface Ticket {
    id: string;
    order_num: number;
    order_type: TicketOrderType;
    order_status: TicketStatus;
    amount: number;
    currency_code: string;
    created_at: string;
    updated_at: string;
    objective_id: string;
    objective_name: string;
    objective_type: string;
    deleted_at: string | null;
    items?: TicketItem[];
    mep?: MepConversion;
    executed_amount?: number; // sum of OrderItem amounts — may differ from requested `amount`
}

export interface TicketsResponse {
    data: {
        total: number;
        orders: Ticket[];
    };
}

// ─── Generic API error ────────────────────────────────────────────────────────

export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
