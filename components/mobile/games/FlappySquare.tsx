'use client'
import { useEffect, useRef, useState } from 'react'

export default function FlappySquare() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const cvs = canvasRef.current!
    const ctx = cvs.getContext('2d')!
    let raf = 0
    let y = 150, vy = 0
    let pipes: {x:number, gapY:number}[] = []
    let t = 0
    function reset() { y=150; vy=0; setScore(0); pipes=[]; t=0 }

    function loop() {
      t++
      vy += 0.5
      y += vy
      if (t % 80 === 0) pipes.push({ x: 400, gapY: 80 + Math.random()*120 })
      pipes.forEach(p => p.x -= 2)
      pipes = pipes.filter(p => p.x > -40)
      for (const p of pipes) {
        if (p.x < 40 && p.x+40 > 20) {
          if (y < p.gapY-40 || y > p.gapY+40) reset()
        }
        if (p.x === 38) setScore(s => s+1)
      }
      if (y > 280 || y < 0) reset()

      ctx.clearRect(0,0,400,300)
      ctx.fillStyle = '#16a34a'
      for (const p of pipes) {
        ctx.fillRect(p.x, 0, 40, p.gapY-40)
        ctx.fillRect(p.x, p.gapY+40, 40, 300)
      }
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(20, y-10, 20, 20)
      ctx.fillStyle = '#111827'
      ctx.font = '14px system-ui'
      ctx.fillText('Score: '+score, 10, 20)

      raf = requestAnimationFrame(loop)
    }

    function flap() { vy = -6 }
    cvs.addEventListener('click', flap)
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); cvs.removeEventListener('click', flap) }
  }, [])

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Click to flap. Avoid the pipes!</div>
      <canvas ref={canvasRef} width={400} height={300} className="border rounded" />
    </div>
  )
}