import { useState, useCallback, useEffect, useRef } from 'react'

interface UseSliderOptions {
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  transitionDuration?: number
}

export function useSlider(slideCount: number, options: UseSliderOptions = {}) {
  const { 
    autoplay = true, 
    autoplayDelay = 4000, 
    loop = true,
    transitionDuration = 500 
  } = options
  
  const [activeSlide, setActiveSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (transitionRef.current) {
      clearTimeout(transitionRef.current)
      transitionRef.current = null
    }
  }, [])

  const goToSlide = useCallback((index: number, resetAutoplay = true) => {
    if (isTransitioning || index === activeSlide) return

    let newIndex = index
    if (loop) {
      if (newIndex < 0) newIndex = slideCount - 1
      if (newIndex >= slideCount) newIndex = 0
    } else {
      if (newIndex < 0) newIndex = 0
      if (newIndex >= slideCount) newIndex = slideCount - 1
    }

    if (newIndex === activeSlide) return

    setIsTransitioning(true)
    setPreviousSlide(activeSlide)
    setActiveSlide(newIndex)

    transitionRef.current = setTimeout(() => {
      setPreviousSlide(null)
      setIsTransitioning(false)
    }, transitionDuration)

    if (resetAutoplay && autoplay) {
      clearTimers()
      intervalRef.current = setInterval(() => {
        goToSlide((newIndex + 1) % slideCount, false)
      }, autoplayDelay)
    }
  }, [activeSlide, isTransitioning, slideCount, loop, autoplay, autoplayDelay, transitionDuration, clearTimers])

  const next = useCallback(() => {
    goToSlide(activeSlide + 1)
  }, [activeSlide, goToSlide])

  const prev = useCallback(() => {
    goToSlide(activeSlide - 1)
  }, [activeSlide, goToSlide])

  useEffect(() => {
    if (autoplay && slideCount > 1) {
      intervalRef.current = setInterval(() => {
        setActiveSlide(current => {
          const nextSlide = (current + 1) % slideCount
          setPreviousSlide(current)
          setIsTransitioning(true)
          
          transitionRef.current = setTimeout(() => {
            setPreviousSlide(null)
            setIsTransitioning(false)
          }, transitionDuration)
          
          return nextSlide
        })
      }, autoplayDelay)
    }

    return clearTimers
  }, [autoplay, autoplayDelay, slideCount, transitionDuration, clearTimers])

  const getSlideStyle = useCallback((index: number): React.CSSProperties => {
    const isActive = index === activeSlide
    const isPrevious = index === previousSlide

    if (!isActive && !isPrevious) {
      return {
        display: 'none',
        opacity: 0,
      }
    }

    return {
      display: 'block',
      opacity: isActive ? 1 : 0,
      position: isPrevious ? 'absolute' : 'relative',
      top: isPrevious ? 0 : undefined,
      left: isPrevious ? 0 : undefined,
      width: isPrevious ? '100%' : undefined,
      transition: `opacity ${transitionDuration}ms ease-in-out`,
      pointerEvents: isActive ? 'auto' : 'none',
    }
  }, [activeSlide, previousSlide, transitionDuration])

  return {
    activeSlide,
    goToSlide,
    next,
    prev,
    isActive: (index: number) => index === activeSlide,
    isTransitioning,
    getSlideStyle,
  }
}
