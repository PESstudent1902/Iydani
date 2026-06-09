import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollState } from '../store/scrollStore'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(containerRef, sectionRefs, currentPage) {
  useEffect(() => {
    if (currentPage !== 'studio') {
      // Reset scroll state when not in studio
      scrollState.progress = 0
      scrollState.activeSection = 0
      scrollState.sectionProgress = 0
      scrollState.velocity = 0
      return
    }
    
    if (!containerRef.current) return

    // Central ScrollTrigger to track overall progress
    const mainTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollState.progress = self.progress
        scrollState.activeSection = Math.min(3, Math.floor(self.progress * 4))
        scrollState.sectionProgress = (self.progress * 4) % 1
        scrollState.velocity = self.getVelocity() / 1000
      }
    })

    // Set up section DOM animations (fade & lift text, scale images)
    // Wrap in a tiny timeout to ensure DOM elements have layout and sizes computed
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
      
      sectionRefs.forEach((ref) => {
        if (!ref.current) return
        
        const textElements = ref.current.querySelectorAll('.animate-text')
        const imageContainer = ref.current.querySelector('.animate-image')

        if (textElements.length > 0) {
          gsap.fromTo(textElements, 
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }

        if (imageContainer) {
          gsap.fromTo(imageContainer,
            { opacity: 0, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      mainTrigger.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [containerRef, sectionRefs, currentPage])
}
