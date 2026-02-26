// Shared mock data
export interface Investment {
    id: string;
    emoji: string;
    name: string;
    amount: string;
    currency: string;
    returnRate: string;
    isPositive: boolean;
    progress?: number;
    goalAmount?: string;
    monthlyInvestment?: string;
    tna?: string;
    packsCount?: number;
    allowedInputCurrencies?: ("ARS" | "USD")[];
    strategyName?: string;
}

export const welfiPesosInvestments: Investment[] = [
    { id: "wp1", emoji: "💰", name: "Welfi Pesos Principal", amount: "2.004,00", currency: "ARS", returnRate: "0.9%", isPositive: true, monthlyInvestment: "500,00", tna: "38.0%" },
    { id: "wp2", emoji: "💸", name: "Gastos del mes", amount: "450,00", currency: "ARS", returnRate: "0.8%", isPositive: true, tna: "38.0%" },
];

export const investmentStrategies: Investment[] = [
    { id: "obj1", emoji: "💻", name: "Cambio de compu", amount: "1.354,00", currency: "USD", returnRate: "0.4%", isPositive: true, progress: 65, goalAmount: "2.000,00", monthlyInvestment: "150,00", allowedInputCurrencies: ["ARS", "USD"], strategyName: "Renta fija en USD" },
    { id: "obj2", emoji: "🚗", name: "Auto 2026", amount: "1.354.000,00", currency: "ARS", returnRate: "35%", isPositive: true, progress: 35, goalAmount: "3.850.000,00", monthlyInvestment: "200.000,00", allowedInputCurrencies: ["ARS"], strategyName: "Renta fija en ARS" },
    { id: "obj3", emoji: "🏖️", name: "Vacaciones Europa", amount: "650,00", currency: "USD", returnRate: "1.2%", isPositive: true, progress: 80, goalAmount: "810,00", monthlyInvestment: "80,00", allowedInputCurrencies: ["ARS", "USD"], strategyName: "Renta mixta global" },
    { id: "obj_usd_only", emoji: "👮", name: "Bono Tesoro USA", amount: "5.000,00", currency: "USD", returnRate: "5%", isPositive: true, monthlyInvestment: "100,00", allowedInputCurrencies: ["USD"], strategyName: "Renta fija en USD" },
    { id: "obj_mixed_usd", emoji: "🍎", name: "Apple Equity", amount: "2.500,00", currency: "USD", returnRate: "12%", isPositive: true, monthlyInvestment: "200,00", allowedInputCurrencies: ["ARS", "USD"], strategyName: "Renta variable global" },
];

export const thematicPacks: Investment[] = [
    { id: "pack1", emoji: "💼", name: "Empresas de Valor", amount: "263,25", currency: "USD", returnRate: "0.4%", isPositive: true, packsCount: 5 },
    { id: "pack2", emoji: "🤖", name: "Inteligencia Artificial", amount: "283,27", currency: "USD", returnRate: "0.4%", isPositive: true, packsCount: 3 },
];

export const emergencyFunds: Investment[] = [
    { id: "fund1", emoji: "🛡️", name: "Fondo de emergencia", amount: "1.200,00", currency: "USD", returnRate: "0.9%", isPositive: true, monthlyInvestment: "100,00" },
];

export const retirementFunds: Investment[] = [
    { id: "fund2", emoji: "👴", name: "Fondo de retiro", amount: "43,00", currency: "USD", returnRate: "0.9%", isPositive: true, monthlyInvestment: "120,00" },
];

export const allInvestments = [
    ...welfiPesosInvestments,
    ...investmentStrategies,
    ...thematicPacks,
    ...emergencyFunds,
    ...retirementFunds
];
