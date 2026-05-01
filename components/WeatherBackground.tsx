"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import {
  resolveWeatherScene,
  SCENE_PALETTES,
  sceneShowsLightning,
  sceneUsesRainCanvas,
  sceneUsesSnowCanvas,
  type WeatherScene,
} from "@/lib/weather-scenes";

export type WeatherBackgroundTheme = "light" | "dark";

export interface WeatherBackgroundProps {
  conditionId: number;
  isDay: boolean;
  theme: WeatherBackgroundTheme;
}

function subscribePrefersReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPrefersReducedMotionServer() {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotion,
    getPrefersReducedMotionServer,
  );
}

function WeatherParticles({
  scene,
  reduced,
}: {
  scene: WeatherScene;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rain = sceneUsesRainCanvas(scene);
    const snow = sceneUsesSnowCanvas(scene);
    if (!rain && !snow) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let paused = document.visibilityState === "hidden";
    const onVis = () => {
      paused = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", onVis);

    const dropCount =
      scene === "drizzle" ? 72 : scene === "rain" || scene === "thunder" ? 150 : 0;
    const flakeCount = scene === "snow" ? 80 : 0;

    type Drop = { x: number; y: number; speed: number; len: number };
    type Flake = { x: number; y: number; r: number; vy: number; vx: number; o: number };

    const drops: Drop[] = [];
    const flakes: Flake[] = [];

    const initPro = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      drops.length = 0;
      flakes.length = 0;
      if (rain) {
        for (let i = 0; i < dropCount; i++) {
          drops.push({
            x: Math.random() * w,
            y: Math.random() * h,
            speed:
              scene === "drizzle"
                ? 6 + Math.random() * 8
                : 12 + Math.random() * 12,
            len:
              scene === "drizzle"
                ? 6 + Math.random() * 8
                : 10 + Math.random() * 14,
          });
        }
      }
      if (flakeCount) {
        for (let i = 0; i < flakeCount; i++) {
          flakes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.8 + Math.random() * 2.2,
            vy: 0.4 + Math.random() * 1.2,
            vx: -0.35 + Math.random() * 0.7,
            o: 0.25 + Math.random() * 0.75,
          });
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPro();
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!paused && document.visibilityState === "visible") {
        ctx.clearRect(0, 0, w, h);
        if (rain && drops.length) {
          ctx.strokeStyle = "rgba(210, 225, 255, 0.38)";
          ctx.lineWidth = 1;
          for (const d of drops) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x - 2, d.y + d.len);
            ctx.stroke();
            d.y += d.speed;
            d.x -= 1.1;
            if (d.y > h + 20) {
              d.y = -30;
              d.x = Math.random() * w;
            }
          }
        }
        if (snow && flakes.length) {
          for (const f of flakes) {
            ctx.fillStyle = `rgba(255,255,255,${f.o * 0.75})`;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
            f.y += f.vy;
            f.x += f.vx + Math.sin(f.y * 0.015) * 0.25;
            if (f.y > h + 10) {
              f.y = -10;
              f.x = Math.random() * w;
            }
            if (f.x < -12) f.x = w + 12;
            if (f.x > w + 12) f.x = -12;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [scene, reduced]);

  if (reduced) return null;
  if (!sceneUsesRainCanvas(scene) && !sceneUsesSnowCanvas(scene)) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}

function CloudLayers({
  scene,
  reduced,
}: {
  scene: WeatherScene;
  reduced: boolean;
}) {
  const show =
    scene === "cloudsFew" ||
    scene === "cloudsHeavy" ||
    scene === "rain" ||
    scene === "drizzle" ||
    scene === "thunder" ||
    scene === "snow" ||
    scene === "default";
  if (!show || reduced) return null;

  const opBase =
    scene === "cloudsHeavy" || scene === "thunder" || scene === "rain"
      ? 0.5
      : scene === "cloudsFew"
        ? 0.32
        : 0.38;

  const clouds = [0, 1, 2, 3, 4].map((i) => ({
    key: i,
    top: `${8 + i * 11}%`,
    left: `${-15 + (i * 17) % 60}%`,
    width: `${45 + (i % 3) * 12}%`,
    height: `${8 + (i % 2) * 4}%`,
    delay: `${i * 1.2}s`,
    duration: `${18 + i * 5}s`,
    opacity: opBase + (i % 2) * 0.08,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {clouds.map((c) => (
        <div
          key={c.key}
          className="absolute rounded-full bg-white/90 blur-2xl will-change-transform dark:bg-zinc-400/30"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            height: c.height,
            opacity: c.opacity,
            animation: `weather-cloud-drift ${c.duration} ease-in-out infinite`,
            animationDelay: c.delay,
          }}
        />
      ))}
    </div>
  );
}

function FogLayers({ scene, reduced }: { scene: WeatherScene; reduced: boolean }) {
  if (scene !== "fog" || reduced) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute -left-1/4 h-[28%] w-[140%] rounded-[999px] bg-white/25 blur-3xl dark:bg-zinc-500/20"
          style={{
            top: `${20 + i * 22}%`,
            opacity: 0.35 + i * 0.1,
            animation: `weather-fog-drift ${28 + i * 6}s linear infinite alternate`,
            animationDelay: `${i * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

const STAR_POSITIONS = Array.from({ length: 42 }, (_, i) => ({
  key: i,
  left: `${(i * 37 + i * i) % 100}%`,
  top: `${(i * 53) % 55}%`,
  size: 1 + (i % 3),
  delay: `${(i % 7) * 0.4}s`,
}));

function Stars({ scene, reduced }: { scene: WeatherScene; reduced: boolean }) {
  if (scene !== "clearNight" || reduced) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
    >
      {STAR_POSITIONS.map((s) => (
        <div
          key={s.key}
          className="absolute rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `weather-twinkle ${3 + (s.key % 5)}s ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

function CelestialBody({
  scene,
  reduced,
}: {
  scene: WeatherScene;
  reduced: boolean;
}) {
  if (reduced) return null;
  if (scene === "clearDay") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[8%] top-[6%] z-[1] h-36 w-36 rounded-full sm:h-44 sm:w-44"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #fff9e6 0%, #FDB813 35%, #f59e0b 70%, transparent 72%)",
          boxShadow:
            "0 0 80px 24px rgba(253, 184, 19, 0.45), 0 0 120px rgba(135, 206, 235, 0.35)",
          animation: "weather-sun-pulse 12s ease-in-out infinite",
        }}
      />
    );
  }
  if (scene === "clearNight") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[10%] z-[1] h-24 w-24 rounded-full sm:h-28 sm:w-28"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f5f5f5 0%, #c4c9d4 45%, #8b92a8 100%)",
          boxShadow:
            "0 0 48px 12px rgba(200, 210, 230, 0.35), inset -12px -8px 24px rgba(0,0,0,0.25)",
          animation: "weather-sun-pulse 14s ease-in-out infinite",
        }}
      />
    );
  }
  return null;
}

function RainRipple({
  scene,
  reduced,
}: {
  scene: WeatherScene;
  reduced: boolean;
}) {
  if (
    reduced ||
    (scene !== "rain" && scene !== "drizzle" && scene !== "thunder")
  ) {
    return null;
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[15%] bg-gradient-to-t from-white/20 to-transparent dark:from-zinc-900/40"
      style={{
        animation: "weather-ripple 4s ease-in-out infinite",
      }}
    />
  );
}

function LightningLayer({
  scene,
  reduced,
  flash,
}: {
  scene: WeatherScene;
  reduced: boolean;
  flash: boolean;
}) {
  if (!sceneShowsLightning(scene) || reduced) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] bg-white mix-blend-overlay"
      style={{
        opacity: flash ? 0.9 : 0,
        transition: "opacity 80ms ease-out",
      }}
    />
  );
}

export function WeatherBackground({
  conditionId,
  isDay,
  theme,
}: WeatherBackgroundProps) {
  const reduced = usePrefersReducedMotion();
  const scene = useMemo(
    () => resolveWeatherScene(conditionId, isDay),
    [conditionId, isDay],
  );
  const [top, bottom] = SCENE_PALETTES[scene][theme];
  const [lightningFlash, setLightningFlash] = useState(false);

  const skyStyle = {
    "--weather-sky-top": top,
    "--weather-sky-bot": bottom,
  } as CSSProperties;

  useEffect(() => {
    if (reduced || !sceneShowsLightning(scene)) {
      const t = window.setTimeout(() => setLightningFlash(false), 0);
      return () => clearTimeout(t);
    }
    let timeoutMain: ReturnType<typeof setTimeout> | undefined;
    let timeoutOff: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const flashOnce = () => {
      if (cancelled) return;
      setLightningFlash(true);
      timeoutOff = setTimeout(() => {
        setLightningFlash(false);
      }, 90);
    };

    const schedule = () => {
      if (cancelled) return;
      const wait = 2200 + Math.random() * 4500;
      timeoutMain = setTimeout(() => {
        if (cancelled) return;
        if (Math.random() < 0.5) {
          flashOnce();
          timeoutMain = setTimeout(() => {
            if (!cancelled && Math.random() < 0.35) flashOnce();
            schedule();
          }, 120);
        } else {
          flashOnce();
          schedule();
        }
      }, wait);
    };

    schedule();
    return () => {
      cancelled = true;
      if (timeoutMain) clearTimeout(timeoutMain);
      if (timeoutOff) clearTimeout(timeoutOff);
    };
  }, [reduced, scene]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="weather-sky-gradient absolute inset-0"
        style={skyStyle}
      />

      <CelestialBody scene={scene} reduced={reduced} />
      <Stars scene={scene} reduced={reduced} />

      <CloudLayers scene={scene} reduced={reduced} />
      <FogLayers scene={scene} reduced={reduced} />

      <WeatherParticles scene={scene} reduced={reduced} />
      <RainRipple scene={scene} reduced={reduced} />

      <LightningLayer
        scene={scene}
        reduced={reduced}
        flash={lightningFlash}
      />
    </div>
  );
}
