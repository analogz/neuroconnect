import { useState } from "react";
import { CONDITIONS, REGIONS } from "../data/mockData";
import { Diamond } from "lucide-react";

export function OnboardingScreen({ onComplete, onGoogleSignIn, isDemo, userName = "", skipWelcome = false }) {
  const [step, setStep] = useState(skipWelcome ? 1 : 0);
  const [name, setName] = useState(userName);
  const [role, setRole] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [fadeIn, setFadeIn] = useState(true);

  const nextStep = () => {
    setFadeIn(false);
    setTimeout(() => {
      setStep((s) => s + 1);
      setFadeIn(true);
    }, 300);
  };

  const finish = () => {
    onComplete({
      name: name || "Alex Morgan",
      role: role || "community",
      conditions: selectedConditions.length ? selectedConditions : ["Epilepsy", "Stroke"],
      region: region || "Northeast US",
      location: location || "Boston, MA",
    });
  };

  const toggleCondition = (c) => {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const pillStyle = (selected) => ({
    padding: "8px 18px",
    borderRadius: 50,
    border: selected ? "2px solid var(--color-primary)" : "1px solid var(--color-border-muted)",
    background: selected ? "var(--color-primary)" : "var(--color-surface)",
    color: selected ? "#fff" : "#5a5347",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const continueBtn = {
    padding: "12px 36px",
    borderRadius: 50,
    background: "var(--color-primary)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, var(--color-gold) ${((step + 1) / 5) * 100}%, var(--color-border) ${((step + 1) / 5) * 100}%)`,
          transition: "background 0.5s",
        }}
      />

      <div
        style={{
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.3s ease",
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
        }}
      >
        {step === 0 && (
          <div>
            <Diamond size={48} style={{ marginBottom: 12, opacity: 0.15, color: "var(--color-text)" }} />
            <h1 className="heading" style={{ fontSize: 42, marginBottom: 8, lineHeight: 1.1 }}>
              NeuroConnect
            </h1>
            <p style={{
              fontSize: 17,
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              maxWidth: 400,
              margin: "0 auto 40px",
            }}>
              A community platform for identifying and acting on neurologic care
              needs — with AAN oversight.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button
                onClick={nextStep}
                className="btn btn-primary"
                style={{
                  padding: "14px 48px",
                  fontSize: 15,
                  letterSpacing: "0.03em",
                }}
              >
                Get Started
              </button>
              {!isDemo && onGoogleSignIn && (
                <button
                  onClick={onGoogleSignIn}
                  style={{
                    padding: "12px 32px",
                    borderRadius: 50,
                    background: "var(--color-surface)",
                    color: "#5a5347",
                    fontSize: 14,
                    fontWeight: 500,
                    border: "1px solid var(--color-border-muted)",
                    cursor: "pointer",
                  }}
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ textAlign: "left" }}>
            <p className="step-indicator">Step 1 of 4</p>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 8 }}>
              What's your name?
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 28 }}>
              How you'll appear to the community.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="input"
              style={{ padding: "14px 18px", fontSize: 16 }}
            />
            <div style={{ marginTop: 32 }}>
              <button onClick={nextStep} style={continueBtn}>Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: "left" }}>
            <p className="step-indicator">Step 2 of 4</p>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 8 }}>
              Your role
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 28 }}>
              This determines your tools and how others see you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { value: "community", label: "Community Member", desc: "Patient, caregiver, advocate, or ally" },
                { value: "aan", label: "AAN Member", desc: "Verified neurologist or AAN fellow" },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    padding: "18px 22px",
                    borderRadius: 14,
                    border: role === r.value ? "2px solid var(--color-primary)" : "1px solid var(--color-border-muted)",
                    background: role === r.value ? "#1a233208" : "var(--color-surface)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button onClick={nextStep} style={continueBtn}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "left" }}>
            <p className="step-indicator">Step 3 of 4</p>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 8 }}>
              Conditions you follow
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 28 }}>
              Select all that matter to you. This shapes your feed.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CONDITIONS.map((c) => (
                <button key={c} onClick={() => toggleCondition(c)} style={pillStyle(selectedConditions.includes(c))}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button onClick={nextStep} style={continueBtn}>Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "left" }}>
            <p className="step-indicator">Step 4 of 4</p>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 8 }}>
              Where are you?
            </h2>
            <p style={{ fontSize: 15, color: "var(--color-text-muted)", marginBottom: 28 }}>
              We'll surface needs and initiatives near you.
            </p>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="input"
              style={{ padding: "14px 18px", fontSize: 16, marginBottom: 16 }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegion(r)} style={{ ...pillStyle(region === r), fontSize: 13, padding: "8px 16px" }}>
                  {r}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button
                onClick={finish}
                className="btn btn-primary"
                style={{
                  padding: "14px 48px",
                  fontSize: 15,
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                  letterSpacing: "0.03em",
                }}
              >
                Enter NeuroConnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
