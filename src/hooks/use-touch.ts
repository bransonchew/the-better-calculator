import { useEffect, useState } from 'react'

export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  // Detect touch devices
  useEffect(() => {
    const detectTouch = () => {
      setIsTouch(('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
    }
    detectTouch()

    // Update on resize
    window.addEventListener('resize', detectTouch)
    return window.removeEventListener('resize', detectTouch)
  }, [])

  return isTouch
}
