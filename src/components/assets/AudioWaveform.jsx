import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const BAR_COUNT = 40
const tempObject = new THREE.Object3D()

export default function AudioWaveform() {
  const meshRef = useRef()
  const prefersReduced = useReducedMotion()

  const geometry = useMemo(() => new THREE.BoxGeometry(0.08, 1, 0.08), [])

  // Gradient colors from sage (#8A9A86) to wood (#D4A373)
  const colorArray = useMemo(() => {
    const colors = new Float32Array(BAR_COUNT * 3)
    const col = new THREE.Color()
    for (let i = 0; i < BAR_COUNT; i++) {
      col.lerpColors(new THREE.Color('#8A9A86'), new THREE.Color('#D4A373'), i / BAR_COUNT)
      col.toArray(colors, i * 3)
    }
    return colors
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = (i - BAR_COUNT / 2) * 0.15
      
      // Calculate dynamic height based on sine waves, unless reduced motion is on
      const height = prefersReduced
        ? 0.3 + Math.sin(i * 0.2) * 0.2 // static waveform
        : Math.abs(
            Math.sin(time * 2 + i * 0.3) * 0.5 +
            Math.sin(time * 1.5 + i * 0.5) * 0.3 +
            Math.cos(time * 0.8 + i * 0.2) * 0.2
          )

      tempObject.position.set(x, height / 2 - 0.5, 0)
      tempObject.scale.set(1, Math.max(0.1, height * 1.5), 1)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    
    if (!prefersReduced) {
      meshRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, BAR_COUNT]}>
      <meshPhysicalMaterial 
        vertexColors 
        metalness={0.4} 
        roughness={0.4} 
        clearcoat={0.3} 
      />
      <instancedBufferAttribute
        attach="geometry-attributes-color"
        args={[colorArray, 3]}
      />
    </instancedMesh>
  )
}
