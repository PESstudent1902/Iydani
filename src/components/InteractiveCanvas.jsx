import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function InteractiveCanvas({ children, cameraPos = [0, 0, 4], modelPos = [0, 0, 0] }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.9} color="#F5F3E9" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FAF9F4" />
        <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#EDE8D8" />
        <pointLight position={[0, 4, 2]} intensity={0.3} color="#D4A373" />
        
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <group position={modelPos}>
            {children}
          </group>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={2.2}
        />
      </Canvas>
    </div>
  )
}
