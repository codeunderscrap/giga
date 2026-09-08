"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";

type Callout = {
  position: [number, number, number];
  label: string;
  value: string;
};

const callouts: Callout[] = [
  { position: [0.05, 0.85, 0.3], label: "NOMINAL VOLTAGE", value: "3.7 V" },
  { position: [-0.5, 0, 0.15], label: "CAPACITY", value: "5000 mAh" },
  { position: [0.28, -0.95, -0.2], label: "CHEMISTRY", value: "NMC Li-ion" },
]

function HudLabel({ position, label, value }: Callout) {
  return (
    <Html position={position} distanceFactor={4.6} zIndexRange={[10, 0]} occlude={false}>
      <div
        className="pointer-events-none select-none whitespace-nowrap rounded-xl px-2.5 py-1.5 text-left"
        style={{
          background: "rgba(10, 22, 36, 0.55)",
          backdropFilter: "blur(14px) saturate(180%)",
          WebkitBackdropFilter: "blur(14px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <div className="text-[9px] tracking-[0.14em] text-[#8FA6BA] font-semibold">{label}</div>
        <div className="text-sm font-bold text-white leading-tight">{value}</div>
      </div>
    </Html>
  );
}

// A printed-label texture, drawn once on a canvas — a real cell's wrap
// always carries text/markings, and that's a big part of what makes a flat
// color read as "toy" rather than "manufactured product".
function useLabelTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#E8571A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "rgba(255,255,255,0.10)");
    grad.addColorStop(0.5, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 6, 0);
    ctx.lineTo(canvas.width - 6, canvas.height);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 78px Arial";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("MINIMINES", 46, 190);

    ctx.font = "500 34px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillText("Li-ion NMC  ·  3.7V  ·  5000mAh", 48, 240);

    // Barcode-like ticks — deterministic pattern, not Math.random(), to stay a pure render
    let x = 48;
    let seed = 0;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    while (x < 420) {
      seed = (seed * 9301 + 49297) % 233280;
      const w = 2 + (seed / 233280) * 5;
      ctx.fillRect(x, 320, w, 70);
      seed = (seed * 9301 + 49297) % 233280;
      x += w + 3 + (seed / 233280) * 6;
    }

    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(880, 370, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "700 30px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.textAlign = "center";
    ctx.fillText("Li+", 880, 382);
    ctx.textAlign = "left";

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);
}

function Cell() {
  const groupRef = useRef<THREE.Group>(null);
  const labelTexture = useLabelTexture();

  return (
    <group ref={groupRef} rotation={[0, 0.4, 0]} scale={0.8}>
      {/* Main cylindrical body — brushed steel casing, sharper/cleaner reflections */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 2.1, 96]} />
        <meshStandardMaterial color="#CDD1D6" metalness={0.92} roughness={0.16} />
      </mesh>

      {/* Wrap label — printed texture instead of a flat color fill */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.552, 0.552, 0.85, 96]} />
        <meshStandardMaterial map={labelTexture} metalness={0.1} roughness={0.55} />
      </mesh>

      {/* Thin teal accent ring */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.553, 0.553, 0.045, 96]} />
        <meshStandardMaterial color="#2D96B2" metalness={0.4} roughness={0.35} emissive="#2D96B2" emissiveIntensity={0.4} />
      </mesh>

      {/* Crimped seam groove near the top — a real 18650 detail */}
      <mesh position={[0, 0.97, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.528, 0.014, 8, 64]} />
        <meshStandardMaterial color="#8B9096" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Rolled edge highlights top & bottom (reads as a real chamfer, not a flat CG cap) */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.545, 0.02, 8, 64]} />
        <meshStandardMaterial color="#E7E9EC" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.545, 0.02, 8, 64]} />
        <meshStandardMaterial color="#B8BCC2" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Positive terminal nub on top */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.12, 48]} />
        <meshStandardMaterial color="#EDEFF1" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.06, 48]} />
        <meshStandardMaterial color="#DEE1E4" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Flat negative terminal base */}
      <mesh position={[0, -1.08, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.05, 96]} />
        <meshStandardMaterial color="#BCC0C6" metalness={0.95} roughness={0.18} />
      </mesh>

      {callouts.map((c) => (
        <HudLabel key={c.label} {...c} />
      ))}
    </group>
  );
}

export function BatteryShowcase() {
  return (
    <div className="relative w-full h-[340px] lg:h-[380px] overflow-hidden" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "low-power" }}
        camera={{ position: [2.6, 0.6, 2.6], fov: 40 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 2]} intensity={1.6} />
          <directionalLight position={[-3, -1, -2]} intensity={0.35} color="#2D96B2" />
          <Environment preset="studio" />
          <Cell />
          {/* Fully free orbit — no polar-angle clamp, so it can be spun all the way around */}
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
