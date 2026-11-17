import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FRAMES } from "@/lib/frames";

type Props = {
  onReady?: () => void;
  onFail?: () => void;
  onHover?: (label: string | null) => void;
};

const DEG = Math.PI / 180;

/**
 * Parede curva de telas reais rodando atrás da manchete.
 * As telas deslizam no cilindro, viram de face e somem nas bordas.
 * Centro fica escuro por causa do scrim do CSS — texto sempre legivel.
 */
const Hero3D = ({ onReady, onFail, onHover }: Props) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cb = useRef({ onReady, onFail, onHover });
  cb.current = { onReady, onFail, onHover };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      cb.current.onFail?.();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 860;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const radius = mobile ? 6.6 : 8.2;
    const spread = (mobile ? 150 : 160) * DEG;
    const half = spread / 2;
    const count = mobile ? 8 : 14;
    const picks = FRAMES.slice(0, count);
    const lane = mobile ? 1.1 : 1.5;

    const loader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const textures: THREE.Texture[] = [];
    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.MeshBasicMaterial[] = [];
    const base: number[] = [];
    const laneY: number[] = [];

    picks.forEach((frame, i) => {
      const geo = new THREE.PlaneGeometry(
        (mobile ? 1.7 : 2.05) * (frame.w / frame.h),
        mobile ? 1.7 : 2.05
      );
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const tex = loader.load(frame.src);
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { label: `${frame.project} · ${frame.year}` };

      base.push((i / picks.length) * spread - half);
      laneY.push(Math.sin(i * 2.4 + 1.1) * lane);
      group.add(mesh);
      meshes.push(mesh);
      textures.push(tex);
      geos.push(geo);
      mats.push(mat);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(9, 9);
    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let lastLabel: string | null = null;
    let hovered: THREE.Mesh | null = null;
    let offset = 0;

    const setLabel = (label: string | null) => {
      if (label === lastLabel) return;
      lastLabel = label;
      cb.current.onHover?.(label);
    };

    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.x = target.x;
      pointer.y = -target.y;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onClick = (e: MouseEvent) => {
      if (e.target === renderer.domElement && hovered) {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("click", onClick);

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const onLost = (e: Event) => {
      e.preventDefault();
      cb.current.onFail?.();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    /** angulo atual de uma tela, preso na faixa visivel */
    const wrap = (a: number) => {
      const span = spread;
      let v = (a + half) % span;
      if (v < 0) v += span;
      return v - half;
    };

    const place = (dt: number) => {
      if (!reduced) offset += dt * 0.11;

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      hovered = (hit?.object as THREE.Mesh) ?? null;
      setLabel(hovered ? (hovered.userData.label as string) : null);

      for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        const a = wrap(base[i] + offset);
        const edge = Math.min(1, Math.max(0, 1 - (Math.abs(a) - 38 * DEG) / (30 * DEG)));

        mesh.position.set(Math.sin(a) * radius, laneY[i], -Math.cos(a) * radius);
        mesh.rotation.y = -a * 0.55;
        mesh.rotation.z = Math.sin(i * 2.3 + offset * 0.6) * 4 * DEG;

        const mat = mesh.material as THREE.MeshBasicMaterial;
        const loaded = mat.map && mat.map.image ? 1 : 0;
        const center = 0.42 + 0.58 * Math.cos(a);
        const boost = mesh === hovered ? 1 : 0;
        mat.opacity = loaded * edge * Math.min(1, center + boost * 0.3);

        const s = mesh === hovered ? 1.1 : 1;
        mesh.scale.setScalar(mesh.scale.x + (s - mesh.scale.x) * 0.12);
      }
    };

    const parallax = () => {
      smooth.x += (target.x - smooth.x) * 0.05;
      smooth.y += (target.y - smooth.y) * 0.05;
      camera.position.x = smooth.x * 1.15;
      camera.position.y = -smooth.y * 0.65;
      camera.lookAt(0, 0, -radius);
    };

    let raf = 0;
    let last = performance.now();
    let announced = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      place(dt);
      parallax();
      renderer.render(scene, camera);

      if (!announced) {
        announced = true;
        cb.current.onReady?.();
      }
    };

    if (reduced) {
      place(0);
      parallax();
      renderer.render(scene, camera);
      cb.current.onReady?.();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      textures.forEach((t) => t.dispose());
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero-3d" ref={mountRef} aria-hidden="true" />;
};

export default Hero3D;
