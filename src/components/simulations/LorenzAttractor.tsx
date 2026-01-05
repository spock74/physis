'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { rk4, Vector3 } from '@/lib/math'

// Lorenz System Equations
const lorenz = (t: number, [x, y, z]: Vector3, { sigma, rho, beta }: any): Vector3 => [
  sigma * (y - x),
  x * (rho - z) - y,
  x * y - beta * z,
]

function LorenzCurve({ sigma = 10, rho = 28, beta = 8/3 }) {
  const [points, setPoints] = useState<Vector3[]>([])
  
  // Simulation state
  const state = useRef<Vector3>([0.1, 0, 0])
  const time = useRef(0)
  const dt = 0.01

  // Reset when params change
  useEffect(() => {
    state.current = [0.1, 0, 0]
    setPoints([])
    time.current = 0
  }, [sigma, rho, beta])

  useFrame(() => {
    // Compute next 5 steps per frame for speed
    const newPoints: Vector3[] = []
    for (let i = 0; i < 5; i++) {
      state.current = rk4(lorenz, time.current, state.current, dt, { sigma, rho, beta })
      time.current += dt
      newPoints.push([...state.current])
    }
    
    setPoints(prev => {
      const next = [...prev, ...newPoints]
      // Limit points to prevent memory issues
      if (next.length > 3000) return next.slice(next.length - 3000)
      return next
    })
  })

  if (points.length < 2) return null

  return (
    <Line
      points={points}
      color="#C0392B" // Accent color
      lineWidth={2}
    />
  )
}

export default function LorenzAttractor() {
  const [rho, setRho] = useState(28)

  return (
    <div className="flex flex-col gap-4 my-8 p-6 border border-slate-200 rounded-lg bg-white/50">
      <div className="h-[400px] w-full bg-slate-100 rounded-md overflow-hidden">
        <Canvas camera={{ position: [0, 0, 60], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <LorenzCurve rho={rho} />
          <OrbitControls autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-sans font-medium text-primary dark:text-white [data-theme='reading']:text-white">
            Rayleigh Number (ρ)
          </label>
          <span className="font-mono text-lg text-accent">{rho.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          step="0.1"
          value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          className="w-full accent-accent"
        />
        <p className="text-xs text-gray-500 font-sans dark:text-white [data-theme='reading']:text-white">
          Drag to rotate. Adjust ρ to see the transition from stability to chaos.
        </p>
      </div>
    </div>
  )
}
