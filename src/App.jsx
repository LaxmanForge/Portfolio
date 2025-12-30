import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber"; // The 3D Engine
import { Stars, OrbitControls } from "@react-three/drei"; // Elite Helpers

export default function App() {
  // SYSTEM DESIGN: Tracking our 4 story states
  // 0: Darkness, 1: Lamp On, 2: Focused on PC, 3: Logged In
  const [siteState, setSiteState] = useState(0);

  // THE INTRO TIMER: Automating the Lamp Power-On
  useEffect(() => {
    if (siteState === 0) {
      const timer = setTimeout(() => {
        setSiteState(1); // Move to "Lamp On" after 1.5 seconds
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [siteState]);

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      {/* THE 3D CANVAS: This is your new 3D Engine */}
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        {/* Only show these when the 'Lamp' is powered on (State 1) */}
        {siteState >= 1 && (
          <>
            <ambientLight intensity={0.5} />
            <pointLight
              position={[10, 10, 10]}
              intensity={1.5}
              color="#ffaa00"
            />

            {/* The Starfield background */}
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />

            {/* The Placeholder Cube (Future Desk) */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          </>
        )}

        {/* This allows you to move the camera with your mouse */}
        <OrbitControls enableZoom={true} />
      </Canvas>

      {/* 2D HUD: This sits on top of the 3D world */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          color: "#0f0",
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        {siteState === 0
          ? "> BOOTING SYSTEM..."
          : "> SYSTEM READY | PROTOCOL: PORTFOLIO"}
      </div>
    </div>
  );
}
