import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InteractiveCanvas from './InteractiveCanvas'
import { services } from '../data/services'
import FAQSection from './FAQSection'

gsap.registerPlugin(ScrollTrigger)

export default function DOMOverlay({ catalogServices = [] }) {
  const containerRef = useRef(null)
  const [expandedItem, setExpandedItem] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => console.log('Audio playback error:', err))
    }
    setIsPlaying(!isPlaying)
  }

  // Pause BGM on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const portfolioItems = [
    {
      title: 'Brand Identity',
      category: 'Identity',
      image: '/brand_identity.png'
    },
    {
      title: 'Graphic Design',
      category: 'Publishing & Design',
      image: '/graphic_design.png'
    },
    {
      title: 'Explainer Videos',
      category: 'Animation',
      image: '/explainer_videos.png'
    },
    {
      title: '3D Architecture',
      category: 'Spatial Design',
      image: '/3d_architecture.png'
    },
    {
      title: 'TV Commercials',
      category: 'Cinema Ad Production',
      image: '/tv_commercials.png'
    },
    {
      title: 'Websites design',
      category: 'UI/UX Interface',
      image: '/websites_design.jpg'
    },
    {
      title: '3D Model Animation',
      category: 'Assets Creation',
      image: '/3d_models.jpg'
    },
    {
      title: 'Motion capture',
      category: 'VFX / Tracking',
      image: '/motion_capture.jpg'
    }
  ]

  // Handle scroll lock and Esc key close for lightbox
  useEffect(() => {
    if (expandedItem) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setExpandedItem(null)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [expandedItem])

  useEffect(() => {
    if (!containerRef.current) return

    // Allow a tiny layout settle time before initializing GSAP
    const timer = setTimeout(() => {
      const sections = containerRef.current.querySelectorAll('section')
      
      sections.forEach((section) => {
        const textElements = section.querySelectorAll('.animate-text')
        const imageContainer = section.querySelectorAll('.animate-image')

        if (textElements.length > 0) {
          gsap.fromTo(textElements, 
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }

        if (imageContainer.length > 0) {
          gsap.fromTo(imageContainer,
            { opacity: 0, scale: 0.97 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      })
      
      ScrollTrigger.refresh()
    }, 80)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative z-10 w-full min-h-screen overflow-x-hidden bg-parchment pt-16">
      
      {/* Background Audio Player */}
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
      />

      {/* Left Decorative Sidebar - Technical Telemetry */}
      <div className="hidden xl:flex fixed left-8 top-24 bottom-24 w-10 flex-col justify-between items-center text-sage-dark/45 font-mono text-[9px] select-none pointer-events-none z-0 tracking-widest animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <span className="w-[1px] h-12 bg-sage/20"></span>
          <span className="[writing-mode:vertical-lr] uppercase whitespace-nowrap opacity-60">Iydani Studio Suite v2.6</span>
        </div>
        <div className="flex flex-col items-center gap-4 text-center my-6">
          <div className="hover:text-wood transition-colors duration-300">LAT: 12.9716° N</div>
          <div className="hover:text-wood transition-colors duration-300">LON: 77.5946° E</div>
          
          {/* Interactive BGM Player (linked with music) */}
          <div className="flex flex-col items-center gap-2 my-2 pointer-events-auto">
            <button 
              onClick={togglePlayback}
              className={`w-8 h-8 rounded-full border ${isPlaying ? 'border-wood text-wood animate-[spin_8s_linear_infinite]' : 'border-sage/30 text-sage hover:border-wood hover:text-wood'} bg-parchment-light flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-xs relative group`}
              aria-label={isPlaying ? 'Pause ambient track' : 'Play ambient track'}
              title="Studio Ambient Music"
            >
              {isPlaying ? (
                /* Vinyl / Record Icon when playing */
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                </svg>
              ) : (
                /* Play Icon when paused */
                <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
              
              {/* Tooltip */}
              <span className="absolute left-10 scale-0 group-hover:scale-100 transition-transform duration-200 bg-charcoal text-[#FAF9F4] text-[8px] py-1 px-2 rounded whitespace-nowrap shadow-md z-50 tracking-wider [writing-mode:horizontal-tb]">
                {isPlaying ? 'PAUSE BGM' : 'PLAY BGM'}
              </span>
            </button>
            
            {/* Miniature Audio Visualizer */}
            <div className="flex gap-0.5 h-3.5 items-end">
              <span className={`w-0.5 h-3 bg-wood origin-bottom ${isPlaying ? 'animate-bar' : 'scale-y-[0.25]'}`}></span>
              <span className={`w-0.5 h-3 bg-wood origin-bottom ${isPlaying ? 'animate-bar' : 'scale-y-[0.25]'}`} style={{ animationDelay: '0.2s' }}></span>
              <span className={`w-0.5 h-3 bg-wood origin-bottom ${isPlaying ? 'animate-bar' : 'scale-y-[0.25]'}`} style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>

          <div>SYS: NOMINAL</div>
          <div>192KHZ / 32BIT</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="[writing-mode:vertical-lr] uppercase whitespace-nowrap opacity-60">Acoustic Signal Path</span>
          <span className="w-[1px] h-12 bg-sage/20"></span>
        </div>
      </div>

      {/* Right Decorative Sidebar - Console Channel Strip & dB Scale */}
      <div className="hidden xl:flex fixed right-8 top-24 bottom-24 w-10 flex-col justify-between items-center text-sage-dark/45 font-mono text-[9px] select-none pointer-events-none z-0 tracking-wider animate-fade-in">
        {/* dB Ticks & Scale */}
        <div className="flex flex-col items-end w-full gap-2 pr-1">
          <span className="w-full h-[1px] bg-sage/20 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1">+24 dB</span>
          </span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-full h-[1px] bg-sage/20 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1">+12 dB</span>
          </span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-full h-[1px] bg-sage/25 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1 text-wood font-bold">0 dB</span>
          </span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-full h-[1px] bg-sage/20 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1">-12 dB</span>
          </span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-full h-[1px] bg-sage/20 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1">-24 dB</span>
          </span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-2/3 h-[1px] bg-sage/10"></span>
          <span className="w-full h-[1px] bg-sage/20 relative">
            <span className="absolute right-0 -top-1.5 font-mono text-[7px] pr-1">-48 dB</span>
          </span>
        </div>

        {/* Decorative LED Level Meter */}
        <div className="flex flex-col items-center gap-1.5 h-1/4 justify-end my-4">
          <span className="text-[6.5px] text-sage/40 uppercase tracking-widest font-bold font-body">Meter</span>
          <div className="flex gap-1 h-24 items-end bg-charcoal/5 border border-charcoal/5 p-1 rounded-sm">
            {/* Channel L */}
            <div className="w-1 h-full flex flex-col-reverse gap-[2px]">
              <span className="w-full h-1 bg-sage rounded-xs opacity-60"></span>
              <span className="w-full h-2 bg-sage rounded-xs opacity-60"></span>
              <span className="w-full h-2.5 bg-sage rounded-xs opacity-60 animate-[pulse_1.2s_infinite]"></span>
              <span className="w-full h-3 bg-wood rounded-xs opacity-75"></span>
              <span className="w-full h-3 bg-wood rounded-xs opacity-75 animate-[pulse_0.8s_infinite]"></span>
              <span className="w-full h-4 bg-[#d9534f] rounded-xs opacity-40"></span>
            </div>
            {/* Channel R */}
            <div className="w-1 h-full flex flex-col-reverse gap-[2px]">
              <span className="w-full h-1 bg-sage rounded-xs opacity-60"></span>
              <span className="w-full h-2 bg-sage rounded-xs opacity-60 animate-[pulse_0.9s_infinite]"></span>
              <span className="w-full h-2.5 bg-sage rounded-xs opacity-60"></span>
              <span className="w-full h-3 bg-wood rounded-xs opacity-75 animate-[pulse_1.5s_infinite]"></span>
              <span className="w-full h-3 bg-wood rounded-xs opacity-75"></span>
              <span className="w-full h-2.5 bg-[#d9534f] rounded-xs opacity-20"></span>
            </div>
          </div>
          <span className="text-[6.5px] text-wood uppercase tracking-widest font-bold font-body">Sig</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="[writing-mode:vertical-lr] uppercase whitespace-nowrap opacity-60">Mixing Console L-R</span>
          <span className="w-[1px] h-12 bg-sage/20"></span>
        </div>
      </div>

      {/* Decorative Vertical Grid Frame Lines */}
      <div className="hidden xl:block fixed left-24 top-0 bottom-0 w-[1px] bg-charcoal/5 z-0 pointer-events-none"></div>
      <div className="hidden xl:block fixed right-24 top-0 bottom-0 w-[1px] bg-charcoal/5 z-0 pointer-events-none"></div>

      {/* Main Sections */}
      <main className="w-full">
        {catalogServices.map((service) => {
          const isLeft = service.imageAlign === 'left'
          return (
            <section
              key={service.id}
              id={service.id}
              aria-labelledby={`title-${service.id}`}
              className="w-full flex items-center justify-center px-6 md:px-16 py-2 md:py-3 relative select-text"
            >
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-center">
                
                {/* Visual Typography Display Card (Opposite Column) */}
                <div 
                  className={`animate-image w-full aspect-[16/10] rounded-2xl bg-[#EDE8D8]/20 border border-charcoal/10 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group pointer-events-auto transition-all duration-500 hover:scale-[1.01] ${
                    isLeft ? 'order-1' : 'order-1 md:order-2'
                  }`}
                >
                  {service.image ? (
                    <>
                      {/* Real Image Background */}
                      <img 
                        src={service.image} 
                        alt={`${service.title} - ${service.description.substring(0, 80)} at Iydani Entertainment studio, Bengaluru`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark overlay to ensure typography contrast */}
                      <div className="absolute inset-0 bg-charcoal/20 transition-opacity duration-500 group-hover:bg-charcoal/35 z-0" />
                    </>
                  ) : (
                    <>
                      {/* Fine design grid */}
                      <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>
                    </>
                  )}
                  
                  {/* Subtle wood-accent border */}
                  <div className="absolute inset-2 border border-wood/20 rounded-xl pointer-events-none z-10"></div>
                  
                  {/* Large Graphic Typography (only if no image is present) */}
                  {!service.image && (
                    <>
                      <span className="font-heading text-[10rem] md:text-[13rem] font-light leading-none select-none tracking-tighter z-10 transition-colors duration-350 text-charcoal/5">
                        {service.cardLabel}
                      </span>
                      <span className="font-body text-[10px] tracking-[0.3em] font-bold uppercase select-none -mt-4 z-10 transition-colors duration-350 text-sage">
                        {service.cardSublabel}
                      </span>
                    </>
                  )}
                  
                  {!service.image && (
                    <div className="absolute bottom-6 left-6 font-heading text-base italic tracking-wider pointer-events-none z-10 transition-colors duration-350 text-charcoal/30">
                      Iydani Catalog
                    </div>
                  )}
                </div>

                {/* Text Description Container (with Embedded 3D Asset beside features) */}
                <div 
                  className={`flex flex-col space-y-1 md:space-y-1.5 pointer-events-auto ${
                    isLeft ? 'order-2' : 'order-2 md:order-1'
                  }`}
                >
                  {/* Service Label */}
                  <span className="animate-text font-body text-xs tracking-widest text-sage uppercase font-bold">
                    {service.num}
                  </span>
                  
                  {/* Service Title */}
                  <h2 
                    id={`title-${service.id}`}
                    className="animate-text font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal tracking-wide leading-tight"
                  >
                    {service.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="animate-text font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light">
                    {service.description}
                  </p>
                  
                  {/* Features & 3D Asset Row */}
                  <div className="flex flex-row items-center justify-start gap-4 pt-0">
                    {/* Bullet points & Know More container */}
                    <div className="flex flex-col items-start gap-2 flex-none">
                      {/* Feature Bullets */}
                      <ul className="animate-text space-y-1 flex-none">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center space-x-2 font-body text-xs md:text-sm text-charcoal-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-wood"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Know More Link */}
                      <a 
                        href={`#/details/${service.id}`}
                        className="animate-text group flex items-center gap-1.5 font-body text-xs tracking-widest text-wood hover:text-wood-dark uppercase font-semibold transition-colors duration-300 pointer-events-auto cursor-pointer"
                      >
                        <span>Know More</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                      </a>
                    </div>

                    {/* Clean Floating 3D Asset (Beside text, no surrounding box) */}
                    <div className="animate-text w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative group pointer-events-auto">
                      <div className="absolute inset-0 z-0">
                        <InteractiveCanvas 
                          cameraPos={service.cameraPos} 
                          modelPos={service.modelPos}
                        >
                          {service.model}
                        </InteractiveCanvas>
                      </div>

                      {/* Hint indicator (visible on hover) */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-body text-[8px] tracking-widest text-sage-dark uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Drag to rotate &bull;
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )
        })}

        {/* ── SECTION 5: OUR WORK GALLERY ── */}
        <section className="w-full py-4 px-6 md:px-16 bg-parchment-light border-t border-charcoal/5 relative select-text">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Section Header */}
            <div className="max-w-xl space-y-1">
              <span className="animate-text font-body text-xs tracking-widest text-sage uppercase font-bold block">
                Portfolio
              </span>
              <h2 className="animate-text font-heading text-3xl md:text-4xl text-charcoal tracking-wide leading-tight font-bold">
                Our Work
              </h2>
              <p className="animate-text font-body text-charcoal-light text-xs md:text-sm font-light leading-relaxed">
                Explore our diverse range of creative media projects, from premium brand identities and architecture to cinematic commercials and design prototypes.
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {portfolioItems.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setExpandedItem(item)}
                  className="animate-image group relative aspect-[16/10] rounded-2xl overflow-hidden border border-charcoal/10 bg-[#EDE8D8]/20 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-md pointer-events-auto cursor-pointer"
                >
                  <img 
                    src={item.image} 
                    alt={`${item.title} - ${item.category} project by Iydani Entertainment, Bengaluru`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500 z-10" />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="font-body text-[9px] tracking-widest text-wood font-bold uppercase block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="font-heading text-base md:text-lg text-[#FAF9F4] font-semibold leading-tight tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── SECTION 6: STUDIO LOCATION ── */}
        <section className="w-full py-4 px-6 md:px-16 bg-parchment border-t border-charcoal/5 relative select-text">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* Left: Location Text Details */}
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="animate-text font-body text-xs tracking-widest text-sage uppercase font-bold block">
                  Find Us
                </span>
                <h2 className="animate-text font-heading text-3xl md:text-4xl text-charcoal tracking-wide leading-tight font-bold">
                  Our Location
                </h2>
              </div>
              
              <div className="animate-text space-y-1.5 font-body text-charcoal-light text-sm md:text-base leading-relaxed font-light">
                <p className="font-heading text-xl md:text-2xl text-charcoal tracking-wide font-semibold">
                  Iydani Entertainment
                </p>
                <div className="flex items-start space-x-3 text-xs md:text-sm">
                  {/* Pin Icon */}
                  <svg className="w-5 h-5 text-wood mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="leading-relaxed">
                    LIG 3rd Stage, Udaya Layout,<br />
                    Yelahanka New Town, Bengaluru,<br />
                    Karnataka 560064<br />
                    Hamsalekha Music School
                  </span>
                </div>
              </div>

              <div className="animate-text pt-1">
                <a 
                  href="https://maps.google.com/?q=Hamsalekha+Music+School+LIG+3rd+Stage+Udaya+Layout+Yelahanka+New+Town+Bengaluru+Karnataka+560064"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-wood hover:bg-wood-dark text-[#FAF9F4] font-body text-xs tracking-widest uppercase font-semibold rounded-lg transition-all duration-300 pointer-events-auto cursor-pointer shadow-sm hover:shadow-md hover:translate-y-[-1px]"
                >
                  <span>Open in Google Maps</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </a>
              </div>
            </div>

            {/* Right: Premium Map/Visual Card */}
            <div className="animate-image w-full aspect-[16/10] rounded-2xl bg-[#EDE8D8]/20 border border-charcoal/10 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group pointer-events-auto transition-all duration-500 hover:scale-[1.01]">
              {/* Fine design grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>
              
              {/* Subtle wood-accent border */}
              <div className="absolute inset-2 border border-wood/20 rounded-xl pointer-events-none z-10"></div>
              
              {/* Abstract Map graphic styling */}
              <div className="absolute inset-3 rounded-lg overflow-hidden bg-parchment-light border border-charcoal/5 flex flex-col items-center justify-center p-2.5 text-center space-y-2">
                {/* Stylized visual map pin */}
                <div className="w-8 h-8 rounded-full bg-wood/10 flex items-center justify-center text-wood animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-charcoal font-semibold">Bengaluru Head Office</h3>
                <p className="font-body text-xs text-charcoal-light max-w-xs leading-relaxed">
                  Located at Hamsalekha Music School in Yelahanka New Town, our production studio is optimized for professional acoustic capture and premium visuals.
                </p>
                <div className="text-[10px] tracking-wider text-sage uppercase font-bold font-body">
                  Visitor hours by appointment only
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 7: FREQUENTLY ASKED QUESTIONS ── */}
        <FAQSection />
      </main>

      {/* Footer Info */}
      <footer className="w-full py-6 px-6 md:px-16 border-t border-sage-light/10 bg-parchment-light pointer-events-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-heading text-lg text-charcoal tracking-wider">IYDANI ENTERTAINMENT</p>
            <address className="not-italic font-body text-[10px] text-charcoal-light mt-1 leading-relaxed">
              <span itemProp="name">Iydani Entertainment</span> &middot;
              <span itemProp="address"> LIG 3rd Stage, Udaya Layout, Yelahanka New Town, Bengaluru, Karnataka 560064, Hamsalekha Music School</span><br />
              <a href="tel:+917411544427" itemProp="telephone" className="hover:text-wood transition-colors">+91 74115 44427</a> &middot;
              <a href="mailto:iydanientertainment@gmail.com" itemProp="email" className="hover:text-wood transition-colors">iydanientertainment@gmail.com</a>
            </address>
            <p className="font-body text-[10px] text-charcoal-light mt-1">&copy; 2026 Iydani Entertainment. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
          {/* Navigation Links */}
          <div className="flex space-x-4">
            <a href="#/privacy" className="font-body text-xs tracking-widest text-sage uppercase hover:text-wood transition-colors font-semibold">Privacy Policy</a>
            <a href="#/about" className="font-body text-xs tracking-widest text-sage uppercase hover:text-wood transition-colors font-semibold">About Us</a>
            <a href="#/contact" className="font-body text-xs tracking-widest text-sage uppercase hover:text-wood transition-colors font-semibold">Contact</a>
          </div>
          
          {/* Follow Us Header */}
          <span className="font-body text-[10px] tracking-[0.25em] text-sage font-bold uppercase block -mb-2">
            Connect With Us
          </span>

          {/* Social Icons (Larger, Brand Colorized on Hover) */}
          <div className="flex space-x-2">
            {/* LinkedIn */}
            <a 
              href="https://in.linkedin.com/company/iydani-entertainment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] hover:scale-110 hover:shadow-md transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/iydanientertainment/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:via-[#6228d7] hover:text-white hover:border-transparent hover:scale-110 hover:shadow-md transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a 
              href="https://wa.me/9107411544427" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:scale-110 hover:shadow-md transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 2.012 14.12 1.01 11.5 1.012c-5.442 0-9.866 4.372-9.87 9.802 0 1.672.452 3.302 1.31 4.739L1.9 20.661l5.228-1.371c.002.001.002.001.003-.001.003-.002.004-.002.006-.003zM18 14.341c-.328-.164-1.944-.959-2.244-1.068-.3-.11-.518-.164-.737.164-.219.329-.848 1.068-1.039 1.287-.19.219-.382.246-.71.082-.328-.164-1.386-.511-2.641-1.631-.977-.872-1.637-1.949-1.828-2.278-.19-.328-.02-.507.144-.671.148-.147.328-.382.493-.574.164-.19.219-.328.328-.548.11-.219.055-.411-.027-.575-.082-.164-.737-1.777-1.011-2.435-.267-.641-.539-.553-.737-.563-.19-.01-.41-.01-.629-.01-.219 0-.575.082-.876.411-.3.329-1.148 1.122-1.148 2.735 0 1.614 1.176 3.179 1.34 3.398.164.219 2.315 3.535 5.607 4.954.783.338 1.396.54 1.874.693.788.25 1.505.215 2.072.13.632-.094 1.944-.795 2.217-1.56.274-.766.274-1.423.192-1.56-.082-.137-.3-.219-.629-.383z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@Iydani_Entertainment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:scale-110 hover:shadow-md transition-all duration-300 pointer-events-auto cursor-pointer"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

      {/* Lightbox / Expanded Image Modal */}
      {expandedItem && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md transition-all duration-300 pointer-events-auto cursor-zoom-out"
          onClick={() => setExpandedItem(null)}
        >
          {/* Modal Card wrapper */}
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center bg-[#1A1C21]/60 rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-charcoal/80 text-parchment hover:bg-wood hover:text-white transition-all duration-300 shadow-md cursor-pointer border border-white/5"
              onClick={() => setExpandedItem(null)}
              aria-label="Close image showcase"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Exp Image Frame */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
              <img 
                src={expandedItem.image} 
                alt={`${expandedItem.title} - ${expandedItem.category} portfolio work by Iydani Entertainment, Bengaluru recording studio and creative production house`} 
                className="max-w-full max-h-[76vh] object-contain rounded-lg shadow-inner select-none transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>

            {/* Caption Text Footer */}
            <div className="w-full pt-4 pb-2 px-6 flex flex-col items-start gap-1">
              <span className="font-body text-[10px] tracking-[0.25em] text-wood font-bold uppercase">
                {expandedItem.category}
              </span>
              <h3 className="font-heading text-xl md:text-2xl text-[#FAF9F4] font-semibold tracking-wide">
                {expandedItem.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
