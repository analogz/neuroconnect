import { useState } from "react";
import { CONDITIONS, REGIONS } from "../data/mockData";

export function OnboardingScreen({ onComplete, onGoogleSignIn, isDemo }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
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
      conditions: selectedConditions.length
        ? selectedConditions
        : ["Epilepsy", "Stroke"],
      region: region || "Northeast US",
      location: location || "Boston, MA",
    });
  };

  const toggleCondition = (c) => {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid #d4cfc8",
    fontSize: 16,
    fontFamily: "'Manrope', sans-serif",
    background: "#faf9f7",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f5",
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
          background: `linear-gradient(90deg, #c5a24d ${((step + 1) / 5) * 100}%, #e8e4df ${((step + 1) / 5) * 100}%)`,
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
            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.15 }}>◇</div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42,
                fontWeight: 600,
                color: "#1a2332",
                marginBottom: 8,
                lineHeight: 1.1,
              }}
            >
              NeuroConnect
            </h1>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 17,
                color: "#7a746b",
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 400,
                margin: "0 auto 40px",
              }}
            >
              A community platform for identifying and acting on neurologic care
              needs — with AAN oversight.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button
                onClick={nextStep}
                style={{
                  padding: "14px 48px",
                  borderRadius: 50,
                  background: "#1a2332",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 8px 24px #1a233230";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "";
                  e.target.style.boxShadow = "";
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
                    background: "#fff",
                    color: "#5a5347",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "'Manrope', sans-serif",
                    border: "1px solid #d4cfc8",
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
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#c5a24d",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Step 1 of 4
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: "#1a2332",
                marginBottom: 8,
              }}
            >
              What's your name?
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "#7a746b", marginBottom: 28 }}>
              How you'll appear to the community.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#c5a24d")}
              onBlur={(e) => (e.target.style.borderColor = "#d4cfc8")}
            />
            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <button
                onClick={nextStep}
                style={{
                  padding: "12px 36px",
                  borderRadius: 50,
                  background: "#1a2332",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#c5a24d",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Step 2 of 4
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: "#1a2332",
                marginBottom: 8,
              }}
            >
              Your role
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "#7a746b", marginBottom: 28 }}>
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
                    border: role === r.value ? "2px solid #1a2332" : "1px solid #d4cfc8",
                    background: role === r.value ? "#1a233208" : "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600, color: "#1a2332" }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#7a746b", marginTop: 2 }}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button
                onClick={nextStep}
                style={{
                  padding: "12px 36px",
                  borderRadius: 50,
                  background: "#1a2332",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#c5a24d",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Step 3 of 4
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: "#1a2332",
                marginBottom: 8,
              }}
            >
              Conditions you follow
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "#7a746b", marginBottom: 28 }}>
              Select all that matter to you. This shapes your feed.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 50,
                    border: selectedConditions.includes(c) ? "2px solid #1a2332" : "1px solid #d4cfc8",
                    background: selectedConditions.includes(c) ? "#1a2332" : "#fff",
                    color: selectedConditions.includes(c) ? "#fff" : "#5a5347",
                    fontSize: 14,
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button
                onClick={nextStep}
                style={{
                  padding: "12px 36px",
                  borderRadius: 50,
                  background: "#1a2332",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#c5a24d",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Step 4 of 4
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 600,
                color: "#1a2332",
                marginBottom: 8,
              }}
            >
              Where are you?
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "#7a746b", marginBottom: 28 }}>
              We'll surface needs and initiatives near you.
            </p>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              style={{ ...inputStyle, marginBottom: 16 }}
              onFocus={(e) => (e.target.style.borderColor = "#c5a24d")}
              onBlur={(e) => (e.target.style.borderColor = "#d4cfc8")}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 50,
                    border: region === r ? "2px solid #1a2332" : "1px solid #d4cfc8",
                    background: region === r ? "#1a2332" : "#fff",
                    color: region === r ? "#fff" : "#5a5347",
                    fontSize: 13,
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button
                onClick={finish}
                style={{
                  padding: "14px 48px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg, #1a2332, #2a3a52)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                  border: "none",
                  cursor: "pointer",
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
