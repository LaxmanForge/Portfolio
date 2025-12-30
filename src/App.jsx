import React, { useState, useEffect } from "react";

export default function App() {
  // SYSTEM DESIGN: Tracking our 4 story states
  // 0: Darkness, 1: Lamp On, 2: Focused on PC, 3: Logged In
  const [siteState, setSiteState] = useState(0);

  // THE INTRO TIMER: Automating the Lamp Power-On
  useEffect(() => {
    if (siteState === 0) {
      const timer = setTimeout(() => {
        setSiteState(1); // Move to "Lamp On" after 1.5 seconds
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [siteState]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: siteState === 0 ? "black" : "#0a0a0a",
        color: "#0f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        transition: "all 1s ease",
      }}
    >
      {/* 1. INITIALIZING STATE */}
      {siteState === 0 && (
        <p style={{ fontSize: "1.2rem" }}>[ SYSTEM BOOTING... ]</p>
      )}

      {/* 2. LAMP POWERED ON STATE */}
      {siteState === 1 && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem" }}>[ LAMP POWERED ON ]</p>
          <p style={{ color: "#888", marginBottom: "20px" }}>
            The desk is now visible.
          </p>
          <button
            onClick={() => setSiteState(2)}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#0f0",
              border: "1px solid #0f0",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            APPROACH TERMINAL
          </button>
        </div>
      )}

      {/* 3. TERMINAL FOCUS STATE */}
      {siteState === 2 && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#0f0" }}>ENTER ACCESS KEY (ANYTHING)</p>
          <input
            type="text"
            autoFocus
            onChange={(e) => {
              if (e.target.value.length > 0) setSiteState(3);
            }}
            style={{
              background: "black",
              color: "#0f0",
              border: "1px solid #0f0",
              textAlign: "center",
              padding: "10px",
              outline: "none",
              marginTop: "10px",
            }}
          />
        </div>
      )}

      {/* 4. ACCESS GRANTED STATE */}
      {siteState === 3 && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#0f0" }}>ACCESS GRANTED. WELCOME HR.</p>
          <h1 style={{ fontSize: "2.5rem", marginTop: "10px" }}>
            📁 SECRET_FILES
          </h1>
        </div>
      )}
    </div>
  );
}
