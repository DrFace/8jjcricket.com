"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GameArena from "./game-arena";

// Stickman Quest — TypeScript React (Next.js client) version
// Mobile friendly, polished UI, stick-figure characters (faces & bodies)
// Level-up system, health, XP, dash, attack combos, particles, pause/help overlays

// ===== Types =====
interface Player {
  x: number;
  y: number;
  r: number;
  dir: 1 | -1;
  speed: number;
  vx: number;
  vy: number;
  dashCd: number;
  dashTime: number;
  invulnTime: number;
  attackCd: number;
  combo: number;
  dmg: number;
}

interface Enemy {
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  speed: number;
  t: number;
  dead: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  attack: boolean;
  dash: boolean;
  touch: boolean;
  joyBase: { x: number; y: number };
  joyPoint: { x: number; y: number };
}

interface GameState {
  t0: number;
  last: number;
  width: number;
  height: number;
  player: Player;
  enemies: Enemy[];
  particles: Particle[];
  texts: FloatingText[];
  input: InputState;
  spawnTimer: number;
  gameOver: boolean;
}

interface Stats {
  level: number;
  xp: number;
  xpToNext: number;
  health: number;
  maxHealth: number;
  gold: number;
  time: number;
  kills: number;
}

// ===== Component =====
export default function StickmanQuest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const [running, setRunning] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mute, setMute] = useState(false);
  const [renderScale, setRenderScale] = useState(1);

  const centeredRef = useRef(false);

  const [stats, setStats] = useState<Stats>({
    level: 1,
    xp: 0,
    xpToNext: 20,
    health: 100,
    maxHealth: 100,
    gold: 0,
    time: 0,
    kills: 0,
  });

  const stateRef = useRef<GameState>({
    t0: performance.now(),
    last: performance.now(),
    width: 800,
    height: 450,
    player: {
      x: 400,
      y: 225,
      r: 14,
      dir: 1,
      speed: 140,
      vx: 0,
      vy: 0,
      dashCd: 0,
      dashTime: 0,
      invulnTime: 0,
      attackCd: 0,
      combo: 0,
      dmg: 12,
    },
    enemies: [],
    particles: [],
    texts: [],
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      attack: false,
      dash: false,
      touch: false,
      joyBase: { x: 0, y: 0 },
      joyPoint: { x: 0, y: 0 },
    },
    spawnTimer: 0,
    gameOver: false,
  });

  // ===== Utils =====
  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const len2 = (dx: number, dy: number) => Math.hypot(dx, dy);
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // ===== Drawing =====
  function drawStickman(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dir: 1 | -1,
    r: number,
    color: string = "#111",
    face = true
  ) {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y - r - 10, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (face) {
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(x - r * 0.35, y - r - 12, 2, 0, Math.PI * 2);
      ctx.arc(x + r * 0.35, y - r - 12, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y - r - 6, 5, 0, Math.PI);
      ctx.stroke();
    }

    const chestY = y - 10;
    const hipY = y + 12;
    ctx.beginPath();
    ctx.moveTo(x, chestY);
    ctx.lineTo(x, hipY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, chestY + 2);
    ctx.lineTo(x + dir * 16, chestY + 8);
    ctx.moveTo(x, chestY + 2);
    ctx.lineTo(x - dir * 16, chestY + 12);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, hipY);
    ctx.lineTo(x - 10, y + 28);
    ctx.moveTo(x, hipY);
    ctx.lineTo(x + 12, y + 28);
    ctx.stroke();
  }

  function drawSwordArc(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dir: 1 | -1,
    t: number
  ) {
    const alpha = 1 - t;
    ctx.save();
    ctx.globalAlpha = alpha * 0.8;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    const r = 26;
    const a0 = (-0.6 + t * 1.1) * dir;
    const a1 = (0.4 + t * 1.1) * dir;
    ctx.beginPath();
    ctx.arc(x + dir * 10, y + 4, r, a0, a1);
    ctx.stroke();
    ctx.restore();
  }

  function addText(
    x: number,
    y: number,
    text: string,
    color: string = "#111",
    life: number = 0.8
  ) {
    stateRef.current.texts.push({ x, y, text, color, life });
  }

  function addHitParticles(x: number, y: number, color: string = "#ef4444") {
    for (let i = 0; i < 8; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: rand(-60, 60),
        vy: rand(-120, -40),
        life: rand(0.3, 0.7),
        color,
      });
    }
  }

  // ===== Audio (no external assets) =====
  const audio = useMemo(() => {
    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    function beep(
      freq: number = 440,
      dur: number = 0.07,
      type: OscillatorType = "square",
      vol: number = 0.06
    ) {
      if (mute) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = vol;
      o.start();
      o.stop(ctx.currentTime + dur);
    }
    return { beep };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mute]);

  // ===== Input (keyboard) =====
  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const inp = stateRef.current.input;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          inp.up = down;
          break;
        case "KeyS":
        case "ArrowDown":
          inp.down = down;
          break;
        case "KeyA":
        case "ArrowLeft":
          inp.left = down;
          break;
        case "KeyD":
        case "ArrowRight":
          inp.right = down;
          break;
        case "Space":
        case "KeyJ":
          inp.attack = down;
          break;
        case "ShiftLeft":
        case "KeyK":
          inp.dash = down;
          break;
        default:
          break;
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd as any);
    window.addEventListener("keyup", ku as any);
    return () => {
      window.removeEventListener("keydown", kd as any);
      window.removeEventListener("keyup", ku as any);
    };
  }, []);

  // ===== Resize & DPR =====
  useEffect(() => {
    function handleResize() {
      const c = canvasRef.current;
      if (!c) return;

      const parent = c.parentElement!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const w = parent.clientWidth;
      const h = parent.clientHeight;

      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;

      const s = stateRef.current;
      s.width = w;
      s.height = h;

      // ✅ CENTER PLAYER ONLY ON GAME START
      if (running && !centeredRef.current) {
        s.player.x = w / 2;
        s.player.y = h / 2;
        centeredRef.current = true;
      }

      setRenderScale(dpr);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [running]);

  // ===== Game Loop =====
  useEffect(() => {
    if (!running) return;
    const c = canvasRef.current;
    if (!c) return;
    const canvas = c as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const s = stateRef.current;

    function spawnEnemy() {
      const margin = 24;
      const side = Math.floor(rand(0, 4));
      let x = 0,
        y = 0;
      if (side === 0) {
        x = -margin;
        y = rand(0, s.height);
      }
      if (side === 1) {
        x = s.width + margin;
        y = rand(0, s.height);
      }
      if (side === 2) {
        x = rand(0, s.width);
        y = -margin;
      }
      if (side === 3) {
        x = rand(0, s.width);
        y = s.height + margin;
      }
      const hpBase = 20 + stats.level * 6 + s.spawnTimer * 0.02;
      s.enemies.push({
        x,
        y,
        r: 13,
        hp: hpBase,
        maxHp: hpBase,
        speed: 60 + stats.level * 4,
        t: 0,
        dead: false,
      });
    }

    const attackHitbox = (p: Player) => ({
      x: p.x + p.dir * (10 + 28 * 0.6),
      y: p.y + 6,
      r: 28,
    });

    function loop(now: number) {
      const dt = Math.min(0.033, (now - s.last) / 1000);
      s.last = now;
      s.spawnTimer += dt;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.scale(renderScale, renderScale);

      const grd = ctx.createLinearGradient(0, 0, 0, s.height);
      grd.addColorStop(0, "#f8fafc");
      grd.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, s.width, s.height);
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, s.width, 8);
      ctx.fillRect(0, s.height - 8, s.width, 8);

      const inp = s.input;
      let ix = 0,
        iy = 0;
      if (inp.touch) {
        ix = clamp((inp.joyPoint.x - inp.joyBase.x) / 40, -1, 1);
        iy = clamp((inp.joyPoint.y - inp.joyBase.y) / 40, -1, 1);
      } else {
        ix = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
        iy = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
      }
      const mag = Math.hypot(ix, iy) || 1;
      ix /= mag;
      iy /= mag;

      const p = s.player;
      const spd = p.speed * (p.dashTime > 0 ? 2.6 : 1);
      p.vx = lerp(p.vx, ix * spd, 0.25);
      p.vy = lerp(p.vy, iy * spd, 0.25);
      p.x = clamp(p.x + p.vx * dt, 18, s.width - 18);
      p.y = clamp(p.y + p.vy * dt, 34, s.height - 20);
      if (Math.abs(ix) > 0.2) p.dir = ix > 0 ? 1 : -1;

      p.attackCd = Math.max(0, p.attackCd - dt);
      p.dashCd = Math.max(0, p.dashCd - dt);
      p.dashTime = Math.max(0, p.dashTime - dt);
      p.invulnTime = Math.max(0, p.invulnTime - dt);

      if (inp.attack && p.attackCd === 0) {
        p.attackCd = 0.22;
        p.combo = (p.combo + 1) % 3;
        audio.beep(660 + p.combo * 60, 0.06, "sawtooth", 0.04);
        const hb = attackHitbox(p);
        s.enemies.forEach((e) => {
          const d = len2(hb.x - e.x, hb.y - e.y);
          if (d < hb.r + e.r) {
            const dmg = stats.level * 3 + p.dmg + rand(-2, 2);
            e.hp -= dmg;
            addHitParticles(e.x, e.y);
            addText(
              e.x,
              e.y - 24,
              Math.max(1, Math.round(dmg)).toString(),
              "#ef4444",
              0.9
            );
            if (e.hp <= 0 && !e.dead) {
              e.dead = true;
              s.texts.push({
                x: e.x,
                y: e.y - 34,
                text: "+XP",
                color: "#16a34a",
                life: 0.8,
              });
              setStats((st) => {
                let xp = st.xp + 8 + Math.floor(rand(0, 6));
                let level = st.level;
                let xpToNext = st.xpToNext;
                let maxHealth = st.maxHealth;
                let health = st.health;
                while (xp >= xpToNext) {
                  xp -= xpToNext;
                  level += 1;
                  xpToNext = Math.floor(xpToNext * 1.25 + 10);
                  maxHealth = Math.floor(maxHealth * 1.08 + 6);
                  health = Math.min(
                    maxHealth,
                    Math.floor(health + maxHealth * 0.4)
                  );
                  p.speed += 6;
                  p.dmg += 3;
                  addText(p.x, p.y - 40, `LEVEL ${level}!`, "#0ea5e9", 1.2);
                  audio.beep(880, 0.12, "triangle", 0.06);
                  audio.beep(1175, 0.12, "triangle", 0.06);
                }
                return {
                  ...st,
                  xp,
                  level,
                  xpToNext,
                  maxHealth,
                  health,
                  kills: st.kills + 1,
                };
              });
            }
          }
        });
      }

      if (inp.dash && p.dashCd === 0) {
        p.dashCd = 1.0;
        p.dashTime = 0.18;
        p.invulnTime = 0.25;
        audio.beep(220, 0.05, "sine", 0.06);
      }

      const spawnRate = Math.max(
        0.5,
        1.4 - stats.level * 0.03 - s.spawnTimer * 0.002
      );
      if (s.spawnTimer > spawnRate) {
        s.spawnTimer = 0;
        spawnEnemy();
      }

      s.enemies.forEach((e) => {
        e.t += dt;
        if (e.dead) return;
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const d = Math.hypot(dx, dy) || 1;
        e.x += (dx / d) * e.speed * dt;
        e.y += (dy / d) * e.speed * dt;
        const pd = Math.hypot(e.x - p.x, e.y - p.y);
        if (pd < e.r + p.r) {
          if (p.invulnTime <= 0) {
            const hit = Math.floor(rand(6, 12) + stats.level * 0.7);
            addHitParticles(p.x, p.y, "#3b82f6");
            setStats((st) => ({
              ...st,
              health: clamp(st.health - hit, 0, st.maxHealth),
            }));
            addText(p.x, p.y - 30, `-${hit}`, "#1d4ed8", 0.8);
            p.invulnTime = 0.6;
            audio.beep(180, 0.08, "square", 0.05);
          }
        }
      });

      s.enemies = s.enemies.filter((e) => !e.dead);

      s.particles = s.particles.filter((pt) => {
        pt.life -= dt;
        pt.vx *= 0.98;
        pt.vy += 320 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        return pt.life > 0;
      });

      s.texts = s.texts.filter((t) => {
        t.life -= dt;
        t.y -= 20 * dt;
        return t.life > 0;
      });

      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < s.width; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, s.height);
        ctx.stroke();
      }
      for (let gy = 0; gy < s.height; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(s.width, gy);
        ctx.stroke();
      }

      s.enemies.forEach((e) => {
        drawStickman(
          ctx,
          e.x,
          e.y,
          (Math.sign(p.x - e.x) || 1) as 1 | -1,
          10,
          "#7f1d1d",
          true
        );
        const w = 24;
        ctx.fillStyle = "#fecaca";
        ctx.fillRect(e.x - w / 2, e.y - 36, w, 4);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(e.x - w / 2, e.y - 36, w * (e.hp / e.maxHp), 4);
      });

      drawStickman(ctx, p.x, p.y, p.dir, p.r, "#111", true);
      if (p.attackCd > 0.02) {
        const tNorm = 1 - p.attackCd / 0.22;
        drawSwordArc(ctx, p.x, p.y, p.dir, tNorm);
      }

      s.particles.forEach((pt) => {
        ctx.globalAlpha = clamp(pt.life, 0, 1);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.font =
        "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
      ctx.textAlign = "center";
      s.texts.forEach((t) => {
        ctx.globalAlpha = clamp(t.life, 0, 1);
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
        ctx.globalAlpha = 1;
      });

      const pad = 12;
      const hpPct = stats.health / stats.maxHealth;
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(pad - 2, pad - 2, 202, 16);
      ctx.fillStyle = "#fecaca";
      ctx.fillRect(pad, pad, 200, 12);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(pad, pad, 200 * hpPct, 12);
      ctx.fillStyle = "#111";
      ctx.font = "10px ui-sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        `HP ${Math.max(0, Math.floor(stats.health))}/${stats.maxHealth}`,
        pad + 4,
        pad + 10
      );

      const xpPct = stats.xp / stats.xpToNext;
      const barW = s.width - pad * 2;
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(pad - 2, s.height - pad - 12, barW + 4, 16);
      ctx.fillStyle = "#bae6fd";
      ctx.fillRect(pad, s.height - pad - 10, barW, 12);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(pad, s.height - pad - 10, barW * xpPct, 12);
      ctx.fillStyle = "#0c4a6e";
      ctx.textAlign = "center";
      ctx.fillText(
        `Lv ${stats.level}  •  ${Math.floor(stats.xp)}/${stats.xpToNext} XP`,
        s.width / 2,
        s.height - pad - 1
      );

      setStats((st) => ({ ...st, time: st.time + dt }));

      if (stats.health <= 0 && !s.gameOver) {
        s.gameOver = true;
        audio.beep(110, 0.2, "sawtooth", 0.08);
      }

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, 0, s.width, s.height);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 22px ui-sans-serif";
        ctx.fillText("Game Over", s.width / 2, s.height / 2 - 8);
        ctx.font = "12px ui-sans-serif";
        ctx.fillText("Tap Restart", s.width / 2, s.height / 2 + 16);
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    }

    stateRef.current.last = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    running,
    renderScale,
    stats.level,
    stats.maxHealth,
    stats.health,
    stats.xp,
    stats.xpToNext,
    mute,
  ]);

  useEffect(() => {
    if (!running) return;
    const s = stateRef.current;
    s.player.x = s.width / 2;
    s.player.y = s.height / 2;
  }, [running]);

  useEffect(() => {
    if (!running) {
      centeredRef.current = false;
    }
  }, [running]);

  // ===== Touch Joystick =====
  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const s = stateRef.current;
    s.input.touch = true;
    s.input.joyBase = { x, y };
    s.input.joyPoint = { x, y };
  }
  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    stateRef.current.input.joyPoint = { x, y };
  }
  function onTouchEnd() {
    const inp = stateRef.current.input;
    inp.touch = false;
    inp.joyPoint = inp.joyBase;
  }

  function pressAttack() {
    stateRef.current.input.attack = true;
    setTimeout(() => (stateRef.current.input.attack = false), 60);
  }
  function pressDash() {
    stateRef.current.input.dash = true;
    setTimeout(() => (stateRef.current.input.dash = false), 60);
  }

  function resetGame() {
    const s = stateRef.current;
    s.player = {
      ...s.player,
      x: s.width / 2,
      y: s.height / 2,
      vx: 0,
      vy: 0,
      dashCd: 0,
      dashTime: 0,
      invulnTime: 0,
      attackCd: 0,
    };
    s.enemies = [];
    s.particles = [];
    s.texts = [];
    s.spawnTimer = 0;
    s.gameOver = false;
    setStats({
      level: 1,
      xp: 0,
      xpToNext: 20,
      health: 100,
      maxHealth: 100,
      gold: 0,
      time: 0,
      kills: 0,
    });
    setRunning(true);
  }

  const handleCanvasClick = () => {
    if (!running) setRunning(true);
    if (stateRef.current.gameOver) resetGame();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="w-full h-screen flex flex-col">
        <header className="flex items-center mb-3">
          <div className="flex items-center gap-2 justify-between w-full mb-3">
            <button
              onClick={() => setMute((m) => !m)}
              className="px-3 py-1 w-1/2 rounded-xl bg-amber-950 shadow hover:shadow-md active:scale-95 transition text-sm text-yellow-400"
              aria-label="Toggle sound"
            >
              {mute ? "🔇 Mute" : "🔊 Sound"}
            </button>
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="px-3 py-1 w-1/2 rounded-xl bg-amber-950 shadow hover:shadow-md active:scale-95 transition text-sm text-yellow-400"
            >
              {showHelp ? "Hide Help" : "Help"}
            </button>
            {/* <button
              onClick={() => (running ? setRunning(false) : setRunning(true))}
              className="px-3 py-1 rounded-xl bg-slate-900 text-white shadow hover:shadow-md active:scale-95 transition text-sm"
            >
              {running ? "Pause" : "Play"}
            </button> */}
          </div>
        </header>

        {showHelp && (
          <div className="mb-4 p-4 rounded-2xl bg-white shadow">
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong>Move:</strong> WASD / Arrow keys / Left joystick •{" "}
              <strong>Attack:</strong> Space/J • <strong>Dash:</strong> Shift/K.
              Level up by defeating enemies to increase damage, speed, and max
              health. On mobile, use the on-screen joystick and buttons.
            </p>
          </div>
        )}

        <div className="relative flex-1 rounded-2xl overflow-hidden bg-white shadow-xl">
          {!running ? (
            <GameArena isGameActive={running} onPlay={() => setRunning(true)} />
          ) : (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="touch-none select-none block w-full h-full border-2 border-amber-500 rounded-2xl"
            />
          )}

          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute bottom-5 left-5 w-32 h-32 rounded-full bg-slate-900/5 border border-slate-900/10 pointer-events-auto"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
            >
              {stateRef.current.input.touch && (
                <div
                  className="absolute w-12 h-12 rounded-full bg-slate-900/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${clamp(
                      stateRef.current.input.joyPoint.x -
                        stateRef.current.input.joyBase.x,
                      -40,
                      40
                    )}px), calc(-50% + ${clamp(
                      stateRef.current.input.joyPoint.y -
                        stateRef.current.input.joyBase.y,
                      -40,
                      40
                    )}px))`,
                  }}
                />
              )}
            </div>
            {running && (
              <div className="absolute bottom-6 right-6 flex gap-3 pointer-events-auto">
                <button
                  onClick={pressAttack}
                  className="w-16 h-16 rounded-full bg-sky-500/90 text-white shadow-xl active:scale-95 backdrop-blur-sm"
                >
                  ⚔️
                </button>
                <button
                  onClick={pressDash}
                  className="w-16 h-16 rounded-full bg-violet-500/90 text-white shadow-xl active:scale-95 backdrop-blur-sm"
                >
                  💨
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 ">
          <StatCard label="Level" value={stats.level} />
          <StatCard
            label="HP"
            value={`${Math.max(0, Math.floor(stats.health))}/${
              stats.maxHealth
            }`}
          />
          <StatCard
            label="XP to Next"
            value={`${Math.max(0, Math.floor(stats.xpToNext - stats.xp))}`}
          />
          <StatCard label="Time" value={`${Math.floor(stats.time)}s`} />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow hover:shadow-md active:scale-95 text-sm text-yellow-500 border border-yellow-500"
          >
            🏃 New Run
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} 8jjcricket. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-amber-950 p-4 rounded-2xl shadow flex flex-col">
      <div className="text-xs uppercase tracking-wide text-yellow-500">
        {label}
      </div>
      <div className="text-lg font-semibold text-right">{value}</div>
    </div>
  );
}
