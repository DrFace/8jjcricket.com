/// <reference types="@react-three/fiber" />
"use client";

import { useEffect, useRef, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import * as THREE from "three";

const STYLE_ID = "trophy-decor-style";

// Singleton gold material — shared across both canvases
let cachedMaterial: THREE.MeshStandardMaterial | null = null;

function getGoldMaterial() {
  if (!cachedMaterial) {
    cachedMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffd060),   // warm gold
      metalness: 0.92,
      roughness: 0.12,
      emissive: new THREE.Color(0xb06a00),
      emissiveIntensity: 0.55,
    });
  }
  return cachedMaterial;
}

/* ------------------------------------------------------------------ */
/* Trophy mesh — OBJ + diffuse texture only (4 textures → 1)           */
/* ------------------------------------------------------------------ */
function TrophyModel({ offset }: { offset: number }) {
  const obj = useLoader(OBJLoader, "/3d/base.obj");
  const group = useRef<THREE.Group>(null);

  const cloned = useMemo(() => {
    const mat = getGoldMaterial();
    const c = obj.clone();

    // Auto-center the geometry so the trophy sits at origin
    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center); // shift mesh so its bounding-box center = (0,0,0)

    c.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
    return c;
  }, [obj]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.5 + offset;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={cloned} scale={1.2} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Single optimised canvas per side                                     */
/* ------------------------------------------------------------------ */
function TrophyCanvas({ offset }: { offset: number }) {
  return (
    <Canvas
      dpr={1}                          /* No retina — biggest GPU saving  */
      gl={{
        antialias: false,              /* No MSAA — significant GPU saving */
        powerPreference: "low-power",  /* Prefer integrated GPU            */
        alpha: true,
      }}
      camera={{ position: [0, 0, 4], fov: 45, up: [0, 1, 0] }}
      onCreated={({ camera }) => {
        // Ensure camera looks at the true origin
        camera.lookAt(0, 0, 0);
      }}
      performance={{ min: 0.5 }}       /* Auto-downscale when FPS drops    */
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 5, 5]} intensity={4.0} />
      <directionalLight position={[-5, 3, -5]} intensity={2.0} color="#ffe0a0" />
      <directionalLight position={[0, -5, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, 0, -5]} intensity={1.2} color="#00aaff" />
      <pointLight position={[5, 2, 3]} intensity={1.5} color="#ffd060" />
      {/* No <Environment> — skips expensive HDR environment map load */}
      <Suspense fallback={null}>
        <TrophyModel offset={offset} />
      </Suspense>
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/* Main export — skips WebGL entirely on non-desktop screens            */
/* ------------------------------------------------------------------ */
export default function Rotating3DTrophySides() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes auraPulse {
        0%   { opacity: .55; filter: blur(14px); }
        50%  { opacity: .9;  filter: blur(18px); }
        100% { opacity: .55; filter: blur(14px); }
      }

      .sideDecor {
        pointer-events: none;
        position: absolute;
        top: 0;
        height: 100%;
        width: 22vw;
        max-width: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        opacity: .95;
      }

      .fadeLeft {
        -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%);
        mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%);
      }
      .fadeRight {
        -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%);
        mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%);
      }

      .decorWrap {
        position: relative;
        width: min(250px, 18.5vw);
        height: 82vh;
        max-height: 740px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .aura {
        position: absolute;
        width: 74%;
        height: 44%;
        border-radius: 999px;
        background:
          radial-gradient(circle at 35% 35%, rgba(0,170,255,0.22) 0%, rgba(0,170,255,0.0) 58%),
          radial-gradient(circle at 65% 60%, rgba(255,184,0,0.22) 0%, rgba(255,184,0,0.0) 60%);
        animation: auraPulse 3.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Don't even mount WebGL on mobile / tablet
  if (!isDesktop) return null;

  return (
    <>
      {/* LEFT */}
      <div className="sideDecor left-0 fadeLeft">
        <div className="decorWrap">
          <div className="aura" />
          <div style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }}>
            <TrophyCanvas offset={0} />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="sideDecor right-0 fadeRight">
        <div className="decorWrap">
          <div className="aura" />
          <div style={{ width: "100%", height: "100%", position: "absolute", zIndex: 10 }}>
            <TrophyCanvas offset={Math.PI} />
          </div>
        </div>
      </div>
    </>
  );
}