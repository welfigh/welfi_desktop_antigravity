// Tier system configuration
// Welfi Normal / Pro / Black

export type WelfiTier = "normal" | "pro" | "black";

export interface AdvisorInfo {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    photoUrl: string;
}

export interface TierConfig {
    label: string;
    sublabel: string;
    features: string[];
    price?: string;
}

// Mock advisor data (matches the mobile app screenshot)
export const advisorInfo: AdvisorInfo = {
    name: "Nicolás Bauzá",
    email: "nicolasbauza@welfi.com.ar",
    phone: "2612716991",
    whatsapp: "5492612716991",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

export const tierConfigs: Record<WelfiTier, TierConfig> = {
    normal: {
        label: "Welfi",
        sublabel: "Free",
        features: [
            "Inversiones automatizadas",
            "Seguimiento de objetivos",
            "Reportes básicos",
        ],
        price: undefined,
    },
    pro: {
        label: "Welfi Pro",
        sublabel: "⚡ Premium",
        features: [
            "Todo de Welfi Free",
            "Asesor personal por WhatsApp",
            "Reportes avanzados",
            "Alertas personalizadas",
        ],
        price: "3 USD/mes",
    },
    black: {
        label: "Welfi Black",
        sublabel: "💎 Exclusive",
        features: [
            "Todo de Welfi Pro",
            "Videollamadas con tu asesor",
            "Carteras 100% personalizadas",
            "Planificación financiera integral",
            "Acceso anticipado a nuevos productos",
        ],
        price: "10 USD/mes",
    },
};

// MOCK: Change this to test different tiers
// In production this comes from the user's subscription status + portfolio value
export const CURRENT_USER_TIER: WelfiTier = "normal";

// Helper: Would the user qualify for Pro based on portfolio value?
export const PRO_THRESHOLD_USD = 10_000;

// Helper: Would the user qualify for Black based on portfolio value?
export const BLACK_THRESHOLD_USD = 20_000;
