'use client'

import React, { useMemo, useRef, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { useAttractorPath } from './useAttractorPath'
import './NeuralShaderMaterial' // Import to register the extension

const NODE_COUNT = 250
const CONNECTION_DISTANCE = 12

function NeuralMesh() {
  const activePos = useAttractorPath() // Returns ref to current position
  
  // 1. Generate Random Points (Spherical Distribution)
  const nodes = useMemo(() => {
    const pts = [];
    
    for (let i = 0; i < NODE_COUNT; i++) {
        // Usar coordenadas esféricas garante que fiquem aglomerados, sem "parafusos soltos" distantes
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = Math.pow(Math.random(), 1/3) * 12; // Raio máximo de 12 (ajuste conforme a escala)
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) * 0.6; // Achata um pouco em Y (formato de cérebro)
        const z = r * Math.cos(phi);
        
        pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [])

  // 2. Connectivity
  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
            if (nodes[i].distanceTo(nodes[j]) < CONNECTION_DISTANCE) {
                lines.push([nodes[i], nodes[j]])
            }
        }
    }
    return lines
  }, [nodes])

  // Refs
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const linesRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Initialize Positions in LayoutEffect to avoid FOUC
  useLayoutEffect(() => {
    if (!meshRef.current) return
    nodes.forEach((pos, i) => {
        dummy.position.copy(pos)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [nodes, dummy])

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current || !materialRef.current) return

    // Gentle Rotation
    meshRef.current.rotation.y += 0.001
    linesRef.current.rotation.y += 0.001

    // --- GPU UPDATE ---
    // Pass the Attractor Position to the Shader
    // activePos.current is already the {x,y,z} we want (scaled if handled in hook)
    materialRef.current.uniforms.uAttractorPos.value.copy(activePos.current)
    
    // Optional: Update time if we want animated noise later
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <>
        <group ref={linesRef}>
            {connections.map((points, i) => (
                <Line
                    key={i}
                    points={points}
                    color="#0f766e"
                    lineWidth={1}
                    transparent
                    opacity={0.2}
                />
            ))}
        </group>
        
        <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            {/* 
                Custom Shader Material 
                toneMapped={false} allows colors to exceed 1.0 (bloom effect potential)
            */}
            {/* @ts-ignore */}
            <neuralShaderMaterial 
                ref={materialRef} 
                transparent 
                toneMapped={false} 
                uRadius={8.0}
            />
        </instancedMesh>
    </>
  )
}

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-50 transition-colors duration-500">
        <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
            <fog attach="fog" args={['#f8fafc', 30, 60]} /> 
            <NeuralMesh />
        </Canvas>
    </div>
  )
}
