"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface Star {
  id: number
  x: number
  y: number
  size: "small" | "medium" | "large"
  animationDelay: number
  twinkleDelay: number
  color: string
}

interface Nebula {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  animationDelay: number
}

export function StarBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [shootingStars, setShootingStars] = useState<{ id: number; delay: number }[]>([])
  const [nebulas, setNebulas] = useState<Nebula[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = []
      const isDark = theme === "dark"

      for (let i = 0; i < (isDark ? 300 : 180); i++) {
        const colors = isDark
          ? [
              "text-cyan-300",
              "text-blue-300",
              "text-purple-300",
              "text-emerald-300",
              "text-pink-300",
              "text-yellow-300",
            ]
          : ["text-emerald-400", "text-blue-400", "text-indigo-400", "text-purple-400"]

        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() > 0.85 ? "large" : Math.random() > 0.7 ? "medium" : "small",
          animationDelay: Math.random() * 3,
          twinkleDelay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      setStars(newStars)
    }

    const generateShootingStars = () => {
      const newShootingStars = []
      const count = theme === "dark" ? 8 : 5

      for (let i = 0; i < count; i++) {
        newShootingStars.push({
          id: i,
          delay: i * 8 + Math.random() * 6,
        })
      }
      setShootingStars(newShootingStars)
    }

    const generateNebulas = () => {
      const newNebulas: Nebula[] = []
      const count = theme === "dark" ? 4 : 2

      for (let i = 0; i < count; i++) {
        newNebulas.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 120 + Math.random() * 180,
          opacity: theme === "dark" ? 0.08 + Math.random() * 0.12 : 0.04 + Math.random() * 0.08,
          animationDelay: Math.random() * 10,
        })
      }
      setNebulas(newNebulas)
    }

    generateStars()
    generateShootingStars()
    generateNebulas()
  }, [theme])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {nebulas.map((nebula) => (
        <div
          key={`nebula-${nebula.id}`}
          className={`absolute rounded-full animate-pulse ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20"
              : "bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10"
          }`}
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            opacity: nebula.opacity,
            animationDelay: `${nebula.animationDelay}s`,
            animationDuration: "6s",
            filter: "blur(30px)",
          }}
        />
      ))}

      {stars.map((star) => (
        <div
          key={star.id}
          className={`star star-${star.size} ${star.color} ${
            theme === "dark" ? "animate-star-glow" : "animate-twinkle"
          }`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.twinkleDelay}s`,
            animationDuration: theme === "dark" ? "1.5s" : "2.5s",
            filter: theme === "dark" ? "drop-shadow(0 0 2px currentColor)" : "drop-shadow(0 0 1px currentColor)",
          }}
        />
      ))}

      {shootingStars.map((shootingStar) => (
        <div
          key={`shooting-${shootingStar.id}`}
          className={`absolute w-1 h-1 rounded-full animate-shooting-star ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-300 to-blue-300"
              : "bg-gradient-to-r from-emerald-400 to-blue-400"
          }`}
          style={{
            left: "5%",
            top: `${15 + shootingStar.id * 12}%`,
            animationDelay: `${shootingStar.delay}s`,
            boxShadow:
              theme === "dark"
                ? "0 0 6px #67e8f9, 2px 0 12px #3b82f6, 4px 0 18px #8b5cf6"
                : "0 0 4px currentColor, 2px 0 8px currentColor",
          }}
        />
      ))}

      <svg className={`absolute inset-0 w-full h-full ${theme === "dark" ? "opacity-25" : "opacity-15"}`}>
        <defs>
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="50%" stopColor="currentColor" stopOpacity={theme === "dark" ? "0.3" : "0.25"} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="dynamic-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="30%" stopColor="currentColor" stopOpacity={theme === "dark" ? "0.4" : "0.3"} />
            <stop offset="70%" stopColor="currentColor" stopOpacity={theme === "dark" ? "0.6" : "0.5"} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Static constellation lines */}
        {stars.slice(0, theme === "dark" ? 40 : 25).map((star, index) => {
          const nextStar = stars[index + 1]
          if (!nextStar) return null
          return (
            <line
              key={`line-${index}`}
              x1={`${star.x}%`}
              y1={`${star.y}%`}
              x2={`${nextStar.x}%`}
              y2={`${nextStar.y}%`}
              stroke="url(#constellation-gradient)"
              strokeWidth={theme === "dark" ? "0.6" : "0.4"}
              className={`${theme === "dark" ? "text-cyan-300" : "text-emerald-400"} animate-pulse`}
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          )
        })}
        
        {/* Dynamic 3D lines */}
        {Array.from({ length: theme === "dark" ? 15 : 10 }).map((_, i) => {
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const endX = startX + (Math.random() - 0.5) * 40
          const endY = startY + (Math.random() - 0.5) * 40
          const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 20
          const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 20
          
          return (
            <path
              key={`dynamic-line-${i}`}
              d={`M ${startX}% ${startY}% Q ${midX}% ${midY}% ${endX}% ${endY}%`}
              stroke="url(#dynamic-line-gradient)"
              strokeWidth={theme === "dark" ? "1" : "0.8"}
              fill="none"
              className={`${theme === "dark" ? "text-purple-300" : "text-blue-400"} animate-drift-3d`}
              style={{ 
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0">
        {Array.from({ length: theme === "dark" ? 30 : 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-300/40 to-purple-300/40"
                : "bg-gradient-to-r from-emerald-400/30 to-blue-400/30"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
