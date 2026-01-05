import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function useAttractorPath(count = 1000) {
  // Start at a point likely to be inside the mesh
  const position = useRef(new THREE.Vector3(10, 10, 10))
  const { viewport, mouse } = useThree()

  // Lorenz parameters
  const sigma = 10
  const rho = 28
  const beta = 8 / 3
  const dt = 0.01
  // Reduced speed slightly to ensure frame updates catch the motion
  const speed = 8 

  // We need a separate ref for the visual position returned to the component
  const visualPosition = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const x = position.current.x
    const y = position.current.y
    const z = position.current.z

    // Mouse interaction
    const mx = (mouse.x * viewport.width) / 2
    const my = (mouse.y * viewport.height) / 2
    const mz = 0 

    // Calculate distance to mouse
    const dx_m = x - mx
    const dy_m = y - my
    const dz_m = z - mz
    const dist_m_sq = dx_m * dx_m + dy_m * dy_m + dz_m * dz_m
    
    // Repulsion force
    const repulsionStrength = 50 // Reduced from 500 to prevent explosion
    const repulsionRadius = 100
    let fx = 0, fy = 0, fz = 0

    if (dist_m_sq < repulsionRadius * repulsionRadius) {
       const factor = repulsionStrength / (dist_m_sq + 1)
       // Push away
       fx = dx_m * factor
       fy = dy_m * factor
       fz = dz_m * factor
    }

    // Lorenz Equations + Repulsion
    const dx = (sigma * (y - x) + fx) * dt * speed
    const dy = (x * (rho - z) - y + fy) * dt * speed
    const dz = (x * y - beta * z + fz) * dt * speed

    // Update simulation state
    position.current.x += dx
    position.current.y += dy
    position.current.z += dz

    // Map to visual coordinates (Brain mesh is centered at 0,0,0)
    // Removed scaling up (was * 1.5) to ensure it stays within the mesh volume (-30 to 30)
    // Lorenz is approx -20 to 20.
    visualPosition.current.x = position.current.x * 1.0
    visualPosition.current.y = position.current.y * 1.0
    visualPosition.current.z = (position.current.z - 25) * 1.0 
  })

  return visualPosition
}
