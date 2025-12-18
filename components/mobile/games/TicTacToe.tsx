"use client";
import { useState } from "react";

export default function TicTacToe() {
  const [s, setS] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [xIsNext, setNext] = useState(true);
  const winner = calcWinner(s);

  function play(i: number) {
    if (s[i] || winner) return;
    const ns = s.slice();
    ns[i] = xIsNext ? "X" : "O";
    setS(ns);
    setNext(!xIsNext);
  }

  function reset() {
    setS(Array(9).fill(null));
    setNext(true);
  }

  return (
    <div className="space-y-2">
      <div className="font-medium">
        {winner ? `Winner: ${winner}` : `Turn: ${xIsNext ? "X" : "O"}`}
      </div>
      <div className="grid grid-cols-3 gap-3 w-65 mb-3">
        {s.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="h-20 text-xl font-bold text-yellow-500 border rounded p-[1px] rounded-2xl bg-gradient-to-b from-[#FFD100]/50 to-transparent hover:bg-gray-50"
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-end w-full pt-3">
        <button
          onClick={reset}
          className="text-white-800 bg-gradient-to-r from-[#FFD100] to-[#FF6B00] shadow-[0_0_15px_rgba(255,165,0,0.5)] border-t border-white/30 py-2 px-4 rounded-full font-bold text-md hover:scale-105 transition-transform duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function calcWinner(s: (null | "X" | "O")[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines)
    if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
  return null;
}
