"use client";

import type { InstrumentHolding } from "@/types/api.types";

interface InstrumentsTableProps {
    instruments: InstrumentHolding[];
    currency: "ARS" | "USD";
    dollarValue: number;
    loading?: boolean;
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </td>
            ))}
        </tr>
    );
}

function formatNumber(n: number, decimals = 2): string {
    return n.toLocaleString("es-AR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

function getInstrumentTypeLabel(type: string): string {
    const map: Record<string, string> = {
        EQUITY: "Acción",
        BOND: "Bono",
        FUND: "FCI",
        CEDEAR: "CEDEAR",
        GUARANTEE: "Garantía",
    };
    return map[type] ?? type;
}

function getInstrumentTypeBadgeColor(type: string): string {
    const map: Record<string, string> = {
        EQUITY: "bg-blue-50 text-blue-700 border-blue-200",
        BOND: "bg-amber-50 text-amber-700 border-amber-200",
        FUND: "bg-emerald-50 text-emerald-700 border-emerald-200",
        CEDEAR: "bg-purple-50 text-purple-700 border-purple-200",
        GUARANTEE: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return map[type] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

export function InstrumentsTable({
    instruments,
    currency,
    dollarValue,
    loading = false,
}: InstrumentsTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instrumento</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valuación</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">P/L</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">%</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        );
    }

    // Filter out instruments with zero qty
    const activeInstruments = instruments.filter((i) => i.qty > 0);

    if (activeInstruments.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📊</span>
                </div>
                <p className="text-gray-500 text-sm">No hay instrumentos en esta inversión</p>
            </div>
        );
    }

    const totalCurrentAmount = activeInstruments.reduce((s, i) => s + i.current_amount, 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Instrumento
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Cantidad
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Precio
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Valuación
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            P/L
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            %
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {activeInstruments.map((instrument) => {
                        const pl = instrument.current_amount - instrument.bought_amount;
                        const plPct = instrument.bought_amount !== 0
                            ? ((instrument.current_amount / instrument.bought_amount) - 1) * 100
                            : 0;
                        const isPositive = pl >= 0;

                        // Convert values based on currency display
                        const displayValuation = currency === "USD"
                            ? instrument.current_amount / dollarValue
                            : instrument.current_amount;
                        const displayPL = currency === "USD"
                            ? pl / dollarValue
                            : pl;

                        return (
                            <tr
                                key={instrument.instrument_id}
                                className="hover:bg-gray-50/80 transition-colors group"
                            >
                                {/* Instrument name + type */}
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">
                                                {instrument.instrument_code || "—"}
                                            </div>
                                            <span
                                                className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${getInstrumentTypeBadgeColor(
                                                    instrument.type || instrument.instrument_type || ""
                                                )}`}
                                            >
                                                {getInstrumentTypeLabel(
                                                    instrument.type || instrument.instrument_type || ""
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Quantity */}
                                <td className="px-4 py-3.5 text-right font-medium text-gray-700 tabular-nums">
                                    {formatNumber(instrument.qty, instrument.qty % 1 === 0 ? 0 : 4)}
                                </td>

                                {/* Price */}
                                <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">
                                    $ {formatNumber(instrument.price)}
                                </td>

                                {/* Valuation */}
                                <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums">
                                    {currency === "USD" ? "U$S" : "$"} {formatNumber(displayValuation)}
                                </td>

                                {/* P/L amount */}
                                <td className={`px-4 py-3.5 text-right font-medium tabular-nums ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                                    {isPositive ? "+" : ""}{currency === "USD" ? "U$S" : "$"} {formatNumber(displayPL)}
                                </td>

                                {/* Percentage of portfolio */}
                                <td className="px-4 py-3.5 text-right tabular-nums">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#3246ff] rounded-full transition-all"
                                                style={{ width: `${Math.min(instrument.percentage, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-gray-500 text-xs font-medium min-w-[40px]">
                                            {formatNumber(instrument.percentage, 1)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

                {/* Footer with totals */}
                <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50/40">
                        <td className="px-4 py-3 font-bold text-gray-900 text-sm">Total</td>
                        <td className="px-4 py-3" />
                        <td className="px-4 py-3" />
                        <td className="px-4 py-3 text-right font-bold text-gray-900 tabular-nums">
                            {currency === "USD" ? "U$S" : "$"}{" "}
                            {formatNumber(
                                currency === "USD"
                                    ? totalCurrentAmount / dollarValue
                                    : totalCurrentAmount
                            )}
                        </td>
                        <td className="px-4 py-3" />
                        <td className="px-4 py-3 text-right text-xs text-gray-500 font-medium">
                            100%
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
