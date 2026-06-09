import React, { useRef, useState, useEffect } from 'react'
import DOMOverlay from './components/DOMOverlay'
import ServiceDetail from './components/ServiceDetail'
import CustomCursor from './components/CustomCursor'
import HomeHero from './components/HomeHero'
import IyedaniBackground from './components/IyedaniBackground'
import ChatbotWidget from './components/ChatbotWidget'
import { services } from './data/services'

// Import new page views
import AboutUs from './components/AboutUs'
import ServicesPage from './components/ServicesPage'
import AudioLabel from './components/AudioLabel'
import Careers from './components/Careers'
import News from './components/News'
import Contact from './components/Contact'
import PrivacyRules from './components/PrivacyRules'
import AdminPortal from './components/AdminPortal'

export default function App() {
  const containerRef = useRef(null)
  const [currentPage, setCurrentPage] = useState('legend') // 'legend' | 'studio' | 'about' | 'services' | 'audio-label' | 'careers' | 'news' | 'contact' | 'privacy' | 'admin'
  const [activeService, setActiveService] = useState(null)
  const [showRecordingError, setShowRecordingError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Track logo clicks for hidden admin portal trigger
  const logoClicks = useRef(0)
  const logoClickTimeout = useRef(null)

  const handleLogoClick = (e) => {
    e.preventDefault()
    logoClicks.current += 1
    
    if (logoClicks.current === 5) {
      logoClicks.current = 0
      window.location.hash = '#/iy-sys-ctrl-2026'
      return
    }
    
    if (logoClickTimeout.current) clearTimeout(logoClickTimeout.current)
    logoClickTimeout.current = setTimeout(() => {
      logoClicks.current = 0
    }, 2000)
    
    if (currentPage !== 'legend') {
      handlePageChange('legend')
    }
  }

  // Listen to hash URL changes for client-side routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      
      // Check for subpage details (e.g. #/details/recording)
      const detailMatch = hash.match(/^#\/details\/(.+)$/)
      if (detailMatch) {
        const id = detailMatch[1]
        
        // Intercept Professional Music Recording details to display simulated error
        if (id === 'recording') {
          window.location.hash = '#recording' // shift hash back
          setShowRecordingError(true)
          setActiveService(null)
          document.body.style.overflow = 'hidden'
          return
        }

        const found = services.find(s => s.id === id)
        if (found) {
          setCurrentPage('studio')
          setActiveService(found)
          document.body.style.overflow = 'hidden'
          return
        }
      } else {
        setActiveService(null)
        if (!showRecordingError) {
          document.body.style.overflow = ''
        }
      }

      // Page routing mapping
      if (hash.startsWith('#/about')) {
        setCurrentPage('about')
      } else if (hash.startsWith('#/services')) {
        setCurrentPage('services')
      } else if (hash.startsWith('#/audio-label')) {
        setCurrentPage('audio-label')
      } else if (hash.startsWith('#/careers')) {
        setCurrentPage('careers')
      } else if (hash.startsWith('#/news')) {
        setCurrentPage('news')
      } else if (hash.startsWith('#/contact')) {
        setCurrentPage('contact')
      } else if (hash.startsWith('#/privacy')) {
        setCurrentPage('privacy')
      } else if (hash.startsWith('#/admin')) {
        // Redirect standard admin access to home to hide it
        window.location.hash = '#/'
        setCurrentPage('legend')
      } else if (hash.startsWith('#/iy-sys-ctrl-2026')) {
        setCurrentPage('admin')
      } else if (hash.startsWith('#/studio') || hash.startsWith('#studio')) {
        setCurrentPage('studio')
      } else {
        setCurrentPage('legend')
      }
    }

    // Check hash on mount
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.body.style.overflow = ''
    }
  }, [showRecordingError])

  const handleClose = () => {
    if (activeService) {
      window.location.hash = `#/${activeService.id}`
    } else {
      window.location.hash = ''
    }
  }

  // Handle page change smoothly
  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (page === 'legend') {
      window.location.hash = '#/'
    } else if (page === 'admin') {
      window.location.hash = '#/iy-sys-ctrl-2026'
    } else {
      window.location.hash = `#/${page}`
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const navItems = [
    { label: 'Legend', value: 'legend' },
    { label: 'Studio', value: 'studio' },
    { label: 'About', value: 'about' },
    { label: 'Services', value: 'services' },
    { label: 'Audio Label', value: 'audio-label' },
    { label: 'Careers', value: 'careers' },
    { label: 'News', value: 'news' },
    { label: 'Contact', value: 'contact' }
  ]

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* Sound & Vision Themed Global Animated Background */}
      <IyedaniBackground currentPage={currentPage} />

      {/* Premium custom mouse follower */}
      <CustomCursor />

      {/* Rule-based interactive FAQ Chatbot widget */}
      <ChatbotWidget onNavigateToStudio={() => handlePageChange('studio')} />

      {/* Global Navigation Header (Google Labs style) */}
      <header className="fixed top-0 left-0 w-full px-6 md:px-12 lg:px-16 py-3 flex justify-between items-center z-50 pointer-events-auto bg-parchment/65 backdrop-blur-md border-b border-charcoal/5 animate-fade-in">
        <a 
          href="#" 
          onClick={handleLogoClick}
          className="font-heading text-lg md:text-2xl tracking-widest text-charcoal font-bold hover:text-wood transition-colors duration-300"
        >
          IYDANI ENTERTAINMENT
        </a>
        
        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center space-x-6 md:space-x-8">
          {navItems.map(item => (
            <button
              key={item.value}
              onClick={() => handlePageChange(item.value)}
              className={`font-body text-[10px] tracking-widest uppercase font-bold transition-all duration-300 pointer-events-auto cursor-pointer relative py-1 ${
                currentPage === item.value 
                  ? 'text-charcoal' 
                  : 'text-charcoal-light opacity-50 hover:opacity-100 hover:text-charcoal'
              }`}
            >
              <span>{item.label}</span>
              {currentPage === item.value && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-wood rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger toggle */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="xl:hidden p-2 text-charcoal focus:outline-none z-50 cursor-pointer pointer-events-auto"
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Sliding Drawer Menu */}
      {menuOpen && (
        <div className="xl:hidden fixed inset-0 bg-parchment-light/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-6 pointer-events-auto">
          {navItems.map(item => (
            <button
              key={item.value}
              onClick={() => { handlePageChange(item.value); setMenuOpen(false); }}
              className={`font-heading text-2xl tracking-widest uppercase font-bold transition-colors cursor-pointer duration-300 ${
                currentPage === item.value ? 'text-wood' : 'text-charcoal hover:text-wood'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Page Content Selection */}
      {currentPage === 'legend' && <HomeHero onExploreStudio={() => handlePageChange('studio')} />}
      {currentPage === 'studio' && <DOMOverlay />}
      {currentPage === 'about' && <AboutUs />}
      {currentPage === 'services' && <ServicesPage />}
      {currentPage === 'audio-label' && <AudioLabel />}
      {currentPage === 'careers' && <Careers />}
      {currentPage === 'news' && <News />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'privacy' && <PrivacyRules />}
      {currentPage === 'admin' && <AdminPortal />}

      {/* Service detail page overlay */}
      {activeService && (
        <ServiceDetail service={activeService} onClose={handleClose} />
      )}

      {/* Simulated Technical Diagnostic Error Overlay for Music Recording */}
      {showRecordingError && (
        <div className="fixed inset-0 z-[999999] bg-[#FAF9F4] text-[#d9534f] p-8 md:p-16 flex flex-col justify-between font-mono select-text pointer-events-auto overflow-y-auto">
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-[#d9534f]">
              <span className="w-4 h-4 rounded-full bg-[#d9534f] animate-ping"></span>
              <h2 className="text-xl md:text-3xl font-bold uppercase tracking-wider">
                Acoustic Runtime Error (Hardware Fault)
              </h2>
            </div>
            
            <div className="bg-[#FAF8F2] border border-[#d9534f]/20 p-6 rounded-lg space-y-4">
              <p className="font-bold text-base md:text-lg">
                Uncaught Technical Exception: Decibel threshold exceeded standard safety limits (Acoustic Overload)
              </p>
              <p className="text-xs text-[#3D4149] leading-relaxed">
                The Neumann U87 Ai condenser microphone locker and the Neve 1073 preamplifier signal path detected input signals exceeding +24dBu, triggering safety shutdowns to prevent transducer damage.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-[#2A2D34]/40">Diagnostic Stack Trace:</span>
              <pre className="bg-[#1A1C21] text-parchment-light p-5 rounded-lg text-[10px] md:text-xs overflow-x-auto leading-relaxed shadow-inner">
{`Error: Input level reached +28.4dBu (clipping limit +24dBu)
    at Preamplifier.Neve1073.gainStage (hardware_locker.js:142:9)
    at SignalPath.AnalogSignal.process (signal_chain.js:84:18)
    at VocalBooth.MicCap.NeumannU87 (acoustics_manager.js:312:24)
    at LiveRoom.TrackingSession.capture (studio_session.js:89:12)
    at HTMLButtonElement.dispatchStudioClick (App.jsx:78:22)
    at Object.invokeGuardedCallback (react-dom.production.min.js:244:11)`}
              </pre>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-[#2A2D34]/10">
            <button 
              onClick={() => {
                setShowRecordingError(false)
                document.body.style.overflow = ''
              }}
              className="px-8 py-3 bg-[#d9534f] text-white hover:bg-[#c9302c] font-bold text-xs tracking-widest uppercase rounded-md transition-colors duration-300 pointer-events-auto cursor-pointer"
            >
              Bypass Safety & Reset Signal Chain
            </button>
            <button 
              onClick={() => {
                setShowRecordingError(false)
                document.body.style.overflow = ''
                handlePageChange('legend')
              }}
              className="px-8 py-3 border border-[#2A2D34]/20 text-[#3D4149] hover:text-[#2A2D34] hover:bg-[#2A2D34]/5 font-bold text-xs tracking-widest uppercase rounded-md transition-colors duration-300 pointer-events-auto cursor-pointer"
            >
              Return to Legend Page
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
