import React, { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'

export default function ServiceDetail({ service, onClose }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Lock body scroll just in case
    document.body.style.overflow = 'hidden'

    // Animate overlay entrance
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    )

    // Animate content sliding up
    gsap.fromTo(contentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'power3.out' }
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [service])

  const handleBackClick = (e) => {
    e.preventDefault()
    // Animate exit before closing
    gsap.to(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose
        })
      }
    })
  }

  if (!service) return null

  const hasGalleryImages = service.imagePlaceholders && service.imagePlaceholders.slice(1).some(p => p.image)
  const hasRightColumn = hasGalleryImages || service.video

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-parchment select-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      {/* Service-specific JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "description": service.longDescription1,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Iydani Entertainment",
          "@id": "https://www.iydani.com/#business"
        },
        "areaServed": {
          "@type": "City",
          "name": "Bengaluru"
        },
        "url": `https://www.iydani.com/#/details/${service.id}`
      }) }} />
      <div 
        ref={contentRef}
        className="min-h-screen w-full flex flex-col justify-between"
      >
        {/* Header */}
        <header className="w-full px-8 md:px-24 py-8 flex justify-between items-center border-b border-charcoal/5">
          <a 
            href="#" 
            onClick={handleBackClick}
            className="font-heading text-xl md:text-2xl tracking-widest text-charcoal font-semibold hover:text-sage transition-colors duration-300"
          >
            IYDANI ENTERTAINMENT
          </a>
          
          <a
            href="#"
            onClick={handleBackClick}
            className="group flex items-center gap-2 font-body text-xs tracking-widest text-sage hover:text-wood uppercase font-semibold transition-colors duration-300 pointer-events-auto"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
            <span>Back to Experience</span>
          </a>
        </header>

        {/* Content Section */}
        <main className="w-full max-w-4xl mx-auto px-6 md:px-16 py-10 flex-grow">
          {/* Service Title Block */}
          <div className="mb-12">
            <span className="font-body text-xs tracking-widest text-sage uppercase font-bold">
              {service.num}
            </span>
            <h1 
              id="detail-title"
              className="font-heading text-4xl md:text-6xl text-charcoal tracking-wide mt-2 mb-4"
            >
              {service.title}
            </h1>
            <p className="font-body text-lg md:text-xl text-wood font-medium tracking-wide italic">
              {service.subtitle}
            </p>
          </div>

          {/* Hero Image */}
          <div className="w-full aspect-video rounded-2xl bg-[#EDE8D8]/50 border border-charcoal/10 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group mb-16">
            {service.image ? (
              <img 
                src={service.image} 
                alt={`${service.title} - Professional ${service.subtitle} at Iydani Entertainment studio, Bengaluru`} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>
                <div className="absolute inset-4 border border-wood/10 rounded-xl pointer-events-none"></div>
                
                <svg className="w-12 h-12 text-charcoal/20 mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="font-body text-xs tracking-[0.2em] text-sage font-bold uppercase">IMAGE PLACEHOLDER - HERO</span>
                <span className="font-body text-[10px] text-charcoal/40 mt-1 uppercase tracking-wider">{service.imagePlaceholders[0].name} (1920 x 1080)</span>
              </>
            )}
          </div>

          {/* Grid Details (Text Description + Technical Specs + Gallery) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Text & Specs (7 columns or full 12 columns if no right column content) */}
            <div className={`${hasRightColumn ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-12`}>
              <div className="space-y-6">
                <h3 className="font-heading text-2xl text-charcoal tracking-wide border-b border-charcoal/5 pb-2">Overview</h3>
                <p className="font-body text-charcoal-light text-base md:text-lg leading-relaxed font-light">
                  {service.longDescription1}
                </p>
                <p className="font-body text-charcoal-light text-base md:text-lg leading-relaxed font-light">
                  {service.longDescription2}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-6 pt-4">
                <h3 className="font-heading text-2xl text-charcoal tracking-wide border-b border-charcoal/5 pb-2">Technical Specifications</h3>
                <div className="space-y-6">
                  {service.technicalSpecs.map((specGroup, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="font-body text-xs font-bold uppercase tracking-wider text-sage">{specGroup.category}</h4>
                      <ul className="space-y-2 pl-1">
                        {specGroup.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3 text-sm text-charcoal-light font-light leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-wood mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Mini Image Gallery or Video Player (5 columns, only rendered if content exists) */}
            {hasRightColumn && (
              <div className="lg:col-span-5 space-y-8">
                {service.video ? (
                  <div className="space-y-6">
                    <h3 className="font-heading text-2xl text-charcoal tracking-wide border-b border-charcoal/5 pb-2">360° Studio Tour</h3>
                    <div className="w-full aspect-[4/3] rounded-xl bg-charcoal/5 border border-charcoal/10 overflow-hidden shadow-sm relative group pointer-events-auto">
                      <video 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        controls
                      >
                        <source src={service.video.webm} type="video/webm" />
                        <source src={service.video.mp4} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading text-2xl text-charcoal tracking-wide border-b border-charcoal/5 pb-2">Media Gallery</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {service.imagePlaceholders.slice(1).map((placeholder, idx) => (
                        <div 
                          key={idx} 
                          className={`w-full ${placeholder.aspect} rounded-xl bg-[#EDE8D8]/40 border border-charcoal/10 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group transition-all duration-300 hover:scale-[1.01]`}
                        >
                          {placeholder.image ? (
                            <>
                              <img 
                                src={placeholder.image} 
                                alt={placeholder.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                              />
                              {/* Subtle tag overlay */}
                              <div className="absolute bottom-3 left-3 bg-charcoal/70 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-body tracking-wider text-parchment-light uppercase font-bold z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {placeholder.name}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-[radial-gradient(#2a2d34_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none"></div>
                              <div className="absolute inset-2 border border-wood/5 rounded-lg pointer-events-none"></div>
                              
                              {/* Icon based on config */}
                              {placeholder.icon === 'sliders' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                                </svg>
                              )}
                              {placeholder.icon === 'volume' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                </svg>
                              )}
                              {placeholder.icon === 'cog' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.827m11.379-8.16l1.15-.827M8.14 21.27l.707-1.03m6.95-10.12l.707-1.03M12 21.75V20.25m0-16.5V2.25" />
                                </svg>
                              )}
                              {placeholder.icon === 'waveform' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                              )}
                              {placeholder.icon === 'camera' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                              )}
                              {placeholder.icon === 'layout' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                              )}
                              {placeholder.icon === 'edit' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                              )}
                              {placeholder.icon === 'image' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                              )}
                              {placeholder.icon === 'video' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12A2.25 2.25 0 0020.25 18V6a2.25 2.25 0 00-18 0v12A2.25 2.25 0 006 20.25z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                              {placeholder.icon === 'layers' && (
                                <svg className="w-6 h-6 text-charcoal/20 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 7.5l4.179 2.25m-11.142 4.5L12 16.5l4.179-2.25m-11.142 0L2.25 12l4.179-2.25m11.142 4.5l4.179-2.25m-4.179 2.25L12 16.5m0 0l-4.179-2.25" />
                                </svg>
                              )}

                              <span className="font-body text-[10px] tracking-[0.25em] text-sage font-bold uppercase">{placeholder.name}</span>
                              <span className="font-body text-[8px] text-charcoal/40 mt-0.5 tracking-wide uppercase">{placeholder.size}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 px-6 md:px-16 border-t border-charcoal/5 bg-parchment-light">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-heading text-lg text-charcoal tracking-wider">IYDANI ENTERTAINMENT</p>
              <p className="font-body text-[10px] text-charcoal/40 mt-1">&copy; 2026 Iydani Entertainment. Detailed view placeholder.</p>
            </div>
            <a 
              href="#" 
              onClick={handleBackClick}
              className="font-body text-xs tracking-widest text-wood hover:text-wood-dark uppercase font-semibold transition-colors duration-300 pointer-events-auto"
            >
              Return to main view &uarr;
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
