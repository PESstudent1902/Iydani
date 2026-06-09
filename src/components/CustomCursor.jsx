import React, { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const noteElements = useRef([])
  const [hoverType, setHoverType] = useState('none') // 'none' | 'link' | 'canvas'

  useEffect(() => {
    const dot = dotRef.current
    const label = labelRef.current
    const noteEls = noteElements.current
    if (!dot || !label || noteEls.length < 6) return

    let mouseX = 0
    let mouseY = 0
    let lastMouseX = 0
    let lastMouseY = 0
    let smoothVx = 0
    let smoothVy = 0
    let smoothSpeed = 0
    let labelX = 0
    let labelY = 0
    let lastSpawnTime = 0
    let spawnCount = 0
    let lastScrollY = window.scrollY
    let spinAngle = 0
    let clickScale = 1.0

    // Pre-allocated pool of 6 floating note particles (bypasses React engine for performance)
    const notesPool = Array.from({ length: 6 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: -0.8, // Toned down drift speed (was -1.2)
      isBurst: false,
      opacity: 0,
      symbol: '♪',
      size: 11, // Slightly smaller symbols (was 12)
      phase: 0,
      swaySpeed: 0.04, // Slower sway (was 0.05)
      swayWidth: 2, // Less horizontal sway (was 3)
      fadeRate: 0.015,
      color: '#D4A373'
    }))

    const symbols = ['♪', '♫', '♩', '♬', '♭', '♯']
    const hoverRef = { current: 'none' }

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      
      // Fade in the cursor elements on first movement
      dot.style.opacity = '1'
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (!target) return

      if (target.closest('.group') && (target.closest('.w-32') || target.closest('.w-36'))) {
        hoverRef.current = 'canvas'
        setHoverType('canvas')
      } else if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer')
      ) {
        hoverRef.current = 'link'
        setHoverType('link')
      } else {
        hoverRef.current = 'none'
        setHoverType('none')
      }
    }

    // Beat Drop Click: Trigger subtle scale compression (80% instead of 55%) and throw gentle radial particles
    const handleMouseDown = () => {
      clickScale = 0.80 // Toned down shrink (was 0.55)

      // Spawn 3 radial notes in different directions (Toned down velocities)
      const burstAngles = [
        { vx: -0.8, vy: -0.7 }, // up-left (was -1.5, -1.2)
        { vx: 0.8, vy: -0.7 },  // up-right (was 1.5, -1.2)
        { vx: 0.0, vy: -1.2 }   // straight up (was 0.0, -2.2)
      ]

      burstAngles.forEach((angle, idx) => {
        const freeNoteIdx = notesPool.findIndex(n => !n.active)
        if (freeNoteIdx !== -1) {
          const rNote = notesPool[freeNoteIdx]
          rNote.active = true
          rNote.isBurst = true
          rNote.x = mouseX
          rNote.y = mouseY - 2
          rNote.vx = angle.vx
          rNote.vy = angle.vy
          rNote.opacity = 1.0
          rNote.symbol = symbols[(spawnCount + idx) % symbols.length]
          rNote.size = Math.floor(Math.random() * 4) + 12
          rNote.color = Math.random() > 0.4 ? '#D4A373' : '#8A9A86'

          const el = noteEls[freeNoteIdx]
          if (el) {
            el.textContent = rNote.symbol
            el.style.fontSize = `${rNote.size}px`
            el.style.color = rNote.color
          }
        }
      })
      spawnCount += 3
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)

    let animId
    const updatePhysics = () => {
      // 1. Mouse Velocity & Speed
      const vx = mouseX - lastMouseX
      const vy = mouseY - lastMouseY
      const instSpeed = Math.sqrt(vx * vx + vy * vy)
      
      smoothVx += (vx - smoothVx) * 0.12
      smoothVy += (vy - smoothVy) * 0.12
      smoothSpeed += (instSpeed - smoothSpeed) * 0.1

      lastMouseX = mouseX
      lastMouseY = mouseY

      // 2. Scroll Velocity (Turntable spin angle tracker)
      const currentScrollY = window.scrollY
      const scrollDiff = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      // Toned down scroll spin accumulation (0.2 instead of 0.85)
      // Clamped scroll diff per frame to prevent aggressive spinning
      const clampedScrollDiff = Math.max(-15, Math.min(15, scrollDiff))
      spinAngle += clampedScrollDiff * 0.22
      
      // Snappier decay back to 0 (0.85 instead of 0.88)
      spinAngle *= 0.84

      // 3. Click Beat Drop Scale Decay
      clickScale += (1.0 - clickScale) * 0.15

      // 4. Transform calculations (Toned down tilt: 0.4 instead of 0.85, clamped to 12deg instead of 25deg)
      const tilt = -smoothVx * 0.4
      const clampedTilt = Math.max(-12, Math.min(12, tilt))
      const totalRotation = clampedTilt + spinAngle

      // Toned down squash and stretch (scale changes reduced by 60%)
      const scaleY = (1.0 + Math.min(0.08, smoothSpeed * 0.002)) * clickScale
      const scaleX = (1.0 - Math.min(0.05, smoothSpeed * 0.0012)) * clickScale

      // Apply coordinates, turntable spin, movement tilt, and scale stretch to DOM
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotate(${totalRotation}deg) scale(${scaleX}, ${scaleY})`

      // Floating label physics (smooth lag trail)
      labelX += (mouseX - labelX) * 0.18
      labelY += (mouseY - labelY) * 0.18
      label.style.transform = `translate3d(${labelX}px, ${labelY}px, 0)`

      const now = Date.now()

      // Spawn notes on fast movement OR scrolling OR on link hover (Toned down spawn rates & limits)
      const isMovingFast = smoothSpeed > 8.0 // Toned down (was 5.5)
      const isScrolling = Math.abs(scrollDiff) > 6.0 // Toned down (was 3.0)
      const isHoveringLink = hoverRef.current === 'link'

      // Hover spawn every 250ms (was 180), movement/scroll every 160ms (was 100)
      if ((isHoveringLink && now - lastSpawnTime > 250) || 
          ((isMovingFast || isScrolling) && now - lastSpawnTime > 160)) {
        const freeNoteIdx = notesPool.findIndex(n => !n.active)
        if (freeNoteIdx !== -1) {
          const rNote = notesPool[freeNoteIdx]
          rNote.active = true
          rNote.isBurst = false
          rNote.x = mouseX + (Math.random() * 10 - 5)
          rNote.y = mouseY + 12
          rNote.vx = 0
          rNote.vy = -0.8
          rNote.opacity = isHoveringLink ? 0.9 : isScrolling ? 0.5 : 0.4 // Toned down opacity
          rNote.symbol = symbols[spawnCount % symbols.length]
          rNote.size = Math.floor(Math.random() * 5) + 11
          rNote.phase = Math.random() * Math.PI * 2
          rNote.swaySpeed = Math.random() * 0.05 + 0.02
          rNote.swayWidth = Math.random() * 3 + 1
          rNote.fadeRate = isHoveringLink ? 0.012 : 0.022
          rNote.color = isHoveringLink ? '#D4A373' : '#8A9A86'

          const el = noteEls[freeNoteIdx]
          if (el) {
            el.textContent = rNote.symbol
            el.style.fontSize = `${rNote.size}px`
            el.style.color = rNote.color
          }

          spawnCount++
          lastSpawnTime = now
        }
      }

      // Animate and update active note particles
      notesPool.forEach((n, idx) => {
        if (!n.active) return

        if (n.isBurst) {
          n.x += n.vx
          n.y += n.vy
          n.opacity -= 0.035 // Toned down burst duration (fades faster)
        } else {
          n.y -= 0.8 // Toned down float speed (was 1.2)
          n.phase += n.swaySpeed
          n.x += Math.sin(n.phase) * 0.25 // Less sway width (was 0.4)
          n.opacity -= n.fadeRate
        }

        if (n.opacity <= 0) {
          n.active = false
          n.opacity = 0
          n.isBurst = false
        }

        const el = noteEls[idx]
        if (el) {
          el.style.transform = `translate3d(${n.x}px, ${n.y}px, 0)`
          el.style.opacity = n.opacity
        }
      })

      animId = requestAnimationFrame(updatePhysics)
    }

    animId = requestAnimationFrame(updatePhysics)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      cancelAnimationFrame(animId)
    }
  }, [])

  const [isTouchOnly, setIsTouchOnly] = useState(false)
  useEffect(() => {
    const checkDevice = () => {
      setIsTouchOnly(!window.matchMedia('(any-pointer: fine)').matches)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (isTouchOnly) return null

  // Bind color styling to active hover state for pointers
  const pointerColor = hoverType === 'link' ? '#D4A373' : hoverType === 'canvas' ? '#8A9A86' : '#2A2D34'

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000000]">
      {/* Musical Note Pointer (1:1 instant follower, zero delay) */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{ color: pointerColor, transformOrigin: '0px 0px' }}
      >
        {/* Hotspot sits exactly in the center of the note (width=22, height=26 -> x=11, y=13) */}
        <div className="-translate-x-[11px] -translate-y-[13px]">
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none" className="transition-colors duration-300">
            {/* Note Head */}
            <ellipse cx="5" cy="18" rx="5" ry="3.5" transform="rotate(-20 5 18)" fill="currentColor" />
            {/* Stem */}
            <rect x="9" y="1" width="2" height="17" fill="currentColor" />
            {/* Flag */}
            <path d="M11 1C13.5 1 18 3.5 18 8.5C18 11 16 12 14.5 12C13.5 12 11 10 11 8.5V1Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Floating interactive helper text tag */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 pointer-events-none"
      >
        <div
          className={`-translate-x-1/2 translate-y-7 px-2 py-0.5 rounded text-[8px] tracking-widest uppercase font-bold transition-all duration-300 ${
            hoverType === 'canvas'
              ? 'opacity-100 scale-100 bg-charcoal text-parchment'
              : hoverType === 'link'
              ? 'opacity-100 scale-100 bg-wood text-parchment'
              : 'opacity-0 scale-75'
          }`}
        >
          {hoverType === 'canvas' ? 'Drag' : hoverType === 'link' ? 'View' : ''}
        </div>
      </div>

      {/* Floating Notes particles pool */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          ref={(el) => (noteElements.current[idx] = el)}
          className="absolute left-0 top-0 pointer-events-none font-body font-bold select-none opacity-0"
          style={{ transform: 'translate3d(0px, 0px, 0)' }}
        />
      ))}
    </div>
  )
}
