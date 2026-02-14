import { useState } from "react";
import { POST_TYPES, NEED_STATUSES } from "../data/mockData";
import {
  Check, Star, AlertTriangle, Circle, Clock, CheckCircle,
  Rocket, BookOpen, MessageCircle, Sparkles, Users, TrendingUp,
  Heart, MessageSquare, Bookmark, ChevronDown,
  MapPin, Bell, ArrowLeft, LogOut, Plus, Search, X,
} from "lucide-react";

const ICON_MAP = {
  AlertTriangle, Circle, Clock, CheckCircle, Rocket, BookOpen,
  MessageCircle, Sparkles, Users, TrendingUp, Check, Star,
  Heart, MessageSquare, Bookmark, ChevronDown,
  MapPin, Bell, ArrowLeft, LogOut, Plus, Search, X,
};

export function Logo({ size = 24, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Stem */}
      <line x1="16" y1="27" x2="16" y2="15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* Left branch */}
      <path d="M16 15 Q10 11 6 5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Right branch */}
      <path d="M16 15 Q22 11 26 5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Junction */}
      <circle cx="16" cy="15" r="3.2" fill="currentColor" />
      {/* Terminals */}
      <circle cx="6" cy="5" r="2.4" fill="currentColor" />
      <circle cx="26" cy="5" r="2.4" fill="currentColor" />
      <circle cx="16" cy="27" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Icon({ name, size = 14, ...props }) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  return <Comp size={size} {...props} />;
}

export function Avatar({ initials, role, size = 40 }) {
  const isAan = role === "aan";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isAan
          ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
          : "linear-gradient(135deg, var(--color-border), var(--color-border-muted))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        fontFamily: "var(--font-serif)",
        fontWeight: 700,
        color: isAan ? "var(--color-gold)" : "#5a5347",
        letterSpacing: "0.02em",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {initials}
      {isAan && (
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: "50%",
            background: "var(--color-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            border: "2px solid #fff",
          }}
        >
          <Check size={size * 0.18} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

export function TypeBadge({ type, small }) {
  const t = POST_TYPES[type];
  if (!t) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 8px" : "3px 12px",
        borderRadius: "var(--radius-full)",
        background: t.color + "14",
        color: t.color,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <Icon name={t.icon} size={small ? 10 : 12} /> {t.label}
    </span>
  );
}

export function AanBadge() {
  return (
    <span
      className="badge"
      style={{
        background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
        color: "var(--color-gold-dark)",
        border: "1px solid #c5a24d33",
      }}
    >
      <Star size={10} /> AAN Endorsed
    </span>
  );
}

export function PriorityBadge() {
  return (
    <span
      className="badge"
      style={{
        background: "#d4764e15",
        color: "#c4603a",
        border: "1px solid #d4764e33",
      }}
    >
      <AlertTriangle size={10} /> Priority Need
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = NEED_STATUSES[status];
  if (!s) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 12px",
        borderRadius: "var(--radius-full)",
        background: s.color + "14",
        color: s.color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        border: `1px solid ${s.color}30`,
      }}
    >
      <Icon name={s.icon} size={11} /> {s.label}
    </span>
  );
}

export function StatusSelector({ currentStatus, onChangeStatus }) {
  const [open, setOpen] = useState(false);
  const current = NEED_STATUSES[currentStatus] || NEED_STATUSES.open;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          background: current.color + "14",
          color: current.color,
          fontSize: 12,
          fontWeight: 700,
          border: `1px solid ${current.color}40`,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.03em",
        }}
      >
        <Icon name={current.icon} size={12} />
        {current.label}
        <ChevronDown size={10} style={{ opacity: 0.6 }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "var(--color-surface)",
            borderRadius: 14,
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
            padding: 6,
            zIndex: 20,
            minWidth: 160,
          }}
        >
          {Object.entries(NEED_STATUSES).map(([key, val]) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(key);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: currentStatus === key ? val.color + "12" : "transparent",
                color: currentStatus === key ? val.color : "var(--color-text-secondary)",
                fontSize: 13,
                fontWeight: currentStatus === key ? 700 : 500,
                cursor: "pointer",
                transition: "background 0.15s",
                textAlign: "left",
              }}
            >
              <Icon name={val.icon} size={11} style={{ color: val.color }} />
              {val.label}
              {currentStatus === key && <Check size={11} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ActionButton({ icon, label, active, onClick }) {
  return (
    <button
      className="btn-ghost"
      data-active={active ? "true" : undefined}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 5 }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label !== undefined && <span>{label}</span>}
    </button>
  );
}

export function AanToolButton({ label, icon, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 12px",
        borderRadius: "var(--radius-full)",
        border: `1px solid ${active ? color : "var(--color-border)"}`,
        background: active ? color + "15" : "transparent",
        color: active ? color : "var(--color-text-faint)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ fontSize: 10 }}>{icon}</span>
      {label}
    </button>
  );
}
