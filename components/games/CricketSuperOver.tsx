'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// =============================================
// Cricket Super Over — TypeScript-safe version
// =============================================

type Outcome = 'SIX' | 'FOUR' | 'TWO' | 'ONE' | 'DOT' | 'OUT'
type GameState = 'menu' | 'playing' | 'over' | 'paused'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function rng(seed: number) {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

class SFX {
    public ctx: AudioContext | null = null
    public enabled = true

    private ensure() {
        if (!this.ctx) {
            const AC: typeof AudioContext =
                (window as any).AudioContext || (window as any).webkitAudioContext
            this.ctx = new AC()
        }
    }

    private beep(
        freq = 440,
        dur = 0.08,
        type: OscillatorType = 'sine',
        gain = 0.02
    ) {
        if (!this.enabled) return
        this.ensure()
        if (!this.ctx) return

        const o = this.ctx.createOscillator()
        const g = this.ctx.createGain()
        o.type = type
        o.frequency.value = freq
        g.gain.value = gain
        o.connect(g).connect(this.ctx.destination)
        o.start()
        o.stop(this.ctx.currentTime + dur)
    }

    hit() {
        this.beep(440, 0.08, 'square', 0.03)
        this.beep(660, 0.08, 'square', 0.02)
    }
    six() {
        this.beep(523, 0.12, 'sawtooth', 0.03)
        this.beep(784, 0.18, 'sawtooth', 0.03)
    }
    four() {
        this.beep(523, 0.1, 'triangle', 0.03)
        this.beep(659, 0.14, 'triangle', 0.02)
    }
    out() {
        this.beep(196, 0.25, 'sine', 0.05)
    }
    ui() {
        this.beep(600, 0.06, 'sine', 0.02)
    }
}
const sfx = new SFX()

class Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number

    constructor(x: number, y: number, angle: number, speed: number, life: number) {
        this.x = x
        this.y = y
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.life = life
        this.maxLife = life
        this.size = 2 + Math.random() * 2
    }
    step(dt: number) {
        this.x += this.vx * dt
        this.y += this.vy * dt
        this.vy += 50 * dt
        this.life -= dt
    }
    draw(ctx: CanvasRenderingContext2D) {
        const alpha = clamp(this.life / this.maxLife, 0, 1)
        ctx.globalAlpha = alpha
        ctx.fillRect(this.x, this.y, this.size, this.size)
        ctx.globalAlpha = 1
    }
}

interface Ball {
    t: number
    totalTime: number
    startX: number
    startY: number
    endX: number
    endY: number
    pitchX: number
    pitchY: number
    speed: number
    swing: number
    status: 'inflight' | 'hit' | 'dead'
    x: number
    y: number
    r: number
}

export default function CricketSuperOver() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const [dimensions, setDimensions] = useState<{ w: number; h: number }>({
        w: 960,
        h: 540,
    })
    const [state, setState] = useState<GameState>('menu')
    const [ballsLeft, setBallsLeft] = useState<number>(6)
    const [runs, setRuns] = useState<number>(0)
    const [wickets, setWickets] = useState<number>(0)
    const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null)
    const [best, setBest] = useState<number>(() =>
        Number(localStorage.getItem('csuper_best') || 0)
    )
    const [muted, setMuted] = useState<boolean>(false)

    const ballRef = useRef<Ball | null>(null)
    const particlesRef = useRef<Particle[]>([])
    const animRef = useRef<{ raf: number | null; last: number }>({ raf: null, last: 0 })
    const gameTimeRef = useRef<number>(0)
    const hasSwungRef = useRef<boolean>(false)
    const idealTimeRef = useRef<number>(0)
    const contactTimeRef = useRef<number | null>(null)

    useEffect(() => {
        const onResize = () => {
            const maxW = Math.min(window.innerWidth - 24, 1200)
            const w = clamp(maxW, 320, 1200)
            const h = Math.round((w * 9) / 16)
            setDimensions({ w, h })
        }
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        sfx.enabled = !muted
    }, [muted])

    function newBall() {
        const seed = Math.random() * 1000 + ballsLeft * 13
        const speed = 240 + rng(seed) * 80
        const length = 0.64 + rng(seed + 7) * 0.18
        const swing = (rng(seed + 15) - 0.5) * 0.8

        const pitchX = 0.5 + (rng(seed + 23) - 0.5) * 0.2
        const pitchY = 0.62 * dimensions.h

        const startX = pitchX * dimensions.w - 220
        const startY = 0.2 * dimensions.h
        const endX = pitchX * dimensions.w + 240 * swing
        const endY = 0.88 * dimensions.h

        const totalTime = 1.45 + rng(seed + 31) * 0.25

        idealTimeRef.current =
            performance.now() + totalTime * 1000 * (length * 0.62 + 0.25)

        const ball: Ball = {
            t: 0,
            totalTime,
            startX,
            startY,
            endX,
            endY,
            pitchX,
            pitchY,
            speed,
            swing,
            status: 'inflight',
            x: startX,
            y: startY,
            r: 6,
        }
        ballRef.current = ball
        hasSwungRef.current = false
        contactTimeRef.current = null
    }

    function outcomeFromError(ms: number): { label: string; runs: number; key: Outcome } {
        const e = Math.abs(ms)
        if (e <= 40) return { label: 'SIX!', runs: 6, key: 'SIX' }
        if (e <= 90) return { label: 'FOUR!', runs: 4, key: 'FOUR' }
        if (e <= 150) return { label: 'TWO', runs: 2, key: 'TWO' }
        if (e <= 220) return { label: 'ONE', runs: 1, key: 'ONE' }
        if (e <= 280) return { label: 'DOT', runs: 0, key: 'DOT' }
        return { label: 'WICKET', runs: 0, key: 'OUT' }
    }

    function attemptHit() {
        if (state !== 'playing' || !ballRef.current) return
        if (hasSwungRef.current) return
        hasSwungRef.current = true

        const now = performance.now()
        const err = now - idealTimeRef.current
        const o = outcomeFromError(err)
        setLastOutcome(o.key)

        if (o.key === 'SIX') sfx.six()
        else if (o.key === 'FOUR') sfx.four()
        else if (o.key === 'OUT') sfx.out()
        else sfx.hit()

        contactTimeRef.current = now

        if (o.runs >= 4) {
            const ps = particlesRef.current
            for (let i = 0; i < 90; i++) {
                const a = (Math.PI * 2 * i) / 90 + Math.random() * 0.2
                const sp = 120 + Math.random() * 160
                ps.push(
                    new Particle(dimensions.w * 0.72, dimensions.h * 0.8, a, sp, 0.8 + Math.random() * 0.6)
                )
            }
        }

        if (o.key === 'OUT') {
            setWickets(w => w + 1)
        } else {
            setRuns(r => r + o.runs)
        }

        if (ballRef.current) ballRef.current.status = o.key === 'OUT' ? 'dead' : 'hit'

        setTimeout(() => {
            setBallsLeft(b => {
                const nb = b - 1
                if (nb <= 0) {
                    setState('over')
                    setBest(prev => {
                        const newBest = Math.max(prev, runs + (o.key === 'OUT' ? 0 : o.runs))
                        localStorage.setItem('csuper_best', String(newBest))
                        return newBest
                    })
                } else {
                    newBall()
                }
                return nb
            })
        }, 650)
    }

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e as any).repeat) return
            if (e.code === 'Space') {
                e.preventDefault()
                if (state === 'menu') startGame()
                else if (state === 'over') startGame()
                else if (state === 'playing') attemptHit()
            } else if (e.code === 'KeyP') {
                if (state === 'playing') setState('paused')
                else if (state === 'paused') setState('playing')
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [state])

    function startGame() {
        sfx.ui()
        setRuns(0)
        setWickets(0)
        setBallsLeft(6)
        setLastOutcome(null)
        setState('playing')
        setTimeout(newBall, 120)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const c = ctx as CanvasRenderingContext2D

        function drawField(ctx: CanvasRenderingContext2D, w: number, h: number) {
            const sky = ctx.createLinearGradient(0, 0, 0, h)
            sky.addColorStop(0, '#0a1930')
            sky.addColorStop(1, '#0e2b57')
            ctx.fillStyle = sky
            ctx.fillRect(0, 0, w, h)

            ctx.fillStyle = '#cce4ff'
            for (let i = 0; i < 6; i++) {
                const x = (w * (i + 1)) / 7
                ctx.globalAlpha = 0.08
                ctx.beginPath()
                ctx.arc(x, 20, 6, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1

            ctx.fillStyle = '#2c7a3f'
            ctx.beginPath()
            ctx.ellipse(w * 0.5, h * 0.82, w * 0.46, h * 0.2, 0, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#d2c1a9'
            const pw = w * 0.22,
                ph = h * 0.26
            ctx.fillRect(w * 0.39, h * 0.56, pw, ph)

            ctx.fillStyle = '#ffffff'
            ctx.fillRect(w * 0.39, h * 0.8, pw, 2)

            ctx.fillStyle = 'rgba(0,0,0,0.15)'
            ctx.beginPath()
            ctx.ellipse(w * 0.72, h * 0.86, 40, 10, 0, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#f1f5f9'
            ctx.fillRect(w * 0.71, h * 0.78, 14, 28)
            ctx.fillStyle = '#334155'
            ctx.beginPath()
            ctx.arc(w * 0.72, h * 0.77, 10, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#ef4444'
            ctx.fillRect(w * 0.73, h * 0.79, 7, 28)

            ctx.fillStyle = '#9a7b4f'
            const sx = w * 0.41
            const sy = h * 0.79
            for (let i = 0; i < 3; i++) ctx.fillRect(sx + i * 8, sy - 30, 4, 30)
        }

        function stepBall(dt: number) {
            const ball = ballRef.current
            if (!ball) return
            ball.t += dt

            const tt = clamp(ball.t / ball.totalTime, 0, 1)
            const bx =
                (1 - tt) * (1 - tt) * ball.startX +
                2 * (1 - tt) * tt * (ball.pitchX * dimensions.w) +
                tt * tt * ball.endX
            const by =
                (1 - tt) * (1 - tt) * ball.startY +
                2 * (1 - tt) * tt * ball.pitchY +
                tt * tt * ball.endY
            ball.x = bx
            ball.y = by

            if (tt >= 1 && ball.status === 'inflight') {
                ball.status = 'dead'
                setLastOutcome('DOT')
                setBallsLeft(b => {
                    const nb = b - 1
                    if (nb <= 0) {
                        setState('over')
                        setBest(prev => {
                            const nb2 = Math.max(prev, runs)
                            localStorage.setItem('csuper_best', String(nb2))
                            return nb2
                        })
                    } else newBall()
                    return nb
                })
            }
        }

        function drawBall(ctx: CanvasRenderingContext2D) {
            const ball = ballRef.current
            if (!ball) return
            ctx.fillStyle = '#f43f5e'
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#fee2e2'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, ball.r - 1, 0.2, Math.PI - 0.2)
            ctx.stroke()
        }

        function drawParticles(ctx: CanvasRenderingContext2D, dt: number) {
            const ps = particlesRef.current
            ctx.fillStyle = '#ffffff'
            for (let i = ps.length - 1; i >= 0; i--) {
                const p = ps[i]
                p.step(dt)
                p.draw(ctx)
                if (p.life <= 0) ps.splice(i, 1)
            }
        }

        function loop(ts: number) {
            if (!animRef.current.last) animRef.current.last = ts
            const dt = clamp((ts - animRef.current.last) / 1000, 0, 1 / 15)
            animRef.current.last = ts
            gameTimeRef.current += dt

            c.clearRect(0, 0, dimensions.w, dimensions.h)
            drawField(c, dimensions.w, dimensions.h)

            if (state === 'playing' || state === 'paused') {
                if (state === 'playing') stepBall(dt)
                drawBall(c)
            }

            drawParticles(c, dt)

            animRef.current.raf = requestAnimationFrame(loop)
        }
        animRef.current.raf = requestAnimationFrame(loop)
        return () => {
            if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf)
        }
    }, [dimensions, state, runs])

    const StatBadge = ({ label, value }: { label: string; value: number }) => (
        <div className="px-3 py-2 rounded-2xl bg-slate-800/70 border border-slate-700 text-slate-100 shadow-md">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    )

    const OutcomeToast = () => (
        <AnimatePresence>
            {lastOutcome && (
                <motion.div
                    key={lastOutcome}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20"
                >
                    <div
                        className={
                            'px-5 py-2 rounded-full text-sm font-bold shadow-xl border ' +
                            (lastOutcome === 'SIX'
                                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                                : lastOutcome === 'FOUR'
                                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                                    : lastOutcome === 'OUT'
                                        ? 'bg-rose-600/30 border-rose-500/50 text-rose-100'
                                        : 'bg-slate-700/60 border-slate-600 text-slate-200')
                        }
                    >
                        {lastOutcome}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-3">
            <div className="w-full max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md" />
                        <div>
                            <div className="text-xs uppercase tracking-widest text-slate-400">Original</div>
                            <div className="text-lg font-extrabold leading-none">Super Over Cricket</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMuted(m => !m)}
                            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
                        >
                            {muted ? 'Unmute' : 'Mute'}
                        </button>
                        {state === 'playing' && (
                            <button
                                onClick={() => setState(s => (s === 'playing' ? 'paused' : 'playing'))}
                                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
                            >
                                {state === 'playing' ? 'Pause' : 'Resume'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    <canvas
                        ref={canvasRef}
                        width={dimensions.w}
                        height={dimensions.h}
                        className="w-full h-auto block bg-slate-900"
                    />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="flex gap-2 pointer-events-auto">
                            <StatBadge label="Runs" value={runs} />
                            <StatBadge label="Balls" value={ballsLeft} />
                            <StatBadge label="Wkts" value={wickets} />
                        </div>
                        <div className="pointer-events-auto">
                            <StatBadge label="Best" value={best} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {state !== 'playing' && (
                            <motion.div
                                key={state}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="text-center max-w-md p-6">
                                    {state === 'menu' && (
                                        <>
                                            <h1 className="text-3xl font-extrabold mb-2">Super Over Cricket</h1>
                                            <p className="text-slate-300 mb-6">
                                                Six balls. Pure timing. Tap/Space to hit, P to pause.
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={startGame}
                                                    className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg"
                                                >
                                                    Play
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setState('menu')
                                                        sfx.ui()
                                                    }}
                                                    className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100"
                                                >
                                                    How to Play
                                                </button>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-4">
                                                Original arcade game — not affiliated with any third party.
                                            </div>
                                        </>
                                    )}

                                    {state === 'over' && (
                                        <>
                                            <h2 className="text-2xl font-bold mb-2">Innings Complete!</h2>
                                            <p className="mb-4 text-slate-300">
                                                You scored <span className="text-emerald-400 font-semibold">{runs}</span> runs
                                                with <span className="text-rose-300 font-semibold">{wickets}</span> wicket(s).
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={startGame}
                                                    className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg"
                                                >
                                                    Play Again
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setState('menu')
                                                        sfx.ui()
                                                    }}
                                                    className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100"
                                                >
                                                    Main Menu
                                                </button>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-4">
                                                Tip: Hit as the ball is about to reach the crease line for boundaries.
                                            </div>
                                        </>
                                    )}

                                    {state === 'paused' && (
                                        <>
                                            <h2 className="text-2xl font-bold mb-2">Paused</h2>
                                            <p className="mb-4 text-slate-300">
                                                Press Resume or hit{' '}
                                                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                                                    P
                                                </kbd>{' '}
                                                to continue.
                                            </p>
                                            <button
                                                onClick={() => setState('playing')}
                                                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg"
                                            >
                                                Resume
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-3 right-3">
                        <button
                            onClick={() => (state === 'playing' ? attemptHit() : startGame())}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-900 font-extrabold shadow-xl border border-white/10 hover:brightness-110"
                        >
                            {state === 'playing' ? 'HIT (Space)' : 'PLAY'}
                        </button>
                    </div>

                    <OutcomeToast />
                </div>

                <div className="mt-3 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} 8jjcricket. All rights reserved.
                </div>
            </div>
        </div>
    )
}
