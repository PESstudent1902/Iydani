import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function StudioMicrophone() {
  const groupRef = useRef()
  const prefersReduced = useReducedMotion()

  const geometries = useMemo(() => ({
    head: new THREE.SphereGeometry(0.35, 32, 32),
    grille: new THREE.SphereGeometry(0.36, 16, 16),
    neck: new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16),
    body: new THREE.CylinderGeometry(0.12, 0.1, 1.2, 16),
    base: new THREE.CylinderGeometry(0.25, 0.3, 0.08, 32),
  }), [])

  useFrame((state, delta) => {
    if (prefersReduced) return
    const time = state.clock.elapsedTime
    if (groupRef.current) {
      // Gentle levitation and slow rotation
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.05
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Microphone Capsule / Head */}
      <mesh geometry={geometries.head} position={[0, 1.1, 0]}>
        <meshPhysicalMaterial color="#3D4149" metalness={0.8} roughness={0.25} clearcoat={0.8} />
      </mesh>
      {/* Mesh Grille overlay */}
      <mesh geometry={geometries.grille} position={[0, 1.1, 0]}>
        <meshPhysicalMaterial color="#8A9A86" wireframe transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Neck connector */}
      <mesh geometry={geometries.neck} position={[0, 0.8, 0]}>
        <meshPhysicalMaterial color="#D4A373" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Main Microphone Body */}
      <mesh geometry={geometries.body} position={[0, 0.15, 0]}>
        <meshPhysicalMaterial color="#2A2D34" metalness={0.7} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      {/* Heavy Base mount */}
      <mesh geometry={geometries.base} position={[0, -0.5, 0]}>
        <meshPhysicalMaterial color="#2A2D34" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}
