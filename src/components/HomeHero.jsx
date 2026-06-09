import React, { useRef, useState, useEffect } from 'react'
import { hamsalekhaWorks } from '../data/hamsalekhaWorks'

export default function HomeHero({ onExploreStudio }) {
  const scrollContainerRef = useRef(null)
  const [activeSong, setActiveSong] = useState(null)
  const [selectedWork, setSelectedWork] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  // 3D Curved Carousel state
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const startX = useRef(0)
  const startAngle = useRef(0)
  const dragThreshold = useRef(false)

  // Listen to resize to keep card dimensions and 3D radius responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const radius = windowWidth < 768 ? 200 : 250

  const handleMouseDown = (e) => {
    setIsDragging(true)
    startX.current = e.clientX
    startAngle.current = rotationAngle
    dragThreshold.current = false
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      // Snap spinner to the nearest 60-degree multiple on exit
      setRotationAngle((prev) => Math.round(prev / 60) * 60)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Snap spinner to the nearest 60-degree multiple on release
    setRotationAngle((prev) => Math.round(prev / 60) * 60)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) {
      dragThreshold.current = true
    }
    // Convert horizontal drag pixel offset into rotation angle degrees
    const sensitivity = 160 / windowWidth // drag across screen spins by ~160 degrees
    const newAngle = startAngle.current + dx * sensitivity * 1.5
    setRotationAngle(newAngle)
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    startX.current = e.touches[0].clientX
    startAngle.current = rotationAngle
    dragThreshold.current = false
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 6) {
      dragThreshold.current = true
    }
    const sensitivity = 160 / windowWidth
    const newAngle = startAngle.current + dx * sensitivity * 1.5
    setRotationAngle(newAngle)
  }

  const scroll = (direction) => {
    setRotationAngle((prev) => {
      const step = 60
      const next = direction === 'left' ? prev + step : prev - step
      return Math.round(next / 60) * 60
    })
  }

  // Calculate the card currently facing the camera (closest to 0 degrees modulo 360)
  const normalizedAngle = ((-rotationAngle % 360) + 360) % 360
  const activeIndex = Math.round(normalizedAngle / 60) % 6
  const activeWork = hamsalekhaWorks[activeIndex]

  // Helper to calculate shortest rotation diff to target index
  const getShortestAngleDiff = (targetIndex) => {
    const targetAngle = -targetIndex * 60
    let diff = (targetAngle - rotationAngle) % 360
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    return diff
  }

  // Handle clicking on a song inside a card (triggers soundwave visualizer in that card)
  const handlePlaySong = (songName) => {
    if (activeSong === songName) {
      setActiveSong(null) // toggle off
    } else {
      setActiveSong(songName)
    }
  }

  return (
    <div className="w-full bg-transparent select-text relative">
      
      {/* ── SECTION 1: HERO VIEW (Background Video + Centered Intro) ── */}
      <section className="relative w-full min-h-[88vh] flex flex-col justify-center items-center px-6 py-12 lg:py-0 overflow-hidden">
        {/* Background YouTube Video Embed */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-black">
          <iframe
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 filter grayscale-[30%]"
            src="https://www.youtube.com/embed/Vz36RkM-rX8?autoplay=1&mute=1&loop=1&playlist=Vz36RkM-rX8&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex="-1"
          ></iframe>
          {/* Subtle shading overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-parchment/35 via-parchment/65 to-parchment z-1" />
          <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 30%, #F5F3E9 95%) z-1" />
        </div>

        {/* Hero Content: Side-by-side flex layout on desktop */}
        <div className="relative z-10 max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 mt-16 px-4">
          {/* Left: Typography Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-charcoal font-semibold tracking-wide leading-tight drop-shadow-sm">
              Dr. Hamsalekha
            </h1>
            <span className="font-body text-sm md:text-base tracking-[0.2em] text-wood-dark font-semibold uppercase block -mt-2">
              Naada Brahma &bull; Composer &bull; Lyricist
            </span>
            <p className="font-body text-charcoal-light text-base md:text-lg leading-relaxed font-light max-w-xl mx-auto lg:mx-0 drop-shadow-sm">
              Revolutionizing the cadence of Kannada cinema. His artistic vision serves as the foundation for the acoustic layout, tracking spaces, and color design of Iyedani Entertainment.
            </p>

            {/* Action button to explore the 3D Studio */}
            <div className="pt-2">
              <button 
                onClick={onExploreStudio}
                className="group relative inline-flex items-center gap-3 bg-charcoal text-parchment hover:bg-wood hover:text-charcoal-dark font-body text-xs tracking-widest px-6 py-3.5 rounded-full transition-all duration-300 font-bold uppercase shadow-sm pointer-events-auto cursor-pointer"
              >
                <span>Explore Studio</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right: Spotify artist player card */}
          <div className="w-full max-w-sm lg:w-[350px] bg-white/10 backdrop-blur-md rounded-3xl border border-charcoal/10 p-2 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-wood/30 animate-fade-in pointer-events-auto">
            <iframe 
              src="https://open.spotify.com/embed/artist/06i5vQeOQ9q1nC4rJj2w0z?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="rounded-2xl shadow-inner"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: GOOGLE LABS SHOWCASE (Tilted Cards with arrows) ── */}
      <section className="relative w-full py-10 px-6 md:px-12 lg:px-16 overflow-visible">
        
        {/* Section Header */}
        <div className="max-w-xl space-y-3 mb-6 animate-text px-2">
          <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase">
            Labs Experiment Showcase
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-charcoal font-bold tracking-wide">
            His Iconic Albums
          </h2>
          <p className="font-body text-sm text-charcoal-light font-light leading-relaxed">
            Click and drag horizontally or use the centered arrow controls below to browse his historic compositions.
          </p>
        </div>

        {/* 3D Curved & Infinite Carousel Container */}
        <div className="carousel-stage select-none pointer-events-auto">
          
          {/* Static holographic spotlight glow & ambient shadow */}
          <div className="carousel-platform-static">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="stage-active-glow" cx="50%" cy="85%" r="45%">
                  <stop offset="0%" stopColor={activeWork ? activeWork.accentColor : '#D4A373'} stopOpacity="0.35" style={{ transition: 'stop-color 0.8s ease' }} />
                  <stop offset="60%" stopColor={activeWork ? activeWork.accentColor : '#D4A373'} stopOpacity="0.08" style={{ transition: 'stop-color 0.8s ease' }} />
                  <stop offset="100%" stopColor="#FAF9F4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="stage-center-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4A373" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FAF9F4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="rgba(42, 45, 52, 0.03)" />
              <circle cx="50" cy="85" r="22" fill="rgba(42, 45, 52, 0.05)" filter="blur(3px)" />
              <circle cx="50" cy="50" r="50" fill="url(#stage-active-glow)" />
              <circle cx="50" cy="50" r="35" fill="url(#stage-center-glow)" />
            </svg>
          </div>

          {/* Central rotating spinner */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="carousel-spinner cursor-grab active:cursor-grabbing"
            style={{ 
              '--transition-time': isDragging ? '0.02s' : '0.8s',
              transform: `rotateX(-5deg) rotateY(${rotationAngle}deg)`
            }}
          >
            {/* Rotating turntable pedestal platter */}
            <div className="carousel-platform-rotating">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="47" stroke="#D4A373" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="45" stroke="rgba(42, 45, 52, 0.15)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="44" stroke="#8A9A86" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.6" />
                <circle cx="50" cy="50" r="38" stroke="rgba(42, 45, 52, 0.1)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="32" stroke="#D4A373" strokeWidth="0.5" strokeDasharray="6,2" opacity="0.7" />
                <circle cx="50" cy="50" r="26" stroke="rgba(42, 45, 52, 0.1)" strokeWidth="0.3" />
                
                {/* 6 Support spokes matching cards at 60 deg intervals */}
                <line x1="80" y1="50" x2="97" y2="50" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                <line x1="65" y1="76" x2="73.5" y2="90.7" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                <line x1="35" y1="76" x2="26.5" y2="90.7" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                <line x1="20" y1="50" x2="3" y2="50" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                <line x1="35" y1="24" x2="26.5" y2="9.3" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                <line x1="65" y1="24" x2="73.5" y2="9.3" stroke="#D4A373" strokeWidth="0.6" opacity="0.8" />
                
                {/* Center spindle cap */}
                <circle cx="50" cy="50" r="12" fill="#FAF9F4" stroke="rgba(42, 45, 52, 0.15)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="7" fill="#2A2D34" stroke="#D4A373" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="2" fill="#FAF9F4" />
              </svg>
            </div>

            {hamsalekhaWorks.map((work, idx) => {
              const isHovered = hoveredCard === work.id
              const cardActiveSong = activeSong && work.songs.includes(activeSong) ? activeSong : null
              const isActive = activeIndex === idx

              // Alternating subtle tilt/height offset for organic depth-of-field
              const localTiltX = idx % 2 === 0 ? 1.5 : -1.5
              const localTranslateY = idx % 2 === 0 ? 8 : -8

              return (
                <div 
                  key={work.id}
                  onMouseEnter={() => setHoveredCard(work.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    if (dragThreshold.current) return
                    if (!isActive) {
                      const diff = getShortestAngleDiff(idx)
                      setRotationAngle(rotationAngle + diff)
                    }
                  }}
                  className={`carousel-card carousel-card-hover p-4 md:p-5 relative rounded-2xl bg-white border transition-all duration-500 ${
                    isActive 
                      ? 'carousel-card-active border-wood/35 scale-[1.01]' 
                      : 'border-charcoal/10 cursor-pointer'
                  }`}
                  style={{
                    '--card-rotate-y': `${idx * 60}deg`,
                    '--card-radius': `${radius}px`,
                    transform: `rotateY(${idx * 60}deg) translateZ(${radius}px) rotateX(${localTiltX}deg) translateY(${localTranslateY}px)`
                  }}
                >
                  {/* Inner Content Wrapper for Opacity fading + depth-of-field blur (avoids 3D flattening bug) */}
                  <div className={`relative w-full h-full flex flex-col justify-between transition-all duration-500 ${
                    isActive 
                      ? 'opacity-100 filter-none scale-100' 
                      : 'opacity-[0.45] blur-[1px] scale-[0.96]'
                  }`}>
                    {/* Subtle Accent Glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${work.colorTheme} opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10`} />
                  
                  {/* Card Header Info */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body text-[10px] tracking-widest text-sage-dark font-bold uppercase">
                      {work.year}
                    </span>
                    <span className="bg-parchment-warm text-charcoal-light font-body text-[9px] tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                      {work.tags[0]}
                    </span>
                  </div>

                  {/* Cover graphic */}
                  <div 
                    className="w-full aspect-[1.55] rounded-xl relative overflow-hidden mb-3 border border-charcoal/5 flex items-center justify-center transition-all duration-300"
                    style={{ background: work.bgGradient }}
                  >
                    {work.id === 'premaloka' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className={`w-28 h-28 text-charcoal/85 transition-transform duration-[6000ms] ease-linear ${isHovered || cardActiveSong ? 'animate-spin' : ''}`} viewBox="0 0 100 100" fill="currentColor">
                          <circle cx="50" cy="50" r="45" />
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#fbcfe8" strokeWidth="0.5" strokeDasharray="3,1" />
                          <circle cx="50" cy="50" r="28" fill="none" stroke="#e9d5ff" strokeWidth="0.5" />
                          <circle cx="50" cy="50" r="16" fill="#ec4899" />
                          <circle cx="50" cy="50" r="4" fill="#fbcfe8" />
                        </svg>
                        <span className={`absolute top-4 left-6 text-pink-500 text-sm transition-transform duration-1000 ${isHovered ? 'scale-125 translate-y-[-4px] animate-bounce' : ''}`}>❤️</span>
                        <span className={`absolute bottom-6 right-8 text-purple-600 text-base transition-transform duration-1000 ${isHovered ? 'scale-110 translate-y-[-2px] animate-pulse' : ''}`}>🎶</span>
                      </div>
                    )}

                    {work.id === 'aakasmika' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-36 h-36 text-orange-600/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 80 Q 30 65, 50 80 T 90 80" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="50" cy="52" r="18" fill="#f59e0b" className={`transition-transform duration-1000 ${isHovered ? 'translate-y-[-6px]' : ''}`} />
                          <path d="M50 20 L50 28 M30 30 L36 34 M70 30 L64 34" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity={isHovered ? 1 : 0.6} />
                          <circle cx="50" cy="80" r="24" stroke="#fed7aa" strokeWidth="1" opacity={isHovered ? 0.8 : 0.4} />
                          <circle cx="50" cy="80" r="32" stroke="#fed7aa" strokeWidth="0.5" opacity={isHovered ? 0.6 : 0.2} />
                        </svg>
                        <span className="absolute bottom-3 text-[10px] font-heading font-semibold text-orange-800 tracking-wider">ಕನ್ನಡ</span>
                      </div>
                    )}

                    {work.id === 'ramachari' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25 45 L75 55" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                          <circle cx="35" cy="47" r="1.5" fill="#bae6fd" />
                          <circle cx="45" cy="49" r="1.5" fill="#bae6fd" />
                          <circle cx="55" cy="51" r="1.5" fill="#bae6fd" />
                          <circle cx="65" cy="53" r="1.5" fill="#bae6fd" />
                          <path d="M20 70 C20 65, 30 65, 35 68 C40 65, 50 65, 50 70 Z" fill="white" opacity="0.8" className={`transition-transform duration-[4000ms] ${isHovered ? 'translate-x-2' : ''}`} />
                          <path d="M55 75 C55 72, 62 72, 66 74 C70 72, 77 72, 77 75 Z" fill="white" opacity="0.8" className={`transition-transform duration-[4000ms] ${isHovered ? '-translate-x-2' : ''}`} />
                          <path d="M78 53 Q83 48, 88 56" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" className={isHovered || cardActiveSong ? 'animate-pulse' : 'hidden'} />
                        </svg>
                      </div>
                    )}

                    {work.id === 'halunda-tavaru' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-36 h-36 text-yellow-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M25 65 C20 50, 25 35, 40 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M75 65 C80 50, 75 35, 60 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="23" cy="53" r="3" fill="currentColor" />
                          <circle cx="26" cy="43" r="3" fill="currentColor" />
                          <circle cx="33" cy="35" r="3" fill="currentColor" />
                          <circle cx="77" cy="53" r="3" fill="currentColor" />
                          <circle cx="74" cy="43" r="3" fill="currentColor" />
                          <circle cx="67" cy="35" r="3" fill="currentColor" />
                          <circle cx="50" cy="52" r="16" fill="currentColor" opacity="0.85" />
                          <circle cx="50" cy="52" r="13" fill="#fde68a" />
                          <path d="M47 48 L53 48 M47 52 L53 52 M47 56 L53 56" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        <span className={`absolute top-4 right-8 text-yellow-500 text-xs transition-transform duration-700 ${isHovered ? 'scale-125 rotate-45' : ''}`}>✨</span>
                        <span className={`absolute bottom-6 left-10 text-yellow-500 text-xs transition-transform duration-700 ${isHovered ? 'scale-125' : ''}`}>✨</span>
                      </div>
                    )}

                    {work.id === 'om' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-36 h-36 text-rose-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="25" y="25" width="50" height="50" rx="6" fill="#fca5a5" opacity="0.5" className={`transition-transform duration-1000 ${isHovered ? 'scale-105 rotate-12' : ''}`} />
                          <path d="M50 25 L50 75" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                          <path d="M38 34 Q50 48, 62 34" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M44 45 L56 45" stroke="#f43f5e" strokeWidth="2" />
                          <circle cx="48" cy="18" r="2" fill="#f43f5e" className={isHovered ? 'animate-bounce' : ''} />
                          <circle cx="53" cy="15" r="1.5" fill="#f43f5e" />
                        </svg>
                      </div>
                    )}

                    {work.id === 'kaurava' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-36 h-36 text-emerald-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="28" fill="#bbf7d0" opacity="0.6" />
                          <path d="M50 15 L50 85" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="50" cy="62" r="14" fill="#10b981" />
                          <path d="M50 62 L50 28" stroke="#047857" strokeWidth="3" />
                          <path d="M48 28 L52 28 M48 34 L52 34" stroke="#047857" strokeWidth="2" />
                          <circle cx="50" cy="62" r="20" stroke="#a7f3d0" strokeWidth="1" className={isHovered || cardActiveSong ? 'animate-ping' : 'hidden'} />
                        </svg>
                      </div>
                    )}

                    {cardActiveSong && (
                      <div className="absolute bottom-2 left-2 right-2 bg-charcoal/80 rounded-lg py-1.5 px-3 flex items-center justify-between backdrop-blur z-20">
                        <span className="font-body text-[9px] text-parchment font-medium truncate max-w-[80%]">
                          Listening: {cardActiveSong}
                        </span>
                        <div className="flex gap-[2px] h-2.5 items-end">
                          {[1, 2, 3, 4].map((i) => (
                            <span key={i} className="w-[2px] bg-wood-light rounded-full animate-bar" style={{ height: '100%', animationDelay: `${i * 0.15}s` }}></span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Title & Description */}
                  <div className="flex-grow flex flex-col justify-start mb-2.5">
                    <h4 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-wide">
                      {work.title}
                    </h4>
                    <p className="font-body text-[11px] md:text-xs text-wood-dark font-medium mb-1.5 leading-snug">
                      {work.tagline}
                    </p>
                    <p className="font-body text-charcoal-light text-[10px] md:text-[11px] leading-relaxed font-light line-clamp-2 md:line-clamp-3">
                      {work.description}
                    </p>
                  </div>

                  {/* Tracks */}
                  <div className="border-t border-charcoal/5 pt-2 mt-auto">
                    <span className="font-body text-[9px] tracking-wider text-sage-dark font-bold uppercase block mb-1">
                      Top Tracks
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {work.songs.map((song) => {
                        const isSongPlaying = activeSong === song
                        return (
                          <button
                            key={song}
                            onClick={() => {
                              if (dragThreshold.current) return
                              handlePlaySong(song)
                            }}
                            className={`font-body text-[10px] px-2 py-1 rounded-md transition-all duration-300 pointer-events-auto cursor-pointer ${
                              isActive ? 'pointer-events-auto' : 'pointer-events-none opacity-40'
                            } ${
                              isSongPlaying 
                                ? 'bg-charcoal text-parchment font-semibold shadow-sm' 
                                : 'bg-parchment-warm text-charcoal-light hover:bg-charcoal/5'
                            }`}
                          >
                            {isSongPlaying ? '⏸' : '▶'} {song}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Explore detail action */}
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-charcoal/5">
                    <div className="flex gap-2">
                      {work.tags.slice(1).map((t) => (
                        <span key={t} className="font-body text-[9px] text-charcoal-light opacity-60">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (dragThreshold.current) return
                        setSelectedWork(work)
                      }}
                      className={`group flex items-center gap-1 font-body text-[10px] tracking-wider text-wood hover:text-wood-dark font-bold uppercase transition-colors duration-300 cursor-pointer ${
                        isActive ? 'pointer-events-auto' : 'pointer-events-none opacity-40'
                      }`}
                    >
                      <span>Detail</span>
                      <span className="transform group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </button>
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Center Arrow Controls (from the screenshot design details) */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-charcoal/10 hover:border-charcoal/30 flex items-center justify-center text-charcoal-light hover:text-charcoal transition-all duration-300 bg-white/60 hover:bg-white backdrop-blur shadow-sm hover:shadow pointer-events-auto cursor-pointer"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-charcoal/10 hover:border-charcoal/30 flex items-center justify-center text-charcoal-light hover:text-charcoal transition-all duration-300 bg-white/60 hover:bg-white backdrop-blur shadow-sm hover:shadow pointer-events-auto cursor-pointer"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── SECTION 3: QUOTE VIEW (Further Scroll Down) ── */}
      <section className="w-full min-h-[35vh] flex flex-col items-center justify-center bg-charcoal/[0.02] border-t border-charcoal/5 px-6 py-10 text-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,45,52,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(42,45,52,0.01)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-8 px-4">
          <span className="font-body text-4xl text-wood opacity-50 block leading-none select-none">“</span>
          
          <h3 className="font-heading text-2xl md:text-4xl lg:text-5xl text-charcoal font-light leading-snug tracking-wide italic max-w-3xl mx-auto">
            "Music is not just sound; it is the Naada—the ultimate expression of our culture, our language, and our land."
          </h3>
          
          <div className="space-y-1 pt-4">
            <span className="font-body text-xs tracking-[0.25em] text-sage font-bold uppercase block">
              — Dr. Hamsalekha
            </span>
            <span className="font-body text-[10px] text-charcoal-light opacity-50 block">
              Naada Brahma of Kannada Film Music
            </span>
          </div>

          <span className="font-body text-4xl text-wood opacity-50 block leading-none select-none">”</span>
        </div>
      </section>

      {/* Side details drawer */}
      {selectedWork && (
        <div className="fixed inset-0 z-[999] flex items-center justify-end bg-charcoal/30 backdrop-blur-sm pointer-events-auto">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedWork(null)}></div>
          
          <div className="relative w-full max-w-lg h-full bg-parchment-light shadow-2xl p-8 overflow-y-auto flex flex-col justify-between border-l border-charcoal/10 animate-slide-in select-text">
            
            <button
              onClick={() => setSelectedWork(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal hover:bg-charcoal/5 pointer-events-auto cursor-pointer"
              aria-label="Close panel"
            >
              &times;
            </button>

            <div className="space-y-6 pt-6">
              <div className="flex gap-3 items-center">
                <span className="font-body text-xs tracking-widest text-sage font-bold uppercase">
                  {selectedWork.year} Release
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-wood"></span>
                <span className="font-body text-xs tracking-wider text-charcoal-light font-medium">
                  {selectedWork.stats.impact}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-4xl md:text-5xl text-charcoal font-bold tracking-wide">
                  {selectedWork.title}
                </h3>
                <p className="font-body text-base text-wood-dark font-semibold italic">
                  "{selectedWork.tagline}"
                </p>
              </div>

              <div 
                className="w-full h-40 rounded-xl border border-charcoal/5 flex items-center justify-center shadow-inner"
                style={{ background: selectedWork.bgGradient }}
              >
                <span className="font-heading text-5xl font-black text-charcoal/10 select-none uppercase tracking-widest">
                  {selectedWork.title}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading text-lg text-charcoal font-bold tracking-wider uppercase border-b border-charcoal/5 pb-1">
                  Album Backstory & Influence
                </h4>
                <p className="font-body text-charcoal-light text-sm leading-relaxed font-light">
                  {selectedWork.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading text-lg text-charcoal font-bold tracking-wider uppercase border-b border-charcoal/5 pb-1">
                  Iconic Tracks ({selectedWork.stats.tracks} Total Tracks)
                </h4>
                <ul className="space-y-2">
                  {selectedWork.songs.map((song, i) => (
                    <li key={song} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-charcoal/5 font-body text-xs text-charcoal-light hover:border-wood/30 hover:bg-parchment-warm/20 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <span className="text-wood font-semibold">{String(i + 1).padStart(2, '0')}</span>
                        <span>{song}</span>
                      </div>
                      <button 
                        onClick={() => handlePlaySong(song)}
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase transition-all duration-300 pointer-events-auto cursor-pointer ${
                          activeSong === song 
                            ? 'bg-charcoal text-parchment' 
                            : 'bg-parchment-warm text-charcoal-light hover:bg-charcoal/5'
                        }`}
                      >
                        {activeSong === song ? 'Stop Wave' : 'Play Wave'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-charcoal/10 flex gap-4">
              <button
                onClick={() => setSelectedWork(null)}
                className="flex-1 border border-charcoal/20 hover:border-charcoal text-charcoal font-body text-xs tracking-widest py-3 rounded-full uppercase font-bold transition-all duration-300 pointer-events-auto cursor-pointer text-center"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  setSelectedWork(null)
                  onExploreStudio()
                }}
                className="flex-1 bg-charcoal hover:bg-wood text-parchment hover:text-charcoal-dark font-body text-xs tracking-widest py-3 rounded-full uppercase font-bold transition-all duration-300 pointer-events-auto cursor-pointer text-center"
              >
                Explore Studio
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
