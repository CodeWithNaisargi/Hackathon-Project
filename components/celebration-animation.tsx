"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocity: {
    x: number
    y: number
  }
}

interface CelebrationAnimationProps {
  sticky?: boolean
}

export function CelebrationAnimation({ sticky = false }: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const colors = [
    "#10b981", // emerald-500
    "#059669", // emerald-600
    "#34d399", // emerald-400
    "#6ee7b7", // emerald-300
    "#a7f3d0", // emerald-200
    "#f59e0b", // amber-500
    "#f97316", // orange-500
  ]

  useEffect(() => {
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      })
    }
    setConfetti(pieces)

    // Animate confetti
    const animateConfetti = () => {
      setConfetti((prevConfetti) =>
        prevConfetti
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.velocity.x,
            y: piece.y + piece.velocity.y,
            rotation: piece.rotation + 5,
            velocity: {
              ...piece.velocity,
              y: piece.velocity.y + 0.1, // gravity
            },
          }))
          .filter((piece) => piece.y < window.innerHeight + 50),
      )
    }

    const interval = setInterval(animateConfetti, 16) // ~60fps

    // Clean up after 0.5 seconds only if not sticky
    if (!sticky) {
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setConfetti([])
      }, 500)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }

    return () => {
      clearInterval(interval)
    }
  }, [sticky])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Success Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-in zoom-in-50 duration-500">
        <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-8 py-4 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">🎉 Prediction Complete!</h2>
          <p className="text-lg opacity-90">AI analysis successful</p>
        </div>
      </div>

      {/* Sticky Sun Animation */}
      {sticky && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-8xl animate-pulse">☀️</div>
        </div>
      )}

      {/* Confetti Pieces */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            transform: `rotate(${piece.rotation}deg)`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: "2px",
          }}
        />
      ))}

      {/* Sparkle Effects */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
      <div
        className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-ping"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Radial Burst Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 border-4 border-primary/30 rounded-full animate-ping" />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-accent/40 rounded-full animate-ping"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-secondary/50 rounded-full animate-ping"
          style={{ animationDelay: "0.6s" }}
        />
      </div>
    </div>
  )
}
