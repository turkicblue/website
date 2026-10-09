"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { wrap } from "./ui";

export type SkyStage = { label: string; title: string; text: string };

// The opening of the home page: a night sky that the reader scrolls through. Its stars gather into
// the Old Turkic "Kök Türük", then the foundation's name, then the shangyrak, the crown of the yurt;
// one caption per shape. Points are sampled from text drawn on a canvas and moved on the GPU.
const RUNES = "𐰜𐰇𐰚:𐱅𐰇𐰼𐰜";
const NAME = "Turkic Blue";

export function Sky({ label, intro, stages }: { label: string; intro: ReactNode; stages: SkyStage[] }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const captions = useRef<(HTMLElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const THREE = await import("three");
      if (cancelled || !canvas.current || !section.current) return;
      cleanup = startSky(THREE, canvas.current, section.current, captions.current, dots.current, () => setNoWebgl(true));
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const caption = "absolute inset-x-0 bottom-[clamp(28px,8vh,80px)] will-change-[opacity,transform] motion-reduce:relative motion-reduce:bottom-auto motion-reduce:!opacity-100 motion-reduce:!transform-none";
  return (
    <section
      ref={section}
      aria-label={label}
      data-dark-hero
      className="relative h-[440vh] bg-[linear-gradient(180deg,var(--night)_0%,var(--night-2)_60%,var(--horizon)_100%)] text-star motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-svh motion-reduce:pb-14 motion-reduce:pt-[50vh]">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block size-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[radial-gradient(120%_100%_at_50%_100%,rgb(59_209_194/0.14),transparent_70%)]" />
        {noWebgl && (
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center font-rune text-[clamp(56px,14vw,220px)] text-turquoise" dir="rtl">
            {RUNES}
          </div>
        )}
        <div aria-hidden="true" className="absolute right-[clamp(16px,4vw,56px)] top-1/2 hidden -translate-y-1/2 flex-col gap-3.5 md:flex">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              ref={(el) => { dots.current[i] = el; }}
              className="size-1.5 rounded-full bg-star/25 transition-[background,transform] duration-500 data-[on=true]:scale-[1.6] data-[on=true]:bg-turquoise"
              data-on={i === 0}
            />
          ))}
        </div>
        <div className="motion-reduce:grid motion-reduce:gap-14">
          <article ref={(el) => { captions.current[0] = el; }} className={caption}>
            <div className={`${wrap} flex flex-wrap items-end justify-between gap-x-14 gap-y-5`}>{intro}</div>
          </article>
          {stages.map((stage, i) => (
            <article key={stage.title} ref={(el) => { captions.current[i + 1] = el; }} className={`${caption} opacity-0`} aria-hidden="true">
              <div className={`${wrap} flex flex-wrap items-end justify-between gap-x-14 gap-y-5`}>
                <h2 className="max-w-[18ch] font-display text-[clamp(30px,4vw,56px)] font-light leading-[1.08]">
                  <span className="mb-3 block font-sans text-sm tracking-[0.02em] text-turquoise">{stage.label}</span>
                  {stage.title}
                </h2>
                <p className="max-w-[46ch] text-[clamp(16px,1.3vw,18px)] text-mist">{stage.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type Three = typeof import("three");

function startSky(
  THREE: Three,
  canvas: HTMLCanvasElement,
  section: HTMLElement,
  captions: (HTMLElement | null)[],
  dots: (HTMLSpanElement | null)[],
  onNoWebgl: () => void,
) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer: InstanceType<Three["WebGLRenderer"]>;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch {
    onNoWebgl();
    return undefined;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 10;
  const N = innerWidth < 700 ? 4200 : 9000;

  // next/font gives the faces generated names; the CSS variables hold them.
  const css = getComputedStyle(document.documentElement);
  const runeFont = css.getPropertyValue("--font-old-turkic").trim() || "sans-serif";
  const nameFont = css.getPropertyValue("--font-jost").trim() || "sans-serif";

  const view = () => {
    const h = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return { w: h * camera.aspect, h };
  };

  // Points on the pixels of a line of text, scaled to fit a box in the scene.
  function sampleText(text: string, font: string, maxW: number, maxH: number, offsetY: number) {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + 40;
    const h = 320;
    c.width = w;
    c.height = h;
    ctx.font = font;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts: number[] = [];
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 140) pts.push(x, y);
    const scale = Math.min(maxW / w, maxH / h);
    const out = new Float32Array(N * 3);
    const count = Math.max(pts.length / 2, 1);
    for (let i = 0; i < N; i++) {
      const k = (Math.random() * count) | 0;
      out[i * 3] = ((pts[k * 2] ?? w / 2) - w / 2) * scale + (Math.random() - 0.5) * scale * 2;
      out[i * 3 + 1] = -((pts[k * 2 + 1] ?? h / 2) - h / 2) * scale + offsetY + (Math.random() - 0.5) * scale * 2;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    return out;
  }

  // The shangyrak: an outer ring, an inner ring and two sets of three crossing arches.
  function shangyrak(R: number, offsetY: number) {
    const out = new Float32Array(N * 3);
    const r = R * 0.62;
    for (let i = 0; i < N; i++) {
      const pick = Math.random();
      let x: number, y: number;
      if (pick < 0.42) {
        const a = Math.random() * Math.PI * 2, rr = R + (Math.random() - 0.5) * R * 0.09;
        x = Math.cos(a) * rr; y = Math.sin(a) * rr;
      } else if (pick < 0.56) {
        const a = Math.random() * Math.PI * 2, rr = r + (Math.random() - 0.5) * R * 0.04;
        x = Math.cos(a) * rr; y = Math.sin(a) * rr;
      } else {
        const lane = [-0.5, 0, 0.5][(Math.random() * 3) | 0] * r;
        const t = (Math.random() * 2 - 1) * Math.sqrt(Math.max(r * r - lane * lane, 0));
        const bow = R * 0.07 * (1 - (t / r) ** 2);
        if (Math.random() < 0.5) { x = t; y = lane + bow; } else { x = lane + bow; y = t; }
        x += (Math.random() - 0.5) * R * 0.035;
        y += (Math.random() - 0.5) * R * 0.035;
      }
      out[i * 3] = x; out[i * 3 + 1] = y + offsetY; out[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return out;
  }

  const geometry = new THREE.BufferGeometry();
  const stars = new Float32Array(N * 3);
  const rand = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    stars[i * 3] = (Math.random() - 0.5) * 34;
    stars[i * 3 + 1] = (Math.random() - 0.5) * 20;
    stars[i * 3 + 2] = -14 + Math.random() * 18;
    rand[i] = Math.random();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

  function buildTargets() {
    const { w, h } = view();
    const narrow = innerWidth < 700;
    const lift = h * (narrow ? 0.2 : 0.14);
    geometry.setAttribute("aT1", new THREE.BufferAttribute(sampleText(RUNES, `200px ${runeFont}`, w * 0.86, h * 0.42, lift), 3));
    geometry.setAttribute("aT2", new THREE.BufferAttribute(sampleText(NAME, `500 200px ${nameFont}`, w * 0.84, h * 0.4, lift), 3));
    geometry.setAttribute("aT3", new THREE.BufferAttribute(shangyrak(Math.min(w, h) * (narrow ? 0.3 : 0.24), lift), 3));
  }

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uC0: { value: new THREE.Color("#E6F0F2") },
    uC1: { value: new THREE.Color("#3BD1C2") },
    uC2: { value: new THREE.Color("#FFFFFF") },
    uC3: { value: new THREE.Color("#7FE3D8") },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime, uProgress, uPixelRatio;
      uniform vec2 uMouse;
      attribute vec3 aT1, aT2, aT3;
      attribute float aRand;
      varying float vRand;
      varying float vTwinkle;
      varying float vFormed;
      float stage(float s) {
        float t = clamp((uProgress - s - aRand * 0.35) / 0.65, 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
      }
      void main() {
        float s1 = stage(0.0), s2 = stage(1.0), s3 = stage(2.0);
        vec3 p = mix(position, aT1, s1);
        p = mix(p, aT2, s2);
        p = mix(p, aT3, s3);
        float formed = max(s1, max(s2, s3));
        p.x += sin(uTime * 0.35 + aRand * 40.0) * mix(0.05, 0.008, formed);
        p.y += cos(uTime * 0.3 + aRand * 31.0) * mix(0.05, 0.008, formed);
        vec2 d = p.xy - uMouse;
        p.xy += normalize(d + 1e-4) * smoothstep(1.3, 0.0, length(d)) * 0.55;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vTwinkle = 0.55 + 0.45 * sin(uTime * (1.2 + aRand * 2.0) + aRand * 60.0);
        vRand = aRand;
        vFormed = formed;
        gl_PointSize = (28.0 + aRand * 30.0) * uPixelRatio / -mv.z * mix(1.0, 0.9, formed);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uProgress;
      uniform vec3 uC0, uC1, uC2, uC3;
      varying float vRand;
      varying float vTwinkle;
      varying float vFormed;
      void main() {
        float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
        a *= a;
        vec3 c = mix(uC0, uC1, clamp(uProgress, 0.0, 1.0));
        c = mix(c, uC2, clamp(uProgress - 1.0, 0.0, 1.0));
        c = mix(c, uC3, clamp(uProgress - 2.0, 0.0, 1.0));
        c = mix(uC0, c, vFormed);
        gl_FragColor = vec4(c, a * mix(vTwinkle, 1.0, vFormed * 0.7) * (0.65 + vRand * 0.45));
      }`,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    buildTargets();
  };

  let target = reduced ? 1 : 0;
  const readScroll = () => {
    const rect = section.getBoundingClientRect();
    const span = rect.height - innerHeight;
    target = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) * 3.15 : 1;
  };
  const mouse = new THREE.Vector2(99, 99), mouseTarget = new THREE.Vector2(99, 99);
  const onPointer = (e: PointerEvent) => {
    const { w, h } = view();
    mouseTarget.set((e.clientX / innerWidth - 0.5) * w, -(e.clientY / innerHeight - 0.5) * h);
  };
  const onLeave = () => mouseTarget.set(99, 99);
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };

  let visible = true;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(section);

  let raf = 0;
  let last = performance.now();
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced) uniforms.uTime.value += dt;
    const u = (uniforms.uProgress.value += (Math.min(target, 3) - uniforms.uProgress.value) * Math.min(dt * 3.2, 1));
    mouse.lerp(mouseTarget, Math.min(dt * 6, 1));
    uniforms.uMouse.value.copy(mouse);
    points.rotation.y = Math.sin(uniforms.uTime.value * 0.05) * 0.04;
    if (!reduced) {
      captions.forEach((cap, i) => {
        if (!cap) return;
        const o = Math.max(0, 1 - Math.abs(u - i) * 2.4);
        cap.style.opacity = o.toFixed(3);
        cap.style.transform = `translateY(${((u - i) * -28).toFixed(1)}px)`;
        cap.style.pointerEvents = o > 0.5 ? "auto" : "none";
        cap.setAttribute("aria-hidden", o > 0.5 ? "false" : "true");
      });
      const active = Math.min(3, Math.round(u));
      dots.forEach((d, i) => d?.setAttribute("data-on", String(i === active)));
    }
    renderer.render(scene, camera);
  };

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    resize();
    readScroll();
    uniforms.uProgress.value = target;
    frame();
  };
  // Sample the text only once its faces have loaded, or it would be drawn in a fallback font.
  Promise.race([
    Promise.all([document.fonts.load(`200px ${runeFont}`, RUNES), document.fonts.load(`500 200px ${nameFont}`, NAME)]),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]).then(start, start);

  if (!reduced) addEventListener("scroll", readScroll, { passive: true });
  addEventListener("pointermove", onPointer);
  document.addEventListener("pointerleave", onLeave);
  addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    io.disconnect();
    removeEventListener("scroll", readScroll);
    removeEventListener("pointermove", onPointer);
    document.removeEventListener("pointerleave", onLeave);
    removeEventListener("resize", onResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
