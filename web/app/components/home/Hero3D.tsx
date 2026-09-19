import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect, useRef, useState } from "react";
import { type Group, type Mesh, MeshStandardMaterial, type Object3D, type Texture } from "three";
import { byTier } from "~/content/projects";
import type { Lang } from "~/content/types";
import { projectScreen } from "./screenTexture";

const MODEL = "/models/laptop.glb";
const OPEN_ANGLE = -108 * (Math.PI / 180);

interface Props {
  /** Scroll progress of the stage, 0 → 1, written by the parent without re-rendering. */
  progress: RefObject<number>;
  active: number;
  lang: Lang;
  onReady: () => void;
}

function Laptop({ progress, active, lang, onReady }: Props) {
  // Draco off (would fetch a decoder from a CDN); meshopt decoder is bundled.
  const { scene } = useGLTF(MODEL, false, true);
  const root = useRef<Group>(null);
  // Three.js objects are mutated every frame, so they live in refs, not in React state/memo.
  const lid = useRef<Object3D | null>(null);
  const screenMaterial = useRef<MeshStandardMaterial | null>(null);
  const [screens, setScreens] = useState<Texture[]>([]);

  useEffect(() => {
    lid.current = scene.getObjectByName("LidPivot") ?? null;
    const mat = new MeshStandardMaterial({ color: "#000", roughness: 0.2, metalness: 0 });
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.isMesh && (mesh.material as MeshStandardMaterial).name === "Screen")
        mesh.material = mat;
    });
    screenMaterial.current = mat;
    return () => mat.dispose();
  }, [scene]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(byTier("flagship").map((p) => projectScreen(p, lang))).then((t) => {
      if (!cancelled) setScreens(t);
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => () => screens.forEach((t) => t.dispose()), [screens]);

  useEffect(() => {
    const tex = screens[active];
    const mat = screenMaterial.current;
    if (!tex || !mat) return;
    mat.map = tex;
    mat.emissiveMap = tex;
    mat.emissive.set("#ffffff");
    mat.emissiveIntensity = 1.05;
    mat.needsUpdate = true;
    onReady();
  }, [screens, active, onReady]);

  useFrame((state, delta) => {
    const p = progress.current ?? 1;
    // Lid opens over the first 70% of the reveal, then the machine settles.
    const open = Math.min(1, p / 0.7);
    const eased = 1 - Math.pow(1 - open, 3);
    const l = lid.current;
    if (l) l.rotation.x += (OPEN_ANGLE * eased - l.rotation.x) * Math.min(1, delta * 10);
    if (root.current) {
      const t = state.clock.elapsedTime;
      const targetY = (1 - p) * -0.55 + Math.sin(t * 0.35) * 0.04;
      root.current.rotation.y += (targetY - root.current.rotation.y) * Math.min(1, delta * 4);
      root.current.position.y = Math.sin(t * 0.8) * 0.002;
    }
  });

  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  );
}

/** Studio lighting built from light formers — no HDR download, CSP-friendly. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#0a0a0a"]} />
      <Lightformer
        form="rect"
        intensity={3}
        position={[-2, 2.5, 2]}
        scale={[3, 3, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.2}
        position={[2.5, 1, 1.5]}
        scale={[4, 2, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2}
        position={[0, 1.5, -2.5]}
        scale={[5, 1, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer form="ring" intensity={0.8} position={[0, 4, 0]} scale={2} target={[0, 0, 0]} />
    </Environment>
  );
}

export default function Hero3D(props: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 0.6], fov: 34, near: 0.01, far: 10 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0.088, -0.02)}
        aria-hidden="true"
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[-1, 2, 1.5]} intensity={1.2} />
        <directionalLight position={[0, 0.4, 2]} intensity={0.5} />
        <Suspense fallback={null}>
          <Studio />
          <Laptop {...props} />
          <ContactShadows
            position={[0, -0.001, 0]}
            opacity={0.45}
            scale={0.9}
            blur={2.6}
            far={0.3}
            resolution={512}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
