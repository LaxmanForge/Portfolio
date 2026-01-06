import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  PerspectiveCamera,
  Html,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

/* =========================================
   1. COFFEE OFFSET
   ========================================= */
const COFFEE_OFFSET_X = 0.03;
const COFFEE_OFFSET_Z = -0.11;
const STEAM_OFFSET_X = 0.04;
const STEAM_OFFSET_Z = -0.09;

function HDEnabler() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, [gl]);
  return null;
}

/* =========================================
   2. HIGH-RES COMPONENTS
   ========================================= */

/* --- PROFESSIONAL SVG LOGO (Corrected "LA" - No Dots) --- */
const LALogo = () => (
  <svg
    width="280px"
    height="280px"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* The 'L' Shape */}
    <path d="M25 25 V75 H65 V65 H35 V25 H25Z" fill="white" />

    {/* The 'A' Shape (Now with Crossbar) */}
    <path
      d="M65 75 L80 25 H90 L105 75 H95 L91 60 H79 L75 75 H65Z"
      fill="white"
    />
    {/* 'A' Crossbar Hole */}
    <path d="M82 35 L89 55 H81 L82 35Z" fill="black" />
  </svg>
);

/* --- BOOT SCREEN (Fixed Spacing & Stable Access) --- */
function BootScreen() {
  const [phase, setPhase] = useState("logo");
  const [progress, setProgress] = useState(0);
  // Removed cursor state to prevent jumping

  // 1. Logo Timer
  useEffect(() => {
    if (phase === "logo") {
      const timer = setTimeout(() => setPhase("loading"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 2. High-Grade Progress Bar Logic
  useEffect(() => {
    if (phase === "loading") {
      const interval = setInterval(() => {
        setProgress((old) => {
          const increment = Math.random() * 4 + 1;
          const next = old + increment;
          if (next >= 100) {
            clearInterval(interval);
            setPhase("identify");
            return 100;
          }
          return next;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // 3. Identification
  useEffect(() => {
    if (phase === "identify") {
      const timer = setTimeout(() => setPhase("access"), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    // OUTER WRAPPER
    <div
      style={{
        width: "280px",
        height: "130px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {/* INNER CONTENT (High Res) */}
      <div
        style={{
          width: "1120px", // 4x Width
          height: "520px", // 4x Height
          transform: "scale(0.25)",
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Space Mono', monospace",
          color: "white",
          textAlign: "center",
          background: "transparent",
        }}
      >
        {/* PHASE 1: LOGO */}
        {phase === "logo" && (
          <div style={{ animation: "fadeIn 0.8s ease-in-out" }}>
            <LALogo />
          </div>
        )}

        {/* PHASE 2: PROGRESS BAR */}
        {phase === "loading" && (
          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "20px",
                color: "white",
                width: "100%",
                display: "flex",
                justifyContent: "space-between", // Pushes text to edges
                gap: "50px", // EXTRA SAFETY GAP
                textShadow: "0 0 10px white",
              }}
            >
              <span>LOADING KERNEL</span>
              <span>{Math.floor(progress)}%</span>
            </div>

            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#111",
                border: "2px solid #333",
                borderRadius: "4px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "white",
                  boxShadow: "0 0 40px white",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </div>
        )}

        {/* PHASE 3: IDENTIFY */}
        {phase === "identify" && (
          <div
            style={{
              fontSize: "64px",
              color: "#ccc",
              letterSpacing: "8px",
              marginTop: "40px",
            }}
          >
            VERIFYING ID...
          </div>
        )}

        {/* PHASE 4: ACCESS GRANTED (Stable, No Jumping) */}
        {phase === "access" && (
          <div
            style={{
              border: "4px solid white",
              padding: "40px 60px",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
              width: "auto", // Auto width prevents layout shifts
            }}
          >
            <div
              style={{
                fontSize: "32px",
                color: "#aaa",
                marginBottom: "20px",
                letterSpacing: "4px",
                borderBottom: "2px solid #555",
                paddingBottom: "10px",
                width: "100%",
              }}
            >
              STATUS: VERIFIED
            </div>
            <div
              style={{
                fontSize: "80px",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "2px",
                textShadow: "0 0 15px white",
                whiteSpace: "nowrap", // Prevents wrapping
              }}
            >
              ACCESS GRANTED
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================
   3. 3D MODELS
   ========================================= */

function CyberPC({ scale = 1, ...props }) {
  return (
    <group {...props} scale={scale}>
      {/* 1. MONITOR FRAME */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[3.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#050505" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* 2. SCREEN SURFACE */}
      <mesh position={[0, 1.1, 0.051]}>
        <planeGeometry args={[3.1, 1.4]} />
        <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 3. HTML SCREEN (SCALE 0.43) */}
      <Html
        transform
        occlude="blending"
        scale={0.43}
        position={[-0.01, 1.1, 0.053]}
        rotation={[0, 0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <BootScreen />
      </Html>

      {/* 4. STAND */}
      <mesh position={[0, 0.25, -0.1]}>
        <cylinderGeometry args={[0.08, 0.15, 0.6, 32]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={1} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>

      {/* 5. TOWER */}
      <group position={[2.3, 0.6, 0.2]}>
        <mesh>
          <boxGeometry args={[0.55, 1.3, 1.3]} />
          <meshStandardMaterial
            color="#080808"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0.28, 0, 0.4]}>
          <boxGeometry args={[0.02, 1.1, 0.05]} />
          <meshStandardMaterial
            color="#00ff44"
            emissive="#00ff44"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    </group>
  );
}

/* --- STEAM & CLOUDS --- */
function getCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

function NaturalSteam({ position, isLampOn }) {
  const groupRef = useRef();
  const cloudTexture = useMemo(() => getCloudTexture(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, () => ({
        x: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03,
        speed: 0.004 + Math.random() * 0.003,
        offset: Math.random() * 100,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const data = particles[i];
      child.position.y += data.speed;
      child.position.x =
        data.x +
        Math.sin(time * 1.5 + data.offset) * 0.01 * (child.position.y * 3);
      child.position.z =
        data.z +
        Math.cos(time * 1.0 + data.offset) * 0.01 * (child.position.y * 3);
      const life = child.position.y;
      child.scale.setScalar(0.05 + life * 0.6);
      const baseOpacity = isLampOn ? 0.6 : 0.15;
      child.material.opacity = Math.max(0, baseOpacity - life * 1.2);
      if (life > 0.5 || child.material.opacity <= 0) {
        child.position.y = 0;
        child.position.x = data.x;
        child.position.z = data.z;
        child.scale.setScalar(0.05);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {particles.map((_, i) => (
        <sprite key={i} position={[0, 0, 0]}>
          <spriteMaterial
            map={cloudTexture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function CoffeeMug({ mugScene, position, rotation, isLampOn }) {
  return (
    <group position={position} rotation={rotation}>
      <primitive object={mugScene} scale={0.5} />
      <mesh
        position={[COFFEE_OFFSET_X, 0.2, COFFEE_OFFSET_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.082, 32]} />
        <meshBasicMaterial color="#0a0503" />
      </mesh>
      <NaturalSteam
        position={[STEAM_OFFSET_X, 0.22, STEAM_OFFSET_Z]}
        isLampOn={isLampOn}
      />
    </group>
  );
}

/* --- MAIN SCENE --- */
function OfficeScene() {
  const lamp = useGLTF("/lamp.glb");
  const mug = useGLTF("/mug.glb");
  const noteTexture = useTexture("/note.png");
  const { gl } = useThree();

  const [isLampOn, setLampOn] = useState(true);
  const [hoveredLamp, setHoverLamp] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hoveredLamp ? "pointer" : "auto";
  }, [hoveredLamp]);

  useMemo(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    noteTexture.anisotropy = maxAnisotropy;
    noteTexture.magFilter = THREE.LinearFilter;
    noteTexture.minFilter = THREE.LinearFilter;

    [lamp.scene, mug.scene].forEach((scene) => {
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material.map) {
            obj.material.map.anisotropy = maxAnisotropy;
            obj.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
    });
  }, [mug, lamp, noteTexture, gl]);

  return (
    <group position={[0, -0.5, 0]}>
      {/* LIGHTING */}
      <ambientLight intensity={isLampOn ? 0.5 : 0.02} color="#d0e0ff" />
      <directionalLight
        position={[-5, 5, 0]}
        intensity={isLampOn ? 1 : 0}
        color="#b0c4de"
      />
      <directionalLight
        position={[2, 5, 2]}
        intensity={isLampOn ? 1.5 : 0}
        castShadow
      />

      {/* DESK */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#3d2817" roughness={0.5} />
      </mesh>

      {/* PC */}
      <group>
        <CyberPC position={[0, 0.05, -0.2]} scale={0.75} />
      </group>

      {/* LAMP */}
      <group position={[-1.5, 0.06, 0.1]}>
        <primitive object={lamp.scene} scale={1.6} />
        <mesh
          visible={false}
          position={[0, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setLampOn(!isLampOn);
          }}
          onPointerOver={() => setHoverLamp(true)}
          onPointerOut={() => setHoverLamp(false)}
        >
          <boxGeometry args={[0.6, 1.2, 0.6]} />
        </mesh>
        <pointLight
          position={[0, 0.8, 0]}
          intensity={isLampOn ? 30 : 0}
          color="#ffaa00"
          distance={5}
          decay={2}
          castShadow
        />
      </group>

      {/* MUG */}
      <group position={[1.0, 0.05, 0.3]} rotation={[0, -0.5, 0]}>
        <CoffeeMug
          mugScene={mug.scene}
          rotation={[0, 0, 0]}
          isLampOn={isLampOn}
        />
      </group>

      {/* NOTE */}
      <group position={[0.7, 0.27, -0.14]} rotation={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.25, 0.25]} />
          <meshStandardMaterial
            map={noteTexture}
            transparent
            opacity={0.9}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 0.11, 0.002]} rotation={[0, 0, 0.05]}>
          <planeGeometry args={[0.12, 0.03]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      <HDEnabler />
    </group>
  );
}

export default function App() {
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#1a1a1a" }}
    >
      <Canvas shadows dpr={window.devicePixelRatio} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 4]} fov={45} />
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.6}
          scale={10}
          blur={2.5}
          far={1}
        />
        <Suspense fallback={null}>
          <OfficeScene />
        </Suspense>
        <OrbitControls
          target={[0, 0, 0]}
          minAzimuthAngle={-Math.PI / 2.5}
          maxAzimuthAngle={Math.PI / 2.5}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
