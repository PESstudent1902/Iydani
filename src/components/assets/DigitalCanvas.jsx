import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function DigitalCanvas() {
  const groupRef = useRef()
  const prefersReduced = useReducedMotion()

  const layers = useMemo(() => [
    { size: [2.4, 1.6, 0.04], pos: [0, 0, -0.1],      color: '#2A2D34', metalness: 0.5, roughness: 0.3 },
    { size: [2.2, 1.4, 0.03], pos: [0, 0, 0],          color: '#F5F3E9', metalness: 0.1, roughness: 0.7 },
    { size: [1.8, 1.0, 0.02], pos: [0, 0.05, 0.05],    color: '#8A9A86', metalness: 0.2, roughness: 0.5 },
    { size: [0.8, 0.6, 0.015], pos: [-0.3, 0.1, 0.1],  color: '#D4A373', metalness: 0.1, roughness: 0.6 },
    { size: [0.6, 0.4, 0.015], pos: [0.4, -0.1, 0.1],  color: '#6F7D6B', metalness: 0.1, roughness: 0.6 },
  ], [])

  useFrame((state, delta) => {
    if (prefersReduced) return
    const time = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.12
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.06
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {layers.map((l, i) => (
        <RoundedBox key={i} args={l.size} position={l.pos} radius={0.03} smoothness={4}>
          <meshPhysicalMaterial 
            color={l.color} 
            metalness={l.metalness} 
            roughness={l.roughness} 
            clearcoat={i === 0 ? 0.6 : 0.1} 
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
      ))}
    </group>
  )
}
