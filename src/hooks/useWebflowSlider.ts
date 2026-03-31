/**
 * Webflow-style Slider Hook
 * Full implementation matching Webflow's slider behavior including:
 * - Multiple animation types (slide, fade, cross, over)
 * - Autoplay with timer limits
 * - Keyboard navigation
 * - Swipe/touch support
 * - ARIA accessibility
 * - Infinite loop
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { cssEasings, type EasingName } from '@/lib/bezier'

// Key codes for keyboard navigation
const KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
  SPACE: ' ',
  ENTER: 'Enter',
  HOME: 'Home',
  END: 'End',
} as const

type AnimationType = 'slide' | 'fade' | 'cross' | 'over'

interface WebflowSliderConfig {
  animation?: AnimationType
  duration?: number
  easing?: EasingName
  autoplay?: boolean
  autoplayDelay?: number
  autoplayLimit?: number
  infinite?: boolean
  hideArrows?: boolean
  disableSwipe?: boolean
  crossOver?: number // For cross animation (0-1)
  pauseOnHover?: boolean
  pauseOnFocus?: boolean
  slidesPerView?: number
}

interface SlideState {
  index: number
  previousIndex: number
  isAnimating: boolean
  direction: 'left' | 'right' | null
}

export function useWebflowSlider(slideCount: number, config: WebflowSliderConfig = {}) {
  const {
    animation = 'slide',
    duration = 500,
    easing = 'ease',
    autoplay = false,
    autoplayDelay = 4000,
    autoplayLimit,
    infinite = true,
    hideArrows = false,
    disableSwipe = false,
    crossOver = 0.5,
    pauseOnHover = true,
    pauseOnFocus = true,
    slidesPerView = 1,
  } = config

  // State
  const [state, setState] = useState<SlideState>({
    index: 0,
    previousIndex: 0,
    isAnimating: false,
    direction: null,
  })
  
  const [hasFocus, setHasFocus] = useState({ keyboard: false, mouse: false })
  const [isPaused, setIsPaused] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerCountRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Computed values
  const canGoPrev = infinite || state.index > 0
  const canGoNext = infinite || state.index < slideCount - slidesPerView
  const showLeftArrow = !hideArrows && canGoPrev
  const showRightArrow = !hideArrows && canGoNext

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    }
  }, [])

  // Navigate to slide
  const goToSlide = useCallback((targetIndex: number, immediate = false) => {
    if (state.isAnimating && !immediate) return

    let newIndex = targetIndex
    const direction: 'left' | 'right' = targetIndex > state.index ? 'right' : 'left'

    // Handle bounds
    if (newIndex < 0) {
      newIndex = infinite ? slideCount - slidesPerView : 0
    } else if (newIndex > slideCount - slidesPerView) {
      newIndex = infinite ? 0 : slideCount - slidesPerView
    }

    if (newIndex === state.index && !immediate) return

    // Clear any existing autoplay timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setState(prev => ({
      index: newIndex,
      previousIndex: prev.index,
      isAnimating: !immediate,
      direction,
    }))

    if (!immediate) {
      // Reset animation state after duration
      animationTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isAnimating: false, direction: null }))
      }, duration)
    }

    // Restart autoplay
    if (autoplay && !isPaused) {
      startAutoplay()
    }
  }, [state.index, state.isAnimating, slideCount, infinite, duration, autoplay, isPaused])

  const next = useCallback(() => {
    goToSlide(state.index + 1)
  }, [state.index, goToSlide])

  const prev = useCallback(() => {
    goToSlide(state.index - 1)
  }, [state.index, goToSlide])

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    
    // Check autoplay limit
    if (autoplayLimit && timerCountRef.current >= autoplayLimit) {
      return
    }

    timerRef.current = setTimeout(() => {
      timerCountRef.current++
      next()
    }, autoplayDelay)
  }, [autoplayDelay, autoplayLimit, next])

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Start autoplay on mount if enabled
  useEffect(() => {
    if (autoplay && !isPaused && slideCount > 1) {
      startAutoplay()
    }
    return stopAutoplay
  }, [autoplay, isPaused, slideCount, startAutoplay, stopAutoplay])

  // Pause/resume handlers
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setHasFocus(prev => ({ ...prev, mouse: true }))
      setIsPaused(true)
      stopAutoplay()
    }
  }, [pauseOnHover, stopAutoplay])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setHasFocus(prev => ({ ...prev, mouse: false }))
      if (!hasFocus.keyboard) {
        setIsPaused(false)
        if (autoplay) startAutoplay()
      }
    }
  }, [pauseOnHover, hasFocus.keyboard, autoplay, startAutoplay])

  const handleFocusIn = useCallback(() => {
    if (pauseOnFocus) {
      setHasFocus(prev => ({ ...prev, keyboard: true }))
      setIsPaused(true)
      stopAutoplay()
    }
  }, [pauseOnFocus, stopAutoplay])

  const handleFocusOut = useCallback(() => {
    if (pauseOnFocus) {
      setHasFocus(prev => ({ ...prev, keyboard: false }))
      if (!hasFocus.mouse) {
        setIsPaused(false)
        if (autoplay) startAutoplay()
      }
    }
  }, [pauseOnFocus, hasFocus.mouse, autoplay, startAutoplay])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case KEYS.ARROW_LEFT:
      case KEYS.ARROW_UP:
        e.preventDefault()
        prev()
        break
      case KEYS.ARROW_RIGHT:
      case KEYS.ARROW_DOWN:
        e.preventDefault()
        next()
        break
      case KEYS.HOME:
        e.preventDefault()
        goToSlide(0)
        break
      case KEYS.END:
        e.preventDefault()
        goToSlide(slideCount - 1)
        break
      case KEYS.SPACE:
      case KEYS.ENTER:
        e.preventDefault()
        // Toggle pause on space/enter if on slider container
        if (autoplay) {
          setIsPaused(p => !p)
        }
        break
    }
  }, [prev, next, goToSlide, slideCount, autoplay])

  // Touch/swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disableSwipe) return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [disableSwipe])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disableSwipe || !touchStartRef.current) return
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prev()
      } else {
        next()
      }
    }
    
    touchStartRef.current = null
  }, [disableSwipe, prev, next])

  // Get animation styles for a slide
  const getSlideStyle = useCallback((index: number): React.CSSProperties => {
    const isActive = index === state.index
    const isPrevious = index === state.previousIndex
    const { isAnimating, direction } = state
    const cssEasing = cssEasings[easing] || cssEasings.ease
    const transitionValue = `all ${duration}ms ${cssEasing}`

    // Base hidden state
    const hiddenStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
    }

    // Active slide base
    const activeStyle: React.CSSProperties = {
      position: 'relative',
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
    }

    switch (animation) {
      case 'fade':
        if (isActive) {
          return {
            ...activeStyle,
            transition: isAnimating ? transitionValue : undefined,
            zIndex: 2,
          }
        }
        if (isPrevious && isAnimating) {
          return {
            ...hiddenStyle,
            visibility: 'visible',
            opacity: 0,
            transition: transitionValue,
            zIndex: 1,
          }
        }
        return hiddenStyle

      case 'cross':
        const crossDuration = Math.round(duration - duration * crossOver)
        const crossTransition = `opacity ${crossDuration}ms ${cssEasing}`
        
        if (isActive) {
          return {
            ...activeStyle,
            opacity: isAnimating ? 1 : 1,
            transition: isAnimating ? crossTransition : undefined,
            transitionDelay: isAnimating ? `${duration - crossDuration}ms` : undefined,
            zIndex: 2,
          }
        }
        if (isPrevious && isAnimating) {
          return {
            ...hiddenStyle,
            visibility: 'visible',
            opacity: 0,
            transition: crossTransition,
            zIndex: 1,
          }
        }
        return hiddenStyle

      case 'over':
        const slideWidth = 100
        const overDirection = direction === 'right' ? -1 : 1
        
        if (isActive) {
          return {
            ...activeStyle,
            transform: isAnimating ? 'translateX(0)' : undefined,
            transition: isAnimating ? transitionValue : undefined,
            zIndex: 2,
          }
        }
        if (isPrevious && isAnimating) {
          return {
            ...hiddenStyle,
            visibility: 'visible',
            opacity: 1,
            zIndex: 1,
          }
        }
        return {
          ...hiddenStyle,
          transform: `translateX(${overDirection * slideWidth}%)`,
        }

      case 'slide':
      default:
        // Slide animation - all slides move together
        return {
          position: 'relative',
          flex: `0 0 ${100 / slidesPerView}%`,
          width: `${100 / slidesPerView}%`,
          opacity: 1,
          visibility: 'visible',
        }
    }
  }, [state, animation, duration, easing, crossOver, slidesPerView])

  // Mask styles for slide animation
  const getMaskStyle = useCallback((): React.CSSProperties => {
    if (animation === 'slide') {
      return {
        display: 'flex',
        overflow: 'hidden',
        width: '100%',
      }
    }
    return {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }
  }, [animation])

  // Dot navigation
  const getDotProps = useCallback((index: number) => ({
    role: 'button',
    tabIndex: index === state.index ? 0 : -1,
    'aria-pressed': index === state.index,
    'aria-label': `Show slide ${index + 1} of ${slideCount}`,
    onClick: () => goToSlide(index),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault()
        goToSlide(index)
      } else if (e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_UP) {
        e.preventDefault()
        const newIndex = Math.max(index - 1, 0)
        goToSlide(newIndex)
        // Focus the new dot
        const dots = containerRef.current?.querySelectorAll('[role="button"]')
        ;(dots?.[newIndex] as HTMLElement)?.focus()
      } else if (e.key === KEYS.ARROW_RIGHT || e.key === KEYS.ARROW_DOWN) {
        e.preventDefault()
        const newIndex = Math.min(index + 1, slideCount - 1)
        goToSlide(newIndex)
        const dots = containerRef.current?.querySelectorAll('[role="button"]')
        ;(dots?.[newIndex] as HTMLElement)?.focus()
      }
    },
  }), [state.index, slideCount, goToSlide])

  // Arrow button props
  const getLeftArrowProps = useCallback(() => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Previous slide',
    onClick: prev,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault()
        prev()
      }
    },
    style: { display: showLeftArrow ? undefined : 'none' },
  }), [prev, showLeftArrow])

  const getRightArrowProps = useCallback(() => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Next slide',
    onClick: next,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault()
        next()
      }
    },
    style: { display: showRightArrow ? undefined : 'none' },
  }), [next, showRightArrow])

  // Container props with all handlers
  const getContainerProps = useCallback(() => ({
    ref: containerRef,
    role: 'region',
    'aria-label': 'carousel',
    'aria-roledescription': 'carousel',
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocusIn,
    onBlur: handleFocusOut,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }), [
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleFocusIn,
    handleFocusOut,
    handleTouchStart,
    handleTouchEnd,
  ])

  // Slide props with ARIA attributes
  const getSlideProps = useCallback((index: number) => ({
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} of ${slideCount}`,
    'aria-hidden': index !== state.index,
    tabIndex: index === state.index ? 0 : -1,
  }), [slideCount, state.index])

  // Live region for screen readers
  const ariaLiveText = useMemo(() => 
    `Slide ${state.index + 1} of ${slideCount}`,
    [state.index, slideCount]
  )

  return {
    // State
    activeIndex: state.index,
    previousIndex: state.previousIndex,
    isAnimating: state.isAnimating,
    isPaused,
    
    // Navigation
    goToSlide,
    next,
    prev,
    
    // Autoplay control
    startAutoplay,
    stopAutoplay,
    setIsPaused,
    
    // Style getters
    getSlideStyle,
    getMaskStyle,
    
    // Props getters
    getContainerProps,
    getSlideProps,
    getDotProps,
    getLeftArrowProps,
    getRightArrowProps,
    
    // Visibility
    showLeftArrow,
    showRightArrow,
    
    // ARIA
    ariaLiveText,
    
    // Utils
    isActive: (index: number) => index === state.index,
    
    // Track style for slide animation
    getTrackStyle: (): React.CSSProperties => {
      if (animation !== 'slide') return {}
      const offset = -state.index * (100 / slidesPerView)
      const cssEasing = cssEasings[easing] || cssEasings.ease
      return {
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
        transform: `translateX(${offset}%)`,
        transition: state.isAnimating ? `transform ${duration}ms ${cssEasing}` : 'none',
      }
    }
  }
}
