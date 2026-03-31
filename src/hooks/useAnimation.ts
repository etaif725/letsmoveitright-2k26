import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none'

interface AnimationConfig {
  type?: AnimationType
  duration?: number
  delay?: number
  easing?: string
  threshold?: number
  triggerOnce?: boolean
}

const EASING = {
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  webflow: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}

const getInitialTransform = (type: AnimationType): string => {
  switch (type) {
    case 'slide-up': return 'translateY(40px)'
    case 'slide-down': return 'translateY(-40px)'
    case 'slide-left': return 'translateX(40px)'
    case 'slide-right': return 'translateX(-100px)'
    case 'scale': return 'scale(0.95)'
    default: return 'none'
  }
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  config: AnimationConfig = {}
) {
  const {
    type = 'fade',
    duration = 600,
    delay = 0,
    easing = EASING.webflow,
    threshold = 0.2,
    triggerOnce = true,
  } = config

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setIsVisible(true)
          setHasAnimated(true)
          if (triggerOnce) observer.unobserve(element)
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, triggerOnce, hasAnimated])

  const style = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : getInitialTransform(type),
      transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
    }
    return baseStyle
  }, [isVisible, type, duration, delay, easing])

  return { ref, isVisible, style }
}

export function usePageLoadAnimation(config: AnimationConfig = {}) {
  const {
    type = 'fade',
    duration = 600,
    delay = 0,
    easing = EASING.webflow,
  } = config

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const style = useMemo(() => ({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'none' : getInitialTransform(type),
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
  }), [isLoaded, type, duration, delay, easing])

  return { isLoaded, style }
}

export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  count: number,
  config: AnimationConfig & { staggerDelay?: number } = {}
) {
  const {
    type = 'slide-up',
    duration = 600,
    delay = 0,
    staggerDelay = 100,
    easing = EASING.webflow,
    threshold = 0.15,
    triggerOnce = true,
  } = config

  const containerRef = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setIsVisible(true)
          setHasAnimated(true)
          if (triggerOnce) observer.unobserve(element)
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, triggerOnce, hasAnimated])

  const getItemStyle = useCallback((index: number): React.CSSProperties => {
    const itemDelay = delay + index * staggerDelay
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : getInitialTransform(type),
      transition: `opacity ${duration}ms ${easing} ${itemDelay}ms, transform ${duration}ms ${easing} ${itemDelay}ms`,
    }
  }, [isVisible, type, duration, delay, staggerDelay, easing])

  const styles = useMemo(() => 
    Array.from({ length: count }, (_, i) => getItemStyle(i)),
    [count, getItemStyle]
  )

  return { containerRef, isVisible, getItemStyle, styles }
}

export function useHeroAnimation() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const headingStyle: React.CSSProperties = useMemo(() => ({
    transform: isLoaded ? 'translate3d(0, 0, 0)' : 'translate3d(100px, 0, 0)',
    opacity: isLoaded ? 1 : 0,
    transition: `opacity 800ms ${EASING.webflow} 200ms, transform 800ms ${EASING.webflow} 200ms`,
    transformStyle: 'preserve-3d',
  }), [isLoaded])

  const descriptionStyle: React.CSSProperties = useMemo(() => ({
    transform: isLoaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
    opacity: isLoaded ? 1 : 0,
    transition: `opacity 600ms ${EASING.webflow} 400ms, transform 600ms ${EASING.webflow} 400ms`,
    transformStyle: 'preserve-3d',
  }), [isLoaded])

  const buttonsStyle: React.CSSProperties = useMemo(() => ({
    transform: isLoaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
    opacity: isLoaded ? 1 : 0,
    transition: `opacity 600ms ${EASING.webflow} 600ms, transform 600ms ${EASING.webflow} 600ms`,
    transformStyle: 'preserve-3d',
  }), [isLoaded])

  const customerStyle: React.CSSProperties = useMemo(() => ({
    transform: isLoaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 73px, 0)',
    opacity: isLoaded ? 1 : 0,
    transition: `opacity 600ms ${EASING.webflow} 800ms, transform 600ms ${EASING.webflow} 800ms`,
    transformStyle: 'preserve-3d',
  }), [isLoaded])

  return { isLoaded, headingStyle, descriptionStyle, buttonsStyle, customerStyle }
}

export { EASING }
