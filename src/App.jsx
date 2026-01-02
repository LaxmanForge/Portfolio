import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  PerspectiveCamera,
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

/* --- CYBER PC (TITAN EDITION - NO HTML) --- */
function CyberPC({ scale = 1, ...props }) {
  return (
    <group {...props} scale={scale}>
      {/* 1. MONITOR FRAME */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[3.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#050505" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* 2. SCREEN SURFACE (Blank Black Glass) */}
      <mesh position={[0, 1.1, 0.051]}>
        <planeGeometry args={[3.1, 1.4]} />
        <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 3. MONITOR STAND */}
      <mesh position={[0, 0.25, -0.1]}>
        <cylinderGeometry args={[0.08, 0.15, 0.6, 32]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={1} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>

      {/* 4. CPU TOWER */}
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
      // ZOOM: Target Y: 1.1 (Center), Z: 1.6 (Full view)
      state.camera.position.lerp(new THREE.Vector3(0, 1.1, 1.6), 0.04);
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
        <CyberPC position={[0, 0.05, -0.2]} scale={0.75} />
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
