'use client'
import { useState } from 'react'

export default function TicTacToe() {
  const [s, setS] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null))
  const [xIsNext, setNext] = useState(true)
  const winner = calcWinner(s)

  function play(i: number) {
    if (s[i] || winner) return
    const ns = s.slice()
    ns[i] = xIsNext ? 'X' : 'O'
    setS(ns)
    setNext(!xIsNext)
  }

  function reset() { setS(Array(9).fill(null)); setNext(true) }

  return (
    <div className="space-y-2">
      <div className="font-medium">{winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? 'X' : 'O'}`}</div>
      <div className="grid grid-cols-3 gap-1 w-48">
        {s.map((v, i) => (
          <button key={i} onClick={() => play(i)} className="h-16 text-xl font-bold border rounded hover:bg-gray-50">
            {v}
          </button>
        ))}
      </div>
      <button onClick={reset} className="badge bg-blue-600 text-white">Reset</button>
    </div>
  )
}

function calcWinner(s: (null | 'X' | 'O')[]) {
  const lines = [ [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6] ]
  for (const [a,b,c] of lines) if (s[a] && s[a]===s[b] && s[a]===s[c]) return s[a]
  return null
}