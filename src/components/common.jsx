import { useState } from "react";
import { POST_TYPES } from "../data/mockData";

export function Avatar({ initials, role, size = 40 }) {
  const isAan = role === "aan";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isAan
          ? "linear-gradient(135deg, #1a2332, #2a3a52)"
          : "linear-gradient(135deg, #e8e4df, #d4cfc8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.32,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        color: isAan ? "#c5a24d" : "#5a5347",
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
            background: "#c5a24d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.18,
            color: "#1a2332",
            fontWeight: 800,
            border: "2px solid #fff",
          }}
        >
          ✓
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
        borderRadius: 20,
        background: t.color + "14",
        color: t.color,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <span style={{ fontSize: small ? 8 : 10 }}>{t.icon}</span> {t.label}
    </span>
  );
}

export function AanBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 20,
        background: "linear-gradient(135deg, #c5a24d22, #c5a24d11)",
        color: "#b8932e",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontFamily: "'Manrope', sans-serif",
        border: "1px solid #c5a24d33",
      }}
    >
      <span style={{ fontSize: 10 }}>✦</span> AAN Endorsed
    </span>
  );
}

export function PriorityBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 20,
        background: "#d4764e15",
        color: "#c4603a",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontFamily: "'Manrope', sans-serif",
        border: "1px solid #d4764e33",
      }}
    >
      ◈ Priority Need
    </span>
  );
}

export function ActionButton({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        borderRadius: 20,
        border: "none",
        background: hov ? "#f4f2ef" : "transparent",
        color: active ? "#1a2332" : "#9a9488",
        fontSize: 13.5,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label !== undefined && <span>{label}</span>}
    </button>
  );
}

export function AanToolButton({ label, icon, active, onClick, color }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 12px",
        borderRadius: 20,
        border: `1px solid ${active ? color : hov ? color + "60" : "#e8e4df"}`,
        background: active ? color + "15" : hov ? color + "08" : "transparent",
        color: active ? color : hov ? color : "#9a9488",
        fontSize: 12,
        fontFamily: "'Manrope', sans-serif",
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
