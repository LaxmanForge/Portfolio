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

/* =========================================
   2. NOTE OFFSET
   ========================================= */
const NOTE_OFFSET_X = -0.1;
const NOTE_OFFSET_Y = 0.6;
const NOTE_OFFSET_Z = 0.68;
/* ========================================= */

function HDEnabler() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
  }, [gl]);
  return null;
}

/* --- CYBER PC (TITAN EDITION) --- */
function CyberPC({ scale = 1, isClicked, ...props }) {
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

      {/* 3. HTML CONTENT */}
      {isClicked && (
        <Html
          transform
          wrapperClass="htmlScreen"
          distanceFactor={2.4}
          position={[0, 1.1, 0.052]}
          rotation={[0, 0, 0]}
        >
          <div
            style={{
              background: "#000",
              color: "#00ff44",
              fontFamily: "monospace",
              width: "1280px",
              height: "580px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "4px solid #111",
              boxSizing: "border-box",
              padding: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "80px",
                margin: "0",
                textShadow: "0 0 15px #00ff44",
                letterSpacing: "5px",
              }}
            >
              SYSTEM LOCKED
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#666",
                marginTop: "10px",
                letterSpacing: "2px",
              }}
            >
              SECURE TERMINAL // AUTH REQUIRED
            </p>
            <div
              style={{
                width: "100%",
                height: "2px",
                background: "#333",
                margin: "40px 0",
              }}
            />

            <input
              type="text"
              placeholder="ENTER PASSWORD"
              autoFocus
              style={{
                fontSize: "40px",
                padding: "20px",
                width: "60%",
                background: "#050505",
                border: "2px solid #00ff44",
                color: "#fff",
                textAlign: "center",
                outline: "none",
                letterSpacing: "3px",
              }}
              onChange={(e) => {
                if (e.target.value.toLowerCase() === "claude shannon")
                  alert("ACCESS GRANTED");
              }}
            />
            <p
              style={{
                fontSize: "20px",
                color: "#444",
                marginTop: "60px",
                cursor: "pointer",
              }}
            >
              (Click outside monitor to exit)
            </p>
          </div>
        </Html>
      )}

      {/* 4. MONITOR STAND */}
      <mesh position={[0, 0.25, -0.1]}>
        <cylinderGeometry args={[0.08, 0.15, 0.6, 32]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={1} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>

      {/* 5. CPU TOWER */}
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

function OfficeScene({ isClicked, setClicked }) {
  const lamp = useGLTF("/lamp.glb");
  const mug = useGLTF("/mug.glb");
  const noteTexture = useTexture("/note.png");
  const { gl } = useThree();

  const [isLampOn, setLampOn] = useState(true);
  const [hoveredLamp, setHoverLamp] = useState(false);
  const [hoveredPC, setHoverPC] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hoveredLamp || hoveredPC ? "pointer" : "auto";
  }, [hoveredLamp, hoveredPC]);

  const mugGroupRef = useRef();

  useFrame((state) => {
    if (isClicked) {
      // ZOOM FIX:
      // Target Y: 1.1 (Center of screen)
      // Target Z: 4.5 (Pulled back to fit the HUGE monitor width)
      state.camera.position.lerp(new THREE.Vector3(0, 1.1, 4.5), 0.04);
      state.camera.lookAt(0, 1.1, 0);
    }
  });

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
      {/* --- LIGHTING --- */}
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

      {/* CUSTOM CYBER PC */}
      <group
        onPointerOver={() => setHoverPC(true)}
        onPointerOut={() => setHoverPC(false)}
        onClick={(e) => {
          e.stopPropagation();
          setClicked(!isClicked);
        }}
      >
        <CyberPC
          position={[0, 0.05, -0.2]}
          scale={0.75}
          isClicked={isClicked}
        />
      </group>

      {/* LAMP */}
      <group position={[-1.5, 0.06, 0.1]}>
        <primitive object={lamp.scene} scale={1.6} />
        {/* HITBOX */}
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

      {/* NOTE + TAPE */}
      <group position={[1.3, 0.35, -0.05]} rotation={[0, 1.57, 0]}>
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
  const [clicked, setClicked] = useState(false);
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
          <OfficeScene isClicked={clicked} setClicked={setClicked} />
        </Suspense>
        <OrbitControls
          target={[0, 0, 0]}
          enabled={!clicked}
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
