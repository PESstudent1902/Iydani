import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import AssetManager from './AssetManager'

export default function ThreeScene() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none select-none bg-parchment transition-colors duration-500">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        role="img"
        aria-label="3D visualization of studio equipment"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} near={0.1} far={50} />
        
        {/* Soft organic studio lighting */}
        <ambientLight intensity={0.9} color="#F5F3E9" />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.6} 
          color="#FAF9F4" 
        />
        <directionalLight 
          position={[-5, 3, -2]} 
          intensity={0.6} 
          color="#EDE8D8" 
        />
        <pointLight
          position={[0, 4, 2]}
          intensity={0.4}
          color="#D4A373"
        />
        
        {/* Suspense fallback for 3D Assets */}
        <Suspense fallback={null}>
          <AssetManager />
        </Suspense>

        {/* Cinematic Depth of Field for background blur and readability */}
        {/* <EffectComposer>
          <DepthOfField 
            focusDistance={0.02} 
            focalLength={0.03} 
            bokehScale={3.0} 
            height={480} 
          />
        </EffectComposer> */}

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  )
}
