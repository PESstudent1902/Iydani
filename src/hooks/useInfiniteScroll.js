import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export function useInfiniteScroll(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return

    // Create a ScrollTrigger that activates at the very end of the scroll container
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'bottom bottom',
      end: 'bottom+=50 bottom',
      onEnter: () => {
        // Fast, smooth cinematic scroll back to top (Option B/C hybrid)
        gsap.to(window, {
          scrollTo: 0,
          duration: 1.8,
          ease: 'power3.inOut',
          overwrite: 'auto'
        })
      }
    })

    return () => {
      trigger.kill()
    }
  }, [containerRef])
}
