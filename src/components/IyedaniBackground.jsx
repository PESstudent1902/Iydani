import React, { useState, useEffect } from 'react'

export default function IyedaniBackground({ currentPage }) {
  const [isScrolledDown, setIsScrolledDown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.4
      const isLegend = currentPage === 'legend'
      const scrolled = isLegend && window.scrollY > threshold
      setIsScrolledDown(scrolled)
      document.documentElement.classList.toggle('dark-bg-active', scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // run once initially

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.classList.remove('dark-bg-active')
    }
  }, [currentPage])

  const bgClass = isScrolledDown ? 'bg-charcoal-dark' : 'bg-parchment'

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-[800ms] ease-out ${bgClass}`}>
      
      {/* 1. Fluid Google Labs-style Color Blobs */}
      {/* Blob 1 - Sage Green (Sound/Nature) */}
      <div 
        className={`absolute -top-[10%] -left-[5%] w-[45vw] h-[45vw] rounded-full blur-[120px] animate-float-slow transition-all duration-[800ms] ${
          isScrolledDown ? 'bg-[#8A9A86]/25 scale-110' : 'bg-[#8A9A86]/20'
        }`}
        style={{ transformOrigin: 'center' }}
      ></div>
      {/* Blob 2 - Sky Blue (VFX/Vision) */}
      <div 
        className={`absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] animate-float-delayed transition-all duration-[800ms] ${
          isScrolledDown ? 'bg-[#87CEEB]/20 scale-105' : 'bg-[#87CEEB]/15'
        }`}
        style={{ transformOrigin: 'center' }}
      ></div>
      {/* Blob 3 - Warm Gold/Wood (Acoustics/Instruments) */}
      <div 
        className={`absolute bottom-[-10%] left-[25%] w-[40vw] h-[40vw] rounded-full blur-[120px] animate-float-slow transition-all duration-[800ms] ${
          isScrolledDown ? 'bg-[#D4A373]/25 scale-110' : 'bg-[#E0B98F]/15'
        }`}
        style={{ transformOrigin: 'center' }}
      ></div>
 
      {/* 2. Fine Background Design Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02]"></div>
 
      {/* 3. Rolling SVG Sound/Vision Sine Waves (linked to Iyedani) */}
      <div className={`absolute inset-0 flex flex-col justify-center w-full h-full overflow-hidden transition-opacity duration-[800ms] ${
        isScrolledDown ? 'opacity-[0.24]' : 'opacity-[0.12]'
      }`}>
        <svg className="w-full h-48 overflow-visible" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wave 1 - Fast, thinner */}
          <path 
            d="M0 100 Q 180 50, 360 100 T 720 100 T 1080 100 T 1440 100 T 1800 100 T 2160 100 T 2520 100 T 2880 100" 
            stroke="#D4A373" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="animate-wave-slow"
          />
          {/* Wave 2 - Slow, wider, overlapping */}
          <path 
            d="M0 120 Q 200 180, 400 120 T 800 120 T 1200 120 T 1600 120 T 2000 120 T 2400 120 T 2800 120 T 3200 120" 
            stroke="#8A9A86" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="animate-wave-medium"
          />
          {/* Wave 3 - High frequency, subtle */}
          <path 
            d="M0 80 Q 120 40, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 T 1680 80 T 1920 80 T 2160 80 T 2400 80 T 2640 80 T 2880 80" 
            stroke="#87CEEB" 
            strokeWidth="1" 
            strokeDasharray="4,4"
            strokeLinecap="round" 
            className="animate-wave-fast"
          />
        </svg>
      </div>
 
      {/* Additional bottom wave overlay */}
      <div className={`absolute bottom-0 left-0 w-full pointer-events-none transition-opacity duration-[800ms] ${
        isScrolledDown ? 'opacity-[0.16]' : 'opacity-[0.08]'
      }`}>
        <svg className="w-full h-24 block overflow-visible" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 50 C 360 10, 720 90, 1080 30 C 1260 20, 1380 50, 1440 60 L 1440 100 L 0 100 Z" 
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isScrolledDown ? '#D4A373' : '#8A9A86'} style={{ transition: 'stop-color 0.8s ease' }} />
              <stop offset="100%" stopColor={isScrolledDown ? '#1A1C21' : '#2A2D34'} style={{ transition: 'stop-color 0.8s ease' }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
    </div>
  )
}

