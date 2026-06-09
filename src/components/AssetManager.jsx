import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../store/scrollStore'

import StudioMicrophone from './assets/StudioMicrophone'
import AudioWaveform from './assets/AudioWaveform'
import DigitalCanvas from './assets/DigitalCanvas'
import CinemaCamera from './assets/CinemaCamera'

export default function AssetManager() {
  const { viewport } = useThree()
  
  // Refs for the 4 asset groups
  const micRef = useRef()
  const waveRef = useRef()
  const canvasRef = useRef()
  const camRef = useRef()

  useFrame((state, delta) => {
    // Current scroll progress (0 to 1)
    const progress = scrollState.progress
    
    // Calculate WebGL container width constraints matching max-w-6xl
    const isMobile = viewport.width < 6
    const containerWidth = isMobile ? 0 : Math.min(viewport.width * 0.85, 10.8)
    const colCenter = containerWidth / 4
    
    const zPos = isMobile ? -3.5 : -1.8 // push deeper on mobile to be a background element
    const baseScale = isMobile ? 0.75 : 1.15

    // Section 1: Microphone (Left Column)
    if (micRef.current) {
      const active = progress <= 0.25
      const targetX = isMobile ? 0 : -colCenter
      const targetY = active ? -0.2 : -2.5
      const targetZ = active ? zPos : -4
      const targetScale = active ? baseScale : 0
      
      micRef.current.position.x = THREE.MathUtils.lerp(micRef.current.position.x, targetX, delta * 4)
      micRef.current.position.y = THREE.MathUtils.lerp(micRef.current.position.y, targetY, delta * 4)
      micRef.current.position.z = THREE.MathUtils.lerp(micRef.current.position.z, targetZ, delta * 4)
      micRef.current.scale.setScalar(THREE.MathUtils.lerp(micRef.current.scale.x, targetScale, delta * 5))
    }

    // Section 2: AudioWaveform (Right Column)
    if (waveRef.current) {
      const active = progress > 0.25 && progress <= 0.50
      const targetX = isMobile ? 0 : colCenter
      const targetY = active ? -0.2 : -2.5
      const targetZ = active ? zPos : -4
      const targetScale = active ? baseScale : 0

      waveRef.current.position.x = THREE.MathUtils.lerp(waveRef.current.position.x, targetX, delta * 4)
      waveRef.current.position.y = THREE.MathUtils.lerp(waveRef.current.position.y, targetY, delta * 4)
      waveRef.current.position.z = THREE.MathUtils.lerp(waveRef.current.position.z, targetZ, delta * 4)
      waveRef.current.scale.setScalar(THREE.MathUtils.lerp(waveRef.current.scale.x, targetScale, delta * 5))
    }

    // Section 3: DigitalCanvas (Left Column)
    if (canvasRef.current) {
      const active = progress > 0.50 && progress <= 0.75
      const targetX = isMobile ? 0 : -colCenter
      const targetY = active ? -0.1 : -2.5
      const targetZ = active ? zPos : -4
      const targetScale = active ? baseScale : 0

      canvasRef.current.position.x = THREE.MathUtils.lerp(canvasRef.current.position.x, targetX, delta * 4)
      canvasRef.current.position.y = THREE.MathUtils.lerp(canvasRef.current.position.y, targetY, delta * 4)
      canvasRef.current.position.z = THREE.MathUtils.lerp(canvasRef.current.position.z, targetZ, delta * 4)
      canvasRef.current.scale.setScalar(THREE.MathUtils.lerp(canvasRef.current.scale.x, targetScale, delta * 5))
    }

    // Section 4: CinemaCamera (Right Column)
    if (camRef.current) {
      const active = progress > 0.75
      const targetX = isMobile ? 0 : colCenter
      const targetY = active ? -0.2 : -2.5
      const targetZ = active ? zPos : -4
      const targetScale = active ? baseScale : 0

      camRef.current.position.x = THREE.MathUtils.lerp(camRef.current.position.x, targetX, delta * 4)
      camRef.current.position.y = THREE.MathUtils.lerp(camRef.current.position.y, targetY, delta * 4)
      camRef.current.position.z = THREE.MathUtils.lerp(camRef.current.position.z, targetZ, delta * 4)
      camRef.current.scale.setScalar(THREE.MathUtils.lerp(camRef.current.scale.x, targetScale, delta * 5))
    }
  })

  return (
    <>
      <group ref={micRef} position={[viewport.width, 0, -5]} scale={[0, 0, 0]}>
        <StudioMicrophone />
      </group>
      <group ref={waveRef} position={[viewport.width, 0, -5]} scale={[0, 0, 0]}>
        <AudioWaveform />
      </group>
      <group ref={canvasRef} position={[viewport.width, 0, -5]} scale={[0, 0, 0]}>
        <DigitalCanvas />
      </group>
      <group ref={camRef} position={[viewport.width, 0, -5]} scale={[0, 0, 0]}>
        <CinemaCamera />
      </group>
    </>
  )
}
