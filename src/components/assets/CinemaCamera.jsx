import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function CinemaCamera() {
  const groupRef = useRef()
  const prefersReduced = useReducedMotion()

  const geometries = useMemo(() => ({
    body: new THREE.BoxGeometry(1.0, 0.7, 0.6),
    lens: new THREE.CylinderGeometry(0.2, 0.25, 0.5, 32),
    lensRing: new THREE.TorusGeometry(0.22, 0.03, 8, 32),
    viewfinder: new THREE.BoxGeometry(0.2, 0.15, 0.15),
    grip: new THREE.BoxGeometry(0.15, 0.4, 0.5),
    hotshoe: new THREE.BoxGeometry(0.3, 0.04, 0.15),
    screen: new THREE.PlaneGeometry(0.6, 0.4),
  }), [])

  useFrame((state, delta) => {
    if (prefersReduced) return
    const time = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.25) * 0.18
      groupRef.current.position.y = Math.sin(time * 0.45) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Camera body */}
      <mesh geometry={geometries.body}>
        <meshPhysicalMaterial color="#2A2D34" metalness={0.6} roughness={0.25} clearcoat={0.4} />
      </mesh>
      {/* Lens barrel */}
      <mesh geometry={geometries.lens} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#1A1C21" metalness={0.8} roughness={0.15} />
      </mesh>
      {/* Lens ring */}
      <mesh geometry={geometries.lensRing} position={[0, 0, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial color="#D4A373" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Viewfinder */}
      <mesh geometry={geometries.viewfinder} position={[0, 0.42, -0.1]}>
        <meshPhysicalMaterial color="#2A2D34" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Grip */}
      <mesh geometry={geometries.grip} position={[0.55, -0.1, 0]}>
        <meshPhysicalMaterial color="#3D4149" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Hot shoe */}
      <mesh geometry={geometries.hotshoe} position={[0, 0.37, 0]}>
        <meshPhysicalMaterial color="#8A9A86" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Rear screen */}
      <mesh geometry={geometries.screen} position={[0, 0, -0.31]} rotation={[0, Math.PI, 0]}>
        <meshBasicMaterial color="#1A1C21" />
      </mesh>
    </group>
  )
}
