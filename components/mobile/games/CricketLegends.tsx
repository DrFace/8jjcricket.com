'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Cricket Legends — Career Mode (mobile friendly)
 * - Levels, characters, XP, stamina, simple gear
 * - Canvas gameplay (timing + direction)
 * - Fully typed for TS
 * - Mobile-first: safe-area padding, wrapper-based sizing, stacked controls, tap-to-hit
 * External dep: framer-motion
 */

type GameScreen = 'menu' | 'character' | 'match' | 'result' | 'upgrades' | 'map'
type Outcome = 'SIX' | 'FOUR' | 'TWO' | 'ONE' | 'DOT' | 'OUT'
type ShotDir = 'left' | 'straight' | 'right'
type MatchPhase = 'intro' | 'playing' | 'paused' | 'over'

type CharacterId = 'rohan' | 'patel' | 'khan' | 'fiona' | 'arya'

interface Character {
    id: CharacterId
    name: string
    color: string
    perks: {
        powerPct?: number
        timingWindowMs?: number
        xpBonusPct?: number
        patternReveal?: boolean
    }
    unlockLevel: number
}

interface Gear {
    bat?: { powerPct: number; name: string }
    shoes?: { reactMs: number; name: string }
    gloves?: { precisionMs: number; name: string }
}

interface PlayerSave {
    level: number
    xp: number
    stamina: number // 0..100
    gear: Gear
    charactersUnlocked: CharacterId[]
    selectedChar: CharacterId
    bestScore: number
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
    swing: number
    speed: number
    status: 'inflight' | 'hit' | 'dead'
    x: number
    y: number
    r: number
    previewUntil: number // ms timestamp to keep preview line visible
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/* ------------------ Content Tables ------------------ */

const CHARACTERS: Character[] = [
    { id: 'rohan', name: 'Rookie Rohan', color: '#60a5fa', unlockLevel: 1, perks: {} },
    { id: 'patel', name: 'Power Patel', color: '#f59e0b', unlockLevel: 3, perks: { powerPct: 0.1 } },
    { id: 'khan', name: 'Quick Khan', color: '#34d399', unlockLevel: 6, perks: { timingWindowMs: 40 } },
    { id: 'fiona', name: 'Focus Fiona', color: '#a78bfa', unlockLevel: 10, perks: { xpBonusPct: 0.15 } },
    { id: 'arya', name: 'Captain Arya', color: '#f472b6', unlockLevel: 15, perks: { patternReveal: true } }
]

const levelConfig = (level: number) => {
    const overs = level < 4 ? 1 : level < 7 ? 2 : level < 11 ? 3 : 5
    const pace = 1 + Math.min(0.5, level * 0.03)
    const spin = Math.min(0.9, 0.1 + level * 0.04)
    const previewMs = clamp(700 - Math.min(450, (level - 1) * 25), 220, 700)
    const xpBase = 60 + level * 12
    return { overs, pace, spin, previewMs, xpBase }
}

/* ------------------ SFX ------------------ */
class SFX {
    ctx: AudioContext | null = null
    enabled = true
    ensure() {
        if (!this.ctx) {
            const AC: typeof AudioContext =
                (window as any).AudioContext || (window as any).webkitAudioContext
            this.ctx = new AC()
        }
    }
    beep(freq = 440, dur = 0.08, type: OscillatorType = 'sine', gain = 0.02) {
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
    hit() { this.beep(440, 0.08, 'square', 0.03); this.beep(660, 0.08, 'square', 0.02) }
    six() { this.beep(523, 0.12, 'sawtooth', 0.03); this.beep(784, 0.16, 'sawtooth', 0.03) }
    four() { this.beep(523, 0.1, 'triangle', 0.03); this.beep(659, 0.14, 'triangle', 0.02) }
    out() { this.beep(196, 0.25, 'sine', 0.05) }
    ui() { this.beep(600, 0.06, 'sine', 0.02) }
}
const sfx = new SFX()

/* ------------------ Logic Helpers ------------------ */
function timingOutcome(
    errMs: number,
    stamina: number,
    _shot: ShotDir,
    perks: Character['perks'],
    gear: Gear
): Outcome {
    // Base windows
    let w6 = 40, w4 = 90, w2 = 150, w1 = 220, w0 = 280

    if (perks.timingWindowMs) {
        w6 += 0.5 * perks.timingWindowMs
        w4 += 0.6 * perks.timingWindowMs
        w2 += 0.7 * perks.timingWindowMs
        w1 += 0.8 * perks.timingWindowMs
    }
    if (gear.gloves) {
        w6 += 0.3 * gear.gloves.precisionMs
        w4 += 0.4 * gear.gloves.precisionMs
        w2 += 0.5 * gear.gloves.precisionMs
    }
    if (gear.shoes) {
        w6 += 0.2 * gear.shoes.reactMs
        w4 += 0.3 * gear.shoes.reactMs
    }

    // Stamina narrows windows
    const pen = clamp((100 - stamina) / 100, 0, 0.6)
    w6 *= (1 - 0.3 * pen)
    w4 *= (1 - 0.25 * pen)
    w2 *= (1 - 0.2 * pen)
    w1 *= (1 - 0.1 * pen)

    const e = Math.abs(errMs)
    if (e <= w6) return 'SIX'
    if (e <= w4) return 'FOUR'
    if (e <= w2) return 'TWO'
    if (e <= w1) return 'ONE'
    if (e <= w0) return 'DOT'
    return 'OUT'
}

function runsForOutcome(o: Outcome, perks: Character['perks'], gear: Gear): number {
    let r = o === 'SIX' ? 6 : o === 'FOUR' ? 4 : o === 'TWO' ? 2 : o === 'ONE' ? 1 : 0
    const powerPct = (perks.powerPct ?? 0) + (gear.bat?.powerPct ?? 0)
    if (o === 'FOUR' || o === 'SIX') r = Math.round(r * (1 + powerPct))
    return r
}

function initialSave(): PlayerSave {
    return {
        level: 1,
        xp: 0,
        stamina: 100,
        gear: {
            bat: { powerPct: 0.05, name: 'Street Bat' },
            shoes: { reactMs: 20, name: 'Light Trainers' },
            gloves: { precisionMs: 15, name: 'Grip Gloves' }
        },
        charactersUnlocked: ['rohan'],
        selectedChar: 'rohan',
        bestScore: 0
    }
}

const SAVE_KEY = 'cricket_legends_save_v1'

/* ------------------ Component ------------------ */
export default function CricketLegends() {
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const [screen, setScreen] = useState<GameScreen>('menu')
    const [phase, setPhase] = useState<MatchPhase>('intro')
    const [muted, setMuted] = useState(false)

    // Persistent save
    const [save, setSave] = useState<PlayerSave>(() => {
        try {
            const raw = localStorage.getItem(SAVE_KEY)
            if (raw) return JSON.parse(raw) as PlayerSave
        } catch { }
        return initialSave()
    })

    useEffect(() => { sfx.enabled = !muted }, [muted])
    useEffect(() => { localStorage.setItem(SAVE_KEY, JSON.stringify(save)) }, [save])

    const character = useMemo(
        () => CHARACTERS.find(c => c.id === save.selectedChar) ?? CHARACTERS[0],
        [save.selectedChar]
    )

    // Match state
    const [score, setScore] = useState(0)
    const [wickets, setWickets] = useState(0)
    const [ballsLeft, setBallsLeft] = useState(6)
    const [overs, setOvers] = useState(1)
    const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null)
    const [shotDir, setShotDir] = useState<ShotDir>('straight')
    const [message, setMessage] = useState<string>('')

    const ballRef = useRef<Ball | null>(null)
    const animRef = useRef<number | null>(null)
    const lastTsRef = useRef<number>(0)
    const idealHitTimeRef = useRef<number>(0)
    const canSwingRef = useRef<boolean>(false)

    const dimsRef = useRef<{ w: number; h: number }>({ w: 960, h: 540 })
    const [dims, setDims] = useState(dimsRef.current)
    const isMobile = dims.w < 480

    const cfg = levelConfig(save.level)

    /* ---------- Responsive sizing from wrapper + safe areas ---------- */
    useEffect(() => {
        const update = () => {
            const el = wrapperRef.current
            const maxW = el ? el.clientWidth : Math.min(window.innerWidth - 24, 1200)
            const w = clamp(maxW, 320, 1200)
            const h = Math.round((w * 9) / 16)
            dimsRef.current = { w, h }
            setDims({ w, h })
        }

        const ro = new ResizeObserver(update)
        if (wrapperRef.current) ro.observe(wrapperRef.current)
        window.addEventListener('resize', update)
        update()
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [])

    /* ---------- Match lifecycle ---------- */
    function startMatch() {
        sfx.ui()
        setScore(0)
        setWickets(0)
        const totalBalls = cfg.overs * 6
        setBallsLeft(totalBalls)
        setOvers(cfg.overs)
        setLastOutcome(null)
        setMessage(`Level ${save.level} — Good luck!`)
        setScreen('match')
        setPhase('intro')
        setTimeout(() => { setPhase('playing'); newBall() }, 600)
    }

    function endMatch() {
        setPhase('over')
        const newBest = Math.max(save.bestScore, score)
        const gained = Math.max(0, Math.round(cfg.xpBase + score))
        const staminaLoss = clamp(20 + cfg.overs * 5, 0, 60)
        const levelThreshold = 120 + save.level * 80

        let nextLevel = save.level
        let nextXp = save.xp + gained
        while (nextXp >= levelThreshold) { nextXp -= levelThreshold; nextLevel += 1 }

        const unlockedNow = CHARACTERS.filter(c => c.unlockLevel <= nextLevel).map(c => c.id)
        const uniqueUnlocks = Array.from(new Set([...save.charactersUnlocked, ...unlockedNow]))

        setSave(prev => ({
            ...prev,
            bestScore: newBest,
            xp: nextXp,
            level: nextLevel,
            stamina: clamp(prev.stamina - staminaLoss, 10, 100),
            charactersUnlocked: uniqueUnlocks
        }))
    }

    /* ---------- Ball creation & animation ---------- */
    function newBall() {
        const { w, h } = dimsRef.current
        const baseSpeed = 250 * cfg.pace
        const speed = rand(baseSpeed * 0.9, baseSpeed * 1.2)
        const swing = (Math.random() - 0.5) * 0.9 * cfg.spin
        const pitchX = 0.5 + (Math.random() - 0.5) * 0.25
        const pitchY = 0.62 * h
        const startX = pitchX * w - rand(180, 260)
        const startY = 0.18 * h
        const endX = pitchX * w + swing * 260
        const endY = 0.88 * h
        const totalTime = rand(1.3, 1.6)
        const previewBase = cfg.previewMs
        const extraPreview = character.perks.patternReveal ? 400 : 0
        const previewUntil = performance.now() + previewBase + extraPreview

        idealHitTimeRef.current = performance.now() + totalTime * 1000 * rand(0.42, 0.58)

        ballRef.current = {
            t: 0, totalTime,
            startX, startY, endX, endY,
            pitchX, pitchY,
            swing, speed,
            x: startX, y: startY, r: 6,
            status: 'inflight',
            previewUntil
        }
        canSwingRef.current = true
        setLastOutcome(null)
    }

    function swing() {
        if (phase !== 'playing' || !ballRef.current || !canSwingRef.current) return
        canSwingRef.current = false
        const now = performance.now()
        const err = now - idealHitTimeRef.current
        const o = timingOutcome(err, save.stamina, shotDir, character.perks, save.gear)
        setLastOutcome(o)

        if (o === 'SIX') sfx.six()
        else if (o === 'FOUR') sfx.four()
        else if (o === 'OUT') sfx.out()
        else sfx.hit()

        if (o === 'OUT') setWickets(w => w + 1)
        else setScore(s => s + runsForOutcome(o, character.perks, save.gear))

        const dirPenalty = shotDir === 'straight' ? 2 : 4
        setSave(prev => ({ ...prev, stamina: clamp(prev.stamina - dirPenalty, 0, 100) }))

        setTimeout(() => {
            setBallsLeft(b => {
                const nb = b - 1
                if (nb <= 0 || wickets >= 10) endMatch()
                else newBall()
                return nb
            })
        }, 600)
    }

    /* ---------- Controls: keyboard + tap-to-hit ---------- */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e as any).repeat) return
            if (screen !== 'match') return
            if (e.code === 'Space') { e.preventDefault(); if (phase === 'playing') swing() }
            else if (e.code === 'ArrowLeft') setShotDir('left')
            else if (e.code === 'ArrowRight') setShotDir('right')
            else if (e.code === 'ArrowUp') setShotDir('straight')
            else if (e.code === 'KeyP') setPhase(p => (p === 'playing' ? 'paused' : 'playing'))
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [phase, screen])

    useEffect(() => {
        const c = canvasRef.current
        if (!c) return
        const onTap = () => { if (screen === 'match' && phase === 'playing') swing() }
        c.addEventListener('click', onTap, { passive: true })
        c.addEventListener('touchend', onTap, { passive: true })
        return () => {
            c.removeEventListener('click', onTap)
            c.removeEventListener('touchend', onTap)
        }
    }, [screen, phase])

    /* ---------- Render loop ---------- */
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const drawField = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            const sky = ctx.createLinearGradient(0, 0, 0, h)
            sky.addColorStop(0, '#0b1220'); sky.addColorStop(1, '#102746')
            ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)

            // ground
            ctx.fillStyle = '#276749'
            ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.82, w * 0.46, h * 0.2, 0, 0, Math.PI * 2); ctx.fill()

            // pitch
            ctx.fillStyle = '#d2c1a9'
            const pw = w * 0.22, ph = h * 0.26
            ctx.fillRect(w * 0.39, h * 0.56, pw, ph)

            // crease
            ctx.fillStyle = '#ffffff'; ctx.fillRect(w * 0.39, h * 0.8, pw, 2)

            // player stylized
            ctx.fillStyle = character.color
            ctx.beginPath(); ctx.arc(w * 0.72, h * 0.77, 10, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#e5e7eb'; ctx.fillRect(w * 0.71, h * 0.78, 14, 28)
            ctx.fillStyle = '#f87171'; ctx.fillRect(w * 0.73, h * 0.79, 7, 28)

            // stumps
            ctx.fillStyle = '#9a7b4f'
            const sx = w * 0.41, sy = h * 0.79
            for (let i = 0; i < 3; i++) ctx.fillRect(sx + i * 8, sy - 30, 4, 30)
        }

        const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
            ctx.fillStyle = '#ef4444'
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill()
            ctx.strokeStyle = '#fee2e2'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r - 1, 0.2, Math.PI - 0.2); ctx.stroke()
        }

        const drawPreview = (ctx: CanvasRenderingContext2D, ball: Ball, now: number) => {
            if (now > ball.previewUntil) return
            ctx.strokeStyle = 'rgba(255,255,255,0.25)'
            ctx.setLineDash([6, 6]); ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(ball.startX, ball.startY)
            ctx.quadraticCurveTo(ball.pitchX * dims.w, ball.pitchY, ball.endX, ball.endY)
            ctx.stroke()
            ctx.setLineDash([])
        }

        const stepBall = (ball: Ball, dt: number) => {
            ball.t += dt
            const tt = clamp(ball.t / ball.totalTime, 0, 1)
            const bx = (1 - tt) * (1 - tt) * ball.startX +
                2 * (1 - tt) * tt * (ball.pitchX * dims.w) + tt * tt * ball.endX
            const by = (1 - tt) * (1 - tt) * ball.startY +
                2 * (1 - tt) * tt * (ball.pitchY) + tt * tt * ball.endY
            ball.x = bx; ball.y = by

            if (tt >= 1 && ball.status === 'inflight') {
                ball.status = 'dead'
                setLastOutcome('DOT')
                setBallsLeft(b => {
                    const nb = b - 1
                    if (nb <= 0 || wickets >= 10) endMatch()
                    else newBall()
                    return nb
                })
            }
        }

        const loop = (ts: number) => {
            if (!lastTsRef.current) lastTsRef.current = ts
            const dt = clamp((ts - lastTsRef.current) / 1000, 0, 1 / 15)
            lastTsRef.current = ts

            ctx.clearRect(0, 0, dims.w, dims.h)
            drawField(ctx, dims.w, dims.h)

            const ball = ballRef.current
            if (screen === 'match' && (phase === 'playing' || phase === 'paused')) {
                if (ball) {
                    if (phase === 'playing') stepBall(ball, dt)
                    drawPreview(ctx, ball, performance.now())
                    drawBall(ctx, ball)
                }
            }
            animRef.current = requestAnimationFrame(loop)
        }

        animRef.current = requestAnimationFrame(loop)
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
    }, [screen, phase, character.color, wickets, dims])

    /* ---------- UI bits ---------- */
    const Badge = ({ label, value }: { label: string; value: string | number }) => (
        <div className="px-3 py-2 rounded-2xl bg-slate-800/70 border border-slate-700 text-slate-100 shadow-md">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    )

    const CharacterCard = ({ c, locked, onPick }: {
        c: Character; locked: boolean; onPick: (id: CharacterId) => void
    }) => (
        <div className={`rounded-2xl border p-4 ${locked ? 'opacity-50' : ''} bg-slate-800/40 border-slate-700`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl" style={{ background: c.color }} />
                <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-slate-400">Unlock: Lv {c.unlockLevel}</div>
                </div>
            </div>
            <ul className="mt-2 text-xs text-slate-300 list-disc ml-5 space-y-1">
                {c.perks.powerPct ? <li>+{Math.round(c.perks.powerPct * 100)}% boundary power</li> : null}
                {c.perks.timingWindowMs ? <li>+{c.perks.timingWindowMs}ms timing window</li> : null}
                {c.perks.xpBonusPct ? <li>+{Math.round((c.perks.xpBonusPct) * 100)}% XP</li> : null}
                {c.perks.patternReveal ? <li>Longer ball preview</li> : null}
                {Object.keys(c.perks).length === 0 ? <li>Balanced rookie</li> : null}
            </ul>
            <button
                disabled={locked}
                onClick={() => onPick(c.id)}
                className={`mt-3 px-3 py-2 rounded-xl border ${locked ? 'bg-slate-700 text-slate-400 border-slate-700' : 'bg-emerald-500 text-slate-900 border-transparent hover:bg-emerald-400'} font-semibold`}
            >
                {locked ? 'Locked' : 'Select'}
            </button>
        </div>
    )

    /* ---------- Screens ---------- */
    const MenuScreen = () => (
        <div className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold">Cricket Legends: Career</h1>
            <p className="text-slate-300">Level up your batter, unlock characters, and chase your best score.</p>
            <div className="flex items-center justify-center gap-3">
                <button className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg" onClick={() => setScreen('map')}>Start</button>
                <button className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100" onClick={() => setScreen('upgrades')}>Upgrades</button>
            </div>
            <div className="text-xs text-slate-400">
                Best: <span className="text-emerald-300 font-semibold">{save.bestScore}</span> | Level: <span className="font-semibold">{save.level}</span> | XP: <span className="font-semibold">{save.xp}</span>
            </div>
        </div>
    )

    const MapScreen = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Career Map</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700" onClick={() => setScreen('menu')}>Back</button>
                    <button className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700" onClick={() => setScreen('character')}>Characters</button>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Level {save.level}</div>
                    <div className="text-sm text-slate-300 mb-2">Overs: {cfg.overs} • Pace: {cfg.pace.toFixed(2)} • Spin: {cfg.spin.toFixed(2)}</div>
                    <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold" onClick={startMatch}>Play Match</button>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Stamina</div>
                    <div className="text-sm text-slate-300 mb-2">{save.stamina} / 100</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${save.stamina}%` }} />
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Selected</div>
                    <div className="text-sm text-slate-300">{character.name}</div>
                    <div className="mt-2 w-8 h-8 rounded-xl" style={{ background: character.color }} />
                </div>
            </div>
        </div>
    )

    const CharacterScreen = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Characters</h2>
                <button className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700" onClick={() => setScreen('map')}>Back</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CHARACTERS.map(c => {
                    const locked = !save.charactersUnlocked.includes(c.id)
                    return (
                        <CharacterCard
                            key={c.id}
                            c={c}
                            locked={locked}
                            onPick={(id) => {
                                if (locked) return
                                sfx.ui()
                                setSave(prev => ({ ...prev, selectedChar: id }))
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )

    const UpgradesScreen = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upgrades</h2>
                <button className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700" onClick={() => setScreen('menu')}>Back</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Bat</div>
                    <div className="text-sm text-slate-300 mb-2">{save.gear.bat?.name} (+{Math.round((save.gear.bat?.powerPct ?? 0) * 100)}% power)</div>
                    <button
                        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700"
                        onClick={() => {
                            sfx.ui()
                            setSave(prev => ({ ...prev, gear: { ...prev.gear, bat: { powerPct: (prev.gear.bat?.powerPct ?? 0) + 0.03, name: 'Upgraded Bat' } } }))
                        }}
                    >
                        Upgrade (+3% power)
                    </button>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Shoes</div>
                    <div className="text-sm text-slate-300 mb-2">{save.gear.shoes?.name} (+{save.gear.shoes?.reactMs ?? 0}ms reaction)</div>
                    <button
                        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700"
                        onClick={() => {
                            sfx.ui()
                            setSave(prev => ({ ...prev, gear: { ...prev.gear, shoes: { reactMs: (prev.gear.shoes?.reactMs ?? 0) + 10, name: 'Pro Shoes' } } }))
                        }}
                    >
                        Upgrade (+10ms)
                    </button>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4 bg-slate-800/40">
                    <div className="font-semibold mb-1">Gloves</div>
                    <div className="text-sm text-slate-300 mb-2">{save.gear.gloves?.name} (+{save.gear.gloves?.precisionMs ?? 0}ms precision)</div>
                    <button
                        className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700"
                        onClick={() => {
                            sfx.ui()
                            setSave(prev => ({ ...prev, gear: { ...prev.gear, gloves: { precisionMs: (prev.gear.gloves?.precisionMs ?? 0) + 10, name: 'Pro Gloves' } } }))
                        }}
                    >
                        Upgrade (+10ms)
                    </button>
                </div>
            </div>
        </div>
    )

    const ResultScreen = () => (
        <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Match Over</h2>
            <p className="text-slate-300">Score: <span className="font-bold text-emerald-400">{score}</span> | Wickets: {wickets}</p>
            <div className="flex items-center justify-center gap-3">
                <button className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold" onClick={() => { setScreen('map') }}>Continue</button>
                <button className="px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100" onClick={() => { setScreen('menu') }}>Main Menu</button>
            </div>
            <div className="text-xs text-slate-400">
                XP and unlocks are saved. Level: {save.level} | XP: {save.xp} | Best: {save.bestScore}
            </div>
        </div>
    )

    /* ---------- Layout ---------- */
    return (
        <div className="min-h-[100dvh] w-full bg-slate-900 text-slate-100 flex items-center justify-center p-3">
            <div
                ref={wrapperRef}
                className="w-full max-w-[1200px] mx-auto pb-[calc(env(safe-area-inset-bottom)+80px)]"
            >
                {/* Top bar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md" />
                        <div>
                            <div className="text-xs uppercase tracking-widest text-slate-400">Career</div>
                            <div className="text-lg font-extrabold leading-none">Cricket Legends</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMuted(m => !m)}
                            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
                        >
                            {muted ? 'Unmute' : 'Mute'}
                        </button>
                    </div>
                </div>

                {/* Stage */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    <canvas
                        ref={canvasRef}
                        width={dims.w}
                        height={dims.h}
                        className="w-full h-auto block bg-slate-900"
                        style={{ touchAction: 'manipulation' }}
                    />

                    {/* HUD */}
                    {screen === 'match' && (
                        <div className={`absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none ${isMobile ? 'scale-90 origin-top-left' : ''}`}>
                            <div className="flex gap-2 pointer-events-auto">
                                <Badge label="Score" value={score} />
                                <Badge label="Balls" value={ballsLeft} />
                                <Badge label="Wkts" value={wickets} />
                            </div>
                            <div className="flex gap-2 pointer-events-auto">
                                <Badge label="Level" value={save.level} />
                                <Badge label="Stamina" value={`${save.stamina}`} />
                            </div>
                        </div>
                    )}

                    {/* Overlays */}
                    <AnimatePresence>
                        {screen === 'menu' && (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="max-w-md p-6"><MenuScreen /></div>
                            </motion.div>
                        )}

                        {screen === 'map' && (
                            <motion.div
                                key="map"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="max-w-2xl w-full p-6"><MapScreen /></div>
                            </motion.div>
                        )}

                        {screen === 'character' && (
                            <motion.div
                                key="character"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="max-w-4xl w-full p-6"><CharacterScreen /></div>
                            </motion.div>
                        )}

                        {screen === 'upgrades' && (
                            <motion.div
                                key="upgrades"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="max-w-3xl w-full p-6"><UpgradesScreen /></div>
                            </motion.div>
                        )}

                        {screen === 'match' && phase !== 'playing' && (
                            <motion.div
                                key="matchoverlay"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="text-center max-w-md p-6">
                                    {phase === 'intro' && (
                                        <>
                                            <h2 className="text-2xl font-bold mb-2">Level {save.level}</h2>
                                            <p className="text-slate-300 mb-4">Overs: {cfg.overs} — Pace {cfg.pace.toFixed(2)}, Spin {cfg.spin.toFixed(2)}</p>
                                            <div className="text-sm text-slate-400 mb-6">{message}</div>
                                            <button
                                                onClick={() => { setPhase('playing'); newBall() }}
                                                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg"
                                            >Begin</button>
                                        </>
                                    )}
                                    {phase === 'paused' && (
                                        <>
                                            <h2 className="text-2xl font-bold mb-2">Paused</h2>
                                            <p className="mb-4 text-slate-300">Press Resume or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">P</kbd></p>
                                            <button onClick={() => setPhase('playing')} className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg">Resume</button>
                                        </>
                                    )}
                                    {phase === 'over' && (<ResultScreen />)}
                                </div>
                            </motion.div>
                        )}

                        {/* Controls — mobile-first placement */}
                        {screen === 'match' && (
                            <div
                                className={
                                    `absolute left-3 right-3 ` +
                                    (isMobile
                                        ? 'bottom-[calc(env(safe-area-inset-bottom)+84px)] flex flex-col gap-2 items-stretch'
                                        : 'bottom-3 flex items-end justify-between')
                                }
                            >
                                {/* Shot direction */}
                                <div className={isMobile ? 'flex justify-center gap-2' : 'flex gap-2'}>
                                    {(['left', 'straight', 'right'] as ShotDir[]).map(dir => (
                                        <button
                                            key={dir}
                                            onClick={() => setShotDir(dir)}
                                            className={`px-3 py-2 rounded-xl border ${shotDir === dir ? 'bg-emerald-500 text-slate-900 border-transparent' : 'bg-slate-800 border-slate-700 text-slate-100'}`}
                                        >
                                            {dir}
                                        </button>
                                    ))}
                                </div>

                                {/* Action */}
                                <button
                                    onClick={() => (phase === 'playing' ? swing() : null)}
                                    className={'px-5 py-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-900 font-extrabold shadow-xl border border-white/10 hover:brightness-110 ' + (isMobile ? 'w-full' : '')}
                                >
                                    HIT {isMobile ? '(Tap/Space)' : '(Space)'}
                                </button>
                            </div>
                        )}

                        {/* Outcome Toast */}
                        {screen === 'match' && lastOutcome && (
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
                </div>

                {/* Footer */}
                <div className="mt-3 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Your Studio — Cricket Legends (web). All gameplay systems original.
                </div>
            </div>
        </div>
    )
}
