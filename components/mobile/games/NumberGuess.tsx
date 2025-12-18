'use client'
import { useEffect, useState } from 'react'

export default function NumberGuess() {
  const [target, setTarget] = useState(0)
  const [guess, setGuess] = useState('')
  const [msg, setMsg] = useState('Start guessing 1-100!')

  useEffect(() => setTarget(1 + Math.floor(Math.random()*100)), [])

  function check() {
    const g = parseInt(guess, 10)
    if (Number.isNaN(g)) return setMsg('Enter a number!')
    if (g === target) setMsg('Correct!')
    else if (g < target) setMsg('Too low!')
    else setMsg('Too high!')
  }

  function reset() {
    setTarget(1 + Math.floor(Math.random()*100))
    setGuess(''); setMsg('Start guessing 1-100!')
  }

  return (
    <div className="space-y-2">
      <div className="font-medium">{msg}</div>
      <div className="flex gap-2">
        <input value={guess} onChange={e=>setGuess(e.target.value)} className="border rounded px-2 py-1" placeholder="Your guess"/>
        <button onClick={check} className="badge bg-blue-600 text-white">Try</button>
        <button onClick={reset} className="badge bg-gray-200">Reset</button>
      </div>
    </div>
  )
}