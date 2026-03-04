"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  Wallet,
  Building2,
  Repeat,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { Ticket, TicketItem, TicketOrderType, TicketStatus } from "@/types/api.types";

// ─── Unified movement model ──────────────────────────────────────────────────
// Combines investment tickets (Order) with cash movements (MovementsTB)

type MovementKind = "ticket" | "deposit" | "withdrawal" | "income";

interface UnifiedMovement {
  id: string;
  kind: MovementKind;
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "processing" | "cancelled";
  // Only for tickets
  ticket?: Ticket;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_TYPE_LABELS: Record<TicketOrderType, string> = {
  0: "Suscripción", 1: "Rescate", 2: "Comisión", 3: "Rebalanceo", 4: "Rebalanceo",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  0: "Pendiente", 1: "En proceso", 2: "Ejecutada", 3: "Cancelada", 4: "Rechazada", 5: "Error", 10: "Programada",
};

const STATUS_STYLES: Record<TicketStatus, string> = {
  0: "bg-amber-50 text-amber-700 border-amber-200",
  1: "bg-blue-50 text-blue-700 border-blue-200",
  2: "bg-emerald-50 text-emerald-700 border-emerald-200",
  3: "bg-gray-50 text-gray-400 border-gray-200",
  4: "bg-red-50 text-red-600 border-red-200",
  5: "bg-red-50 text-red-600 border-red-200",
  10: "bg-violet-50 text-violet-700 border-violet-200",
};

const UNIFIED_STATUS_STYLES: Record<UnifiedMovement["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-gray-50 text-gray-400 border-gray-200",
};

const UNIFIED_STATUS_LABELS: Record<UnifiedMovement["status"], string> = {
  completed: "Completado", pending: "Pendiente", processing: "En proceso", cancelled: "Cancelado",
};

type FilterType = "all" | "tickets" | "deposits" | "withdrawals" | "income";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "tickets", label: "Tickets" },
  { key: "deposits", label: "Ingresos" },
  { key: "withdrawals", label: "Retiros" },
  { key: "income", label: "Rentas y Dividendos" },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TICKETS: Ticket[] = [
  // Case 1: MEP ramp USD→ARS — sold USD, converted to ARS, invested in Welfi Pesos (executed)
  {
    id: "t1", order_num: 12847, order_type: 0, order_status: 2,
    amount: 150000, currency_code: "ARS", executed_amount: 150000,
    created_at: "2026-03-04T10:30:00", updated_at: "2026-03-04T14:00:00",
    objective_id: "obj-1", objective_name: "Welfi Pesos", objective_type: "FUND", deleted_at: null,
    items: [
      { id: "i1", instrument_code: "LECAP S30J5", instrument_type: "BOND", qty: 375, price: 400.0, amount: 149800, market_order_status_id: "COMPLETED", settlement_date: "2026-03-06" },
    ],
    mep: { direction: "usd_to_ars", original_currency: "USD", original_amount: 130.43, target_currency: "ARS", mep_rate: 1150, converted_amount: 150000 },
  },
  // Case 1b: MEP ramp USD→ARS — pending (estimated rate)
  {
    id: "t2", order_num: 12846, order_type: 0, order_status: 0,
    amount: 85000, currency_code: "ARS",
    created_at: "2026-03-03T16:45:00", updated_at: "2026-03-03T16:45:00",
    objective_id: "obj-2", objective_name: "Vacaciones 2026", objective_type: "INVESTMENT", deleted_at: null,
    items: [
      { id: "i2", instrument_code: "AL30", instrument_type: "BOND", qty: 1.2, price: 35000, amount: 42000, market_order_status_id: "SENDING_PENDING", settlement_date: null },
      { id: "i3", instrument_code: "GD30", instrument_type: "BOND", qty: 0.6, price: 43000, amount: 25800, market_order_status_id: "SENDING_PENDING", settlement_date: null },
    ],
    mep: { direction: "usd_to_ars", original_currency: "USD", original_amount: 73.91, target_currency: "ARS", mep_rate: 1150, converted_amount: 85000 },
  },
  // Case: ARS rescue from Welfi Pesos (executed)
  {
    id: "t3", order_num: 12840, order_type: 1, order_status: 2,
    amount: 50000, currency_code: "ARS", executed_amount: 50000,
    created_at: "2026-03-01T09:15:00", updated_at: "2026-03-02T11:00:00",
    objective_id: "obj-1", objective_name: "Welfi Pesos", objective_type: "FUND", deleted_at: null,
    items: [
      { id: "i5", instrument_code: "LECAP S30J5", instrument_type: "BOND", qty: 125, price: 400.0, amount: 49750, market_order_status_id: "COMPLETED", settlement_date: "2026-03-03" },
    ],
  },
  // Case 2: Direct USD investment — no MEP, currency_code is USD (executed, with lot diff)
  {
    id: "t4", order_num: 12835, order_type: 0, order_status: 2,
    amount: 500, currency_code: "USD", executed_amount: 486.25,
    created_at: "2026-02-28T14:20:00", updated_at: "2026-02-28T18:00:00",
    objective_id: "obj-3", objective_name: "Estrategia Agresiva", objective_type: "INVESTMENT", deleted_at: null,
    items: [
      { id: "i6", instrument_code: "SPY", instrument_type: "CEDEAR", qty: 3, price: 95.50, amount: 286.5, market_order_status_id: "COMPLETED", settlement_date: "2026-03-02" },
      { id: "i7", instrument_code: "QQQ", instrument_type: "CEDEAR", qty: 2, price: 106.75, amount: 213.5, market_order_status_id: "COMPLETED", settlement_date: "2026-03-02" },
    ],
  },
  // Case: Cancelled rescue
  {
    id: "t5", order_num: 12830, order_type: 1, order_status: 3,
    amount: 25000, currency_code: "ARS",
    created_at: "2026-02-27T11:00:00", updated_at: "2026-02-27T11:30:00",
    objective_id: "obj-2", objective_name: "Vacaciones 2026", objective_type: "INVESTMENT", deleted_at: null,
    items: [],
  },
  // Case: ARS subscription with lot difference (executed)
  {
    id: "t6", order_num: 12820, order_type: 0, order_status: 2,
    amount: 200000, currency_code: "ARS", executed_amount: 198432,
    created_at: "2026-02-20T13:45:00", updated_at: "2026-02-20T18:00:00",
    objective_id: "obj-4", objective_name: "Pack Tecnología", objective_type: "PORTFOLIO", deleted_at: null,
    items: [
      { id: "i8", instrument_code: "MELI", instrument_type: "CEDEAR", qty: 5, price: 20000, amount: 100000, market_order_status_id: "COMPLETED", settlement_date: "2026-02-22" },
      { id: "i9", instrument_code: "AAPL", instrument_type: "CEDEAR", qty: 3, price: 18000, amount: 54000, market_order_status_id: "COMPLETED", settlement_date: "2026-02-22" },
    ],
  },
  // Case 3: MEP ramp ARS→USD rescue — rescue in ARS, convert to USD via MEP (executed)
  {
    id: "t7", order_num: 12810, order_type: 1, order_status: 2,
    amount: 200000, currency_code: "ARS", executed_amount: 200000,
    created_at: "2026-02-18T09:00:00", updated_at: "2026-02-19T10:00:00",
    objective_id: "obj-3", objective_name: "Estrategia Agresiva", objective_type: "INVESTMENT", deleted_at: null,
    items: [
      { id: "i15", instrument_code: "SPY", instrument_type: "CEDEAR", qty: 6, price: 95.50, amount: 99500, market_order_status_id: "COMPLETED", settlement_date: "2026-02-20" },
      { id: "i16", instrument_code: "QQQ", instrument_type: "CEDEAR", qty: 5, price: 106.75, amount: 99250, market_order_status_id: "COMPLETED", settlement_date: "2026-02-20" },
    ],
    mep: { direction: "ars_to_usd", original_currency: "ARS", original_amount: 200000, target_currency: "USD", mep_rate: 1150, converted_amount: 173.91 },
  },
  // Case 4: In-process ticket — info may be incomplete
  {
    id: "t8", order_num: 12808, order_type: 0, order_status: 1,
    amount: 300000, currency_code: "ARS",
    created_at: "2026-03-04T12:00:00", updated_at: "2026-03-04T12:00:00",
    objective_id: "obj-6", objective_name: "Fondo de Retiro", objective_type: "RETIREMENT", deleted_at: null,
    items: [
      { id: "i12", instrument_code: "AL30", instrument_type: "BOND", qty: 4, price: 35000, amount: 140000, market_order_status_id: "SENT", settlement_date: null },
      { id: "i13", instrument_code: "GD30", instrument_type: "BOND", qty: 2, price: 43000, amount: 86000, market_order_status_id: "SENDING_PENDING", settlement_date: null },
    ],
  },
];

// Cash movements (from MovementsTB model: deposits, withdrawals, income)
const MOCK_CASH_MOVEMENTS: UnifiedMovement[] = [
  {
    id: "d1", kind: "deposit", title: "Ingreso de dinero",
    subtitle: "Transferencia bancaria",
    amount: 500000, currency: "ARS", date: "2026-03-04T09:00:00",
    status: "completed",
  },
  {
    id: "d2", kind: "deposit", title: "Ingreso de dinero",
    subtitle: "Transferencia bancaria",
    amount: 250000, currency: "ARS", date: "2026-02-25T11:20:00",
    status: "completed",
  },
  {
    id: "d3", kind: "deposit", title: "Ingreso de dinero",
    subtitle: "Transferencia bancaria",
    amount: 100, currency: "USD", date: "2026-02-15T14:30:00",
    status: "completed",
  },
  {
    id: "w1", kind: "withdrawal", title: "Retiro a cuenta bancaria",
    subtitle: "CBU ****4521 · Banco Galicia",
    amount: 120000, currency: "ARS", date: "2026-03-02T16:00:00",
    status: "completed",
  },
  {
    id: "w2", kind: "withdrawal", title: "Retiro a cuenta bancaria",
    subtitle: "CBU ****7890 · Banco Nación",
    amount: 80000, currency: "ARS", date: "2026-02-22T10:00:00",
    status: "pending",
  },
  {
    id: "r1", kind: "income", title: "Renta",
    subtitle: "LECAP S30J5 · Welfi Pesos",
    amount: 12500, currency: "ARS", date: "2026-03-01T00:00:00",
    status: "completed",
  },
  {
    id: "r2", kind: "income", title: "Amortización",
    subtitle: "AL30 · Vacaciones 2026",
    amount: 8300, currency: "ARS", date: "2026-02-28T00:00:00",
    status: "completed",
  },
  {
    id: "r3", kind: "income", title: "Dividendo",
    subtitle: "AAPL · Pack Tecnología",
    amount: 4.75, currency: "USD", date: "2026-02-20T00:00:00",
    status: "completed",
  },
];

// ─── Build unified list ───────────────────────────────────────────────────────

function ticketToMovement(t: Ticket): UnifiedMovement {
  const statusMap: Record<number, UnifiedMovement["status"]> = {
    0: "pending", 1: "processing", 2: "completed", 3: "cancelled", 4: "cancelled", 5: "cancelled", 10: "pending",
  };
  return {
    id: t.id,
    kind: "ticket",
    title: ORDER_TYPE_LABELS[t.order_type],
    subtitle: t.objective_name,
    amount: t.amount,
    currency: t.currency_code,
    date: t.created_at,
    status: statusMap[t.order_status] ?? "pending",
    ticket: t,
  };
}

const ALL_MOVEMENTS: UnifiedMovement[] = [
  ...MOCK_TICKETS.map(ticketToMovement),
  ...MOCK_CASH_MOVEMENTS,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  const f = Math.abs(amount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency === "USD" ? "U$S" : "$"} ${f}`;
}

function getMovementIcon(m: UnifiedMovement) {
  switch (m.kind) {
    case "deposit": return <Wallet className="size-3.5 text-blue-500" />;
    case "withdrawal": return <Building2 className="size-3.5 text-orange-500" />;
    case "income": return <DollarSign className="size-3.5 text-purple-500" />;
    case "ticket":
      if (!m.ticket) return <FileText className="size-3.5 text-gray-400" />;
      if (m.ticket.order_status === 10) return <Calendar className="size-3.5 text-violet-500" />;
      if (m.ticket.order_type === 0 || m.ticket.order_type === 3) return <ArrowDownLeft className="size-3.5 text-emerald-500" />;
      if (m.ticket.order_type === 1 || m.ticket.order_type === 4) return <ArrowUpRight className="size-3.5 text-red-400" />;
      return <DollarSign className="size-3.5 text-blue-500" />;
  }
}

function getMovementIconBg(m: UnifiedMovement) {
  switch (m.kind) {
    case "deposit": return "bg-blue-50";
    case "withdrawal": return "bg-orange-50";
    case "income": return "bg-purple-50";
    case "ticket":
      if (!m.ticket) return "bg-gray-50";
      if (m.ticket.order_status === 10) return "bg-violet-50";
      if (m.ticket.order_type === 0 || m.ticket.order_type === 3) return "bg-emerald-50";
      if (m.ticket.order_type === 1 || m.ticket.order_type === 4) return "bg-red-50";
      return "bg-blue-50";
  }
}

function isPositiveMovement(m: UnifiedMovement): boolean {
  if (m.kind === "deposit" || m.kind === "income") return true;
  if (m.kind === "withdrawal") return false;
  if (m.ticket) return m.ticket.order_type === 0 || m.ticket.order_type === 3;
  return true;
}

function getItemStatusLabel(s: string | null) {
  const map: Record<string, string> = {
    COMPLETED: "Completado", SETTLED: "Liquidado", SENT: "Enviada",
    OFFERED: "Ofertada", SENDING_PENDING: "Pendiente", NONE: "Pendiente",
    CANCELLED: "Cancelada", REJECTED: "Rechazada", EXPIRED: "Expirada",
  };
  return map[s ?? ""] ?? (s ?? "—");
}

function getItemStatusStyle(s: string | null) {
  if (s === "COMPLETED" || s === "SETTLED") return "bg-emerald-50 text-emerald-600";
  if (s === "SENT" || s === "OFFERED") return "bg-blue-50 text-blue-600";
  if (s === "SENDING_PENDING" || s === "NONE") return "bg-amber-50 text-amber-600";
  if (s === "CANCELLED" || s === "REJECTED" || s === "EXPIRED") return "bg-red-50 text-red-500";
  return "bg-gray-50 text-gray-400";
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ icon, iconBg, label, value, sublabel, valueColor }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; sublabel: string; valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider leading-none">{label}</p>
        <p className={`text-[15px] font-bold tracking-tight mt-1 leading-none ${valueColor ?? "text-gray-900"}`}>{value}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{sublabel}</p>
      </div>
    </div>
  );
}

// ─── Movement Row ─────────────────────────────────────────────────────────────

function MovementRow({ movement, onClick }: { movement: UnifiedMovement; onClick: () => void }) {
  const positive = isPositiveMovement(movement);
  const statusStyle = movement.ticket
    ? STATUS_STYLES[movement.ticket.order_status]
    : UNIFIED_STATUS_STYLES[movement.status];
  const statusLabel = movement.ticket
    ? STATUS_LABELS[movement.ticket.order_status]
    : UNIFIED_STATUS_LABELS[movement.status];

  return (
    <button
      id={`mov-${movement.id}`}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors text-left group"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMovementIconBg(movement)} shrink-0`}>
        {getMovementIcon(movement)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">
          {movement.title}
          {movement.subtitle && (
            <>
              <span className="text-gray-300 font-normal"> · </span>
              <span className="text-gray-500 font-medium">{movement.subtitle}</span>
            </>
          )}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
          {formatDate(movement.date)}
          {movement.ticket && <> · #{movement.ticket.order_num}</>}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-[13px] font-bold tabular-nums leading-tight ${positive ? "text-emerald-600" : "text-gray-800"}`}>
          {positive ? "+" : "−"}{formatAmount(movement.amount, movement.currency)}
        </p>
        <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border leading-tight ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ movement, onClose }: { movement: UnifiedMovement; onClose: () => void }) {
  const positive = isPositiveMovement(movement);
  const ticket = movement.ticket;

  const isExecuted = ticket?.order_status === 2;
  const isPending = ticket?.order_status === 0;
  const isProcessing = ticket?.order_status === 1;
  const isInProgress = isPending || isProcessing;
  const isSell = ticket != null && (ticket.order_type === 1 || ticket.order_type === 4);
  const isBuy = ticket != null && (ticket.order_type === 0 || ticket.order_type === 3);

  const statusStyle = ticket ? STATUS_STYLES[ticket.order_status] : UNIFIED_STATUS_STYLES[movement.status];
  const statusLabel = ticket ? STATUS_LABELS[ticket.order_status] : UNIFIED_STATUS_LABELS[movement.status];

  // Detail rows
  const details: { label: string; value: string }[] = [];
  if (ticket) {
    details.push(
      { label: "Número de orden", value: `#${ticket.order_num}` },
      { label: "Tipo", value: ORDER_TYPE_LABELS[ticket.order_type] },
      { label: "Objetivo", value: ticket.objective_name },
      { label: "Moneda", value: ticket.currency_code },
      { label: "Creación", value: formatDate(ticket.created_at) },
      { label: "Actualización", value: formatDate(ticket.updated_at) },
    );
  } else {
    details.push(
      { label: "Tipo", value: movement.kind === "deposit" ? "Ingreso de dinero" : movement.kind === "withdrawal" ? "Retiro de dinero" : "Renta / Amortización / Dividendo" },
      { label: "Detalle", value: movement.subtitle },
      { label: "Moneda", value: movement.currency },
      { label: "Fecha", value: formatDate(movement.date) },
    );
    if (movement.kind === "withdrawal") details.push({ label: "Destino", value: movement.subtitle });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <FileText className="size-4 text-gray-400" />
            <h2 className="text-[15px] font-bold text-gray-900">
              {ticket ? "Detalle del ticket" : "Detalle del movimiento"}
            </h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="size-3.5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* ── In-process / Pending banner ── */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="size-3 text-blue-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-blue-800">Operación en proceso</p>
                <p className="text-[10px] text-blue-600 mt-0.5 leading-relaxed">
                  Esta orden se está ejecutando. Los montos, instrumentos y tipo de cambio son estimados y pueden cambiar hasta que la operación se complete.
                </p>
              </div>
            </div>
          )}
          {isPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="size-3 text-amber-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-amber-800">Operación pendiente</p>
                <p className="text-[10px] text-amber-600 mt-0.5 leading-relaxed">
                  Esta orden está en cola y aún no comenzó a ejecutarse. Los datos mostrados pueden cambiar.
                </p>
              </div>
            </div>
          )}

          {/* ── Amount hero ── */}
          <div className="text-center py-3">
            <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center ${getMovementIconBg(movement)}`}>
              {getMovementIcon(movement)}
            </div>
            <p className={`text-2xl font-bold tracking-tight ${positive ? "text-emerald-600" : "text-gray-900"}`}>
              {positive ? "+" : "−"}{formatAmount(isExecuted ? (ticket?.executed_amount ?? movement.amount) : movement.amount, movement.currency)}
            </p>
            {isInProgress && <p className="text-[10px] text-gray-400 mt-0.5">Monto estimado</p>}
            <span className={`inline-flex items-center mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>

          {/* ── Solicitado vs Invertido/Rescatado ── */}
          {ticket && (isBuy || isSell) && (
            <div className="bg-[#f8f8fa] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">Solicitado</span>
                <span className="text-[13px] tabular-nums font-semibold text-gray-800">
                  {formatAmount(ticket.amount, ticket.currency_code)}
                </span>
              </div>
              {isExecuted && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">{isSell ? "Rescatado" : "Invertido"}</span>
                  <span className="text-[13px] text-gray-900 font-bold tabular-nums">
                    {formatAmount(ticket.executed_amount ?? ticket.amount, ticket.currency_code)}
                  </span>
                </div>
              )}
              {isExecuted && ticket.executed_amount != null && ticket.executed_amount !== ticket.amount && (
                <p className="text-[10px] text-gray-400 leading-relaxed pt-0.5">
                  Diferencia de {formatAmount(Math.abs(ticket.amount - ticket.executed_amount), ticket.currency_code)} por ajuste de lotes.
                </p>
              )}
              {isInProgress && (
                <p className="text-[10px] text-gray-400 italic">El monto final se confirmará cuando la operación se complete.</p>
              )}
            </div>
          )}

          {/* ── Details ── */}
          <div className="bg-[#f8f8fa] rounded-2xl divide-y divide-gray-200/50">
            {details.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] text-gray-400 font-medium">{label}</span>
                <span className="text-[13px] text-gray-800 font-semibold">{value}</span>
              </div>
            ))}
          </div>

          {/* ── MEP Ramp Conversion ── */}
          {ticket?.mep && (() => {
            const mep = ticket.mep;
            const isUsdToArs = mep.direction === "usd_to_ars";
            const soldLabel = isExecuted ? "Vendiste" : "Vendés";
            const receivedLabel = isExecuted
              ? (isUsdToArs ? "Recibiste en ARS" : "Recibiste en USD")
              : (isUsdToArs ? "Recibís en ARS" : "Recibís en USD");
            const soldPrefix = mep.original_currency === "USD" ? "USD" : "$";
            const rcvPrefix = mep.target_currency === "USD" ? "USD" : "$";

            return (
              <div>
                <h3 className="text-[13px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Repeat className="size-3.5 text-blue-500" />
                  Conversión Dólar MEP
                </h3>
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">{soldLabel}</span>
                    <span className="text-[14px] text-gray-900 font-bold tabular-nums">
                      {soldPrefix} {mep.original_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-dashed border-blue-200" />
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {isExecuted ? "Tipo de cambio" : "Dólar MEP (est.)"} $ {mep.mep_rate.toLocaleString("es-AR")}
                    </span>
                    <div className="flex-1 border-t border-dashed border-blue-200" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">{receivedLabel}</span>
                    <span className="text-[14px] text-emerald-600 font-bold tabular-nums">
                      {rcvPrefix} {mep.converted_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {isInProgress && (
                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-3 py-2 mt-1">
                      <p className="text-[10px] text-amber-700 leading-relaxed">
                        ⚠️ La cotización del dólar MEP es estimada y puede variar al momento de ejecutar la operación.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ── Instruments + Expenses (always show gastos) ── */}
          {ticket?.items && ticket.items.length > 0 && (() => {
            const itemsTotal = ticket.items!.reduce((s, i) => s + (i.amount ?? 0), 0);
            const executed = ticket.executed_amount ?? ticket.amount;
            const expenses = Math.max(0, executed - itemsTotal);
            return (
              <div>
                <h3 className="text-[13px] font-bold text-gray-800 mb-2">
                  {isInProgress ? "Instrumentos (parcial)" : "Instrumentos"}
                </h3>
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-3 py-2 bg-[#f8f8fa] text-[9px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div>Ticker</div>
                    <div className="text-right w-12">Cant.</div>
                    <div className="text-right w-16">Precio</div>
                    <div className="text-right w-20">Estado</div>
                  </div>
                  {ticket.items!.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 px-3 py-2 items-center border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-[12px] font-semibold text-gray-800">{item.instrument_code}</p>
                        <p className="text-[9px] text-gray-400">{item.instrument_type}</p>
                      </div>
                      <div className="text-right w-12 text-[12px] text-gray-600 tabular-nums">{item.qty ?? "—"}</div>
                      <div className="text-right w-16 text-[12px] text-gray-600 tabular-nums">{item.price ? `$${item.price.toLocaleString("es-AR")}` : "—"}</div>
                      <div className="text-right w-20">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${getItemStatusStyle(item.market_order_status_id)}`}>
                          {getItemStatusLabel(item.market_order_status_id)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* Summary — always show gastos even if $0 */}
                  <div className="border-t border-gray-200 bg-[#f8f8fa] px-3 py-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-medium">Subtotal instrumentos</span>
                      <span className="text-[12px] text-gray-700 font-semibold tabular-nums">
                        {formatAmount(itemsTotal, ticket.currency_code)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-medium">Gastos y comisiones</span>
                      <span className={`text-[12px] font-semibold tabular-nums ${expenses > 0 ? "text-red-500" : "text-gray-400"}`}>
                        {formatAmount(expenses, ticket.currency_code)}
                      </span>
                    </div>
                    {isExecuted && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200/50">
                        <span className="text-[10px] text-gray-600 font-bold">Total</span>
                        <span className="text-[12px] text-gray-900 font-bold tabular-nums">
                          {formatAmount(executed, ticket.currency_code)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── Settlement timeline ── */}
          {ticket && (
            <div className="bg-[#f8f8fa] rounded-2xl px-4 py-3 space-y-1.5">
              <h4 className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                <Calendar className="size-3 text-gray-400" />
                Plazos de acreditación
              </h4>
              {isSell ? (
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  El rescate se acredita en <span className="font-semibold text-gray-700">1 día hábil</span> si la orden se completa dentro del horario operativo. De lo contrario, se ejecuta automáticamente el siguiente día hábil.
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {ticket.objective_type === "FUND" ? (
                    <>La suscripción a FCI debe realizarse antes de las <span className="font-semibold text-gray-700">15:00 hs</span> para ingresar en el día. Operaciones posteriores se procesan el siguiente día hábil.</>
                  ) : (
                    <>Las órdenes de otros instrumentos deben ingresarse antes de las <span className="font-semibold text-gray-700">16:45 hs</span>. Fuera de horario, se ejecutan automáticamente el siguiente día hábil.</>
                  )}
                </p>
              )}
              {ticket.items?.some((i) => i.settlement_date) && (
                <p className="text-[10px] text-gray-500 mt-1">
                  📅 Liquidación: <span className="font-semibold text-gray-700">{formatDate(ticket.items!.find((i) => i.settlement_date)!.settlement_date!)}</span>
                </p>
              )}
            </div>
          )}

          {/* ── Cancel button (pending only) ── */}
          {isPending && (
            <button className="w-full py-2.5 bg-red-50 border border-red-200 text-red-600 font-bold text-[13px] rounded-xl hover:bg-red-100 transition-colors">
              Cancelar orden
            </button>
          )}

          {/* ── CTAs ── */}
          {isExecuted && (
            <button className="w-full py-2.5 bg-[#3246ff] text-white font-bold text-[13px] rounded-xl hover:bg-[#2031d4] transition-colors">
              Descargar comprobante
            </button>
          )}
          {!ticket && (
            <button className="w-full py-2.5 bg-[#3246ff] text-white font-bold text-[13px] rounded-xl hover:bg-[#2031d4] transition-colors">
              Ver más detalles
            </button>
          )}
        </div>
      </div>
    </>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MovementsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovement, setSelectedMovement] = useState<UnifiedMovement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredMovements = useMemo(() => {
    let result = [...ALL_MOVEMENTS];
    switch (activeFilter) {
      case "tickets": result = result.filter((m) => m.kind === "ticket"); break;
      case "deposits": result = result.filter((m) => m.kind === "deposit"); break;
      case "withdrawals": result = result.filter((m) => m.kind === "withdrawal"); break;
      case "income": result = result.filter((m) => m.kind === "income"); break;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        (m.ticket?.order_num.toString().includes(q))
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredMovements.length / pageSize);
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const kpis = useMemo(() => {
    const deposits = ALL_MOVEMENTS.filter((m) => m.kind === "deposit" && m.status === "completed");
    const withdrawals = ALL_MOVEMENTS.filter((m) => m.kind === "withdrawal" && m.status === "completed");
    const totalDeposits = deposits.reduce((sum, m) => sum + (m.currency === "ARS" ? m.amount : m.amount * 1200), 0);
    const totalWithdrawals = withdrawals.reduce((sum, m) => sum + (m.currency === "ARS" ? m.amount : m.amount * 1200), 0);
    const pendingCount = ALL_MOVEMENTS.filter((m) => m.status === "pending" || m.status === "processing").length;
    return { totalDeposits, depositCount: deposits.length, totalWithdrawals, withdrawalCount: withdrawals.length, pendingCount };
  }, []);

  return (
    <div className="w-full flex flex-col min-h-full bg-[#f5f5f7]">
      <div className="px-4 lg:px-6 pt-2 pb-6 w-full max-w-[1400px] mx-auto space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-0.5 h-5 bg-[#3246ff] rounded-full" />
            <h1 className="text-gray-900 text-lg font-black tracking-tight">Movimientos</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              id="movements-search"
              type="text"
              placeholder="Buscar objetivo, tipo, número..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3246ff]/15 focus:border-[#3246ff]/25 w-60 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map(({ key, label }) => (
            <button
              id={`filter-${key}`}
              key={key}
              onClick={() => { setActiveFilter(key); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${activeFilter === key
                ? "bg-[#3246ff] text-white border-[#3246ff] shadow-sm shadow-blue-500/20"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── KPI Row ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-[20px] px-5">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <KPICard
              icon={<Wallet className="size-4 text-blue-500" />}
              iconBg="bg-blue-50"
              label="Total ingresado"
              value={`$ ${kpis.totalDeposits.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`}
              sublabel={`${kpis.depositCount} depósitos`}
              valueColor="text-blue-600"
            />
            <div className="pl-5">
              <KPICard
                icon={<Building2 className="size-4 text-orange-500" />}
                iconBg="bg-orange-50"
                label="Total retirado"
                value={`$ ${kpis.totalWithdrawals.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`}
                sublabel={`${kpis.withdrawalCount} retiros`}
                valueColor="text-orange-600"
              />
            </div>
            <div className="pl-5">
              <KPICard
                icon={<Clock className="size-4 text-amber-500" />}
                iconBg="bg-amber-50"
                label="Pendientes"
                value={`${kpis.pendingCount} operaciones`}
                sublabel="Requieren procesamiento"
                valueColor="text-amber-600"
              />
            </div>
          </div>
        </div>

        {/* ── Movements List ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-[20px] overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-gray-100 bg-[#fafafa]">
            <div className="w-8 shrink-0" />
            <span className="flex-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-3">Operación</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Monto</span>
          </div>

          {paginatedMovements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <AlertCircle className="size-5 text-gray-300" />
              </div>
              <p className="text-gray-800 font-bold text-[15px]">Sin movimientos</p>
              <p className="text-gray-400 text-[12px] text-center max-w-[240px] mt-1">
                {searchQuery
                  ? `No se encontraron resultados para "${searchQuery}"`
                  : "No hay operaciones con el filtro seleccionado"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {paginatedMovements.map((m) => (
                <MovementRow key={m.id} movement={m} onClick={() => setSelectedMovement(m)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-0.5 py-3 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-all ${currentPage === page ? "bg-[#3246ff] text-white shadow-sm" : "text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selectedMovement && (
        <DetailPanel movement={selectedMovement} onClose={() => setSelectedMovement(null)} />
      )}

      {/* ── Animation ── */}
      <style jsx global>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); opacity: 0.5; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in-right 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
    </div>
  );
}
