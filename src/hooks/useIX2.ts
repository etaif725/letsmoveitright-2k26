/**
 * IX2-style interactions hook
 * Provides Webflow-like interaction triggers for React components
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { type EasingName } from '@/lib/bezier'
import { createTween } from '@/lib/tween'

// Trigger types matching Webflow's IX2
type TriggerType = 
  | 'page-load'
  | 'scroll-into-view'
  | 'scroll-out-of-view'
  | 'mouse-hover'
  | 'mouse-click'
  | 'mouse-move'
  | 'tab-active'
  | 'tab-inactive'
  | 'slider-active'
  | 'slider-inactive'

interface AnimationAction {
  property: 'opacity' | 'transform' | 'x' | 'y' | 'scale' | 'rotate' | 'width' | 'height'
  from?: number | string
  to: number | string
  unit?: string
}

interface InteractionConfig {
  trigger: TriggerType
  actions: AnimationAction[]
  duration?: number
  delay?: number
  easing?: EasingName
  stagger?: number
  loop?: boolean
  continuous?: boolean
}

export function useIX2<T extends HTMLElement = HTMLDivElement>(
  config: InteractionConfig
) {
  const ref = useRef<T>(null)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const animationRef = useRef<{ stop: () => void } | null>(null)

  const {
    trigger,
    actions,
    duration = 600,
    delay = 0,
    easing = 'webflow',
    stagger = 0,
    loop = false,
    continuous = false,
  } = config

  const applyActions = useCallback((reverse = false) => {
    const element = ref.current
    if (!element) return

    // Stop any running animation
    animationRef.current?.stop()

    actions.forEach((action, index) => {
      const actionDelay = delay + index * stagger
      const from = reverse ? action.to : (action.from ?? getComputedValue(element, action.property))
      const to = reverse ? (action.from ?? 0) : action.to

      if (action.property === 'opacity') {
        const tween = createTween({
          from: Number(from),
          to: Number(to),
          duration,
          delay: actionDelay,
          easing,
          onUpdate(value) {
            element.style.opacity = String(value)
          },
        })
        tween.start()
      } else if (['x', 'y', 'scale', 'rotate'].includes(action.property)) {
        const tween = createTween({
          from: Number(from),
          to: Number(to),
          duration,
          delay: actionDelay,
          easing,
          onUpdate(value) {
            updateTransform(element, action.property, Number(value), action.unit)
          },
        })
        tween.start()
      } else {
        const tween = createTween({
          from: Number(from),
          to: Number(to),
          duration,
          delay: actionDelay,
          easing,
          onUpdate(value) {
            element.style[action.property as any] = `${value}${action.unit || 'px'}`
          },
        })
        tween.start()
      }
    })
  }, [actions, duration, delay, easing, stagger])

  // Page load trigger
  useEffect(() => {
    if (trigger !== 'page-load') return
    if (hasTriggered && !loop) return

    const timer = setTimeout(() => {
      applyActions()
      setHasTriggered(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [trigger, applyActions, hasTriggered, loop])

  // Scroll into view trigger
  useEffect(() => {
    if (trigger !== 'scroll-into-view' && trigger !== 'scroll-out-of-view') return
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (trigger === 'scroll-into-view' && entry.isIntersecting) {
          if (!hasTriggered || continuous) {
            applyActions()
            setHasTriggered(true)
            setIsActive(true)
          }
        }
        if (trigger === 'scroll-out-of-view' && !entry.isIntersecting && hasTriggered) {
          if (continuous) {
            applyActions(true)
            setIsActive(false)
          }
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [trigger, applyActions, hasTriggered, continuous])

  // Mouse hover trigger
  useEffect(() => {
    if (trigger !== 'mouse-hover') return
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => {
      applyActions()
      setIsActive(true)
    }

    const handleMouseLeave = () => {
      applyActions(true)
      setIsActive(false)
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [trigger, applyActions])

  // Mouse click trigger
  useEffect(() => {
    if (trigger !== 'mouse-click') return
    const element = ref.current
    if (!element) return

    const handleClick = () => {
      if (isActive) {
        applyActions(true)
      } else {
        applyActions()
      }
      setIsActive(!isActive)
    }

    element.addEventListener('click', handleClick)
    return () => element.removeEventListener('click', handleClick)
  }, [trigger, applyActions, isActive])

  // Manual trigger functions for tabs/sliders
  const triggerIntro = useCallback(() => {
    applyActions()
    setIsActive(true)
  }, [applyActions])

  const triggerOutro = useCallback(() => {
    applyActions(true)
    setIsActive(false)
  }, [applyActions])

  const reset = useCallback(() => {
    setHasTriggered(false)
    setIsActive(false)
    const element = ref.current
    if (element) {
      element.style.opacity = ''
      element.style.transform = ''
    }
  }, [])

  return {
    ref,
    isActive,
    hasTriggered,
    triggerIntro,
    triggerOutro,
    reset,
  }
}

// Helper to get computed value
function getComputedValue(element: HTMLElement, property: string): number {
  const computed = window.getComputedStyle(element)
  if (property === 'opacity') {
    return parseFloat(computed.opacity) || 1
  }
  if (property === 'x' || property === 'y') {
    const transform = computed.transform
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix.*\((.+)\)/)
      if (matrix) {
        const values = matrix[1].split(', ')
        return property === 'x' ? parseFloat(values[4]) || 0 : parseFloat(values[5]) || 0
      }
    }
    return 0
  }
  if (property === 'scale') return 1
  if (property === 'rotate') return 0
  return 0
}

// Helper to update transform
const transformState: WeakMap<HTMLElement, Record<string, string>> = new WeakMap()

function updateTransform(element: HTMLElement, property: string, value: number, unit?: string) {
  let state = transformState.get(element)
  if (!state) {
    state = {}
    transformState.set(element, state)
  }

  switch (property) {
    case 'x':
      state.translateX = `translateX(${value}${unit || 'px'})`
      break
    case 'y':
      state.translateY = `translateY(${value}${unit || 'px'})`
      break
    case 'scale':
      state.scale = `scale(${value})`
      break
    case 'rotate':
      state.rotate = `rotate(${value}${unit || 'deg'})`
      break
  }

  const transform = Object.values(state).join(' ')
  element.style.transform = transform
}

// Convenience hook for common scroll animations
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: {
    type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none'
    duration?: number
    delay?: number
    easing?: EasingName
    distance?: number
  } = {}
) {
  const {
    type = 'slide-up',
    duration = 600,
    delay = 0,
    easing = 'webflow',
    distance = 40,
  } = options

  const actions: AnimationAction[] = [{ property: 'opacity', from: 0, to: 1 }]

  switch (type) {
    case 'slide-up':
      actions.push({ property: 'y', from: distance, to: 0, unit: 'px' })
      break
    case 'slide-down':
      actions.push({ property: 'y', from: -distance, to: 0, unit: 'px' })
      break
    case 'slide-left':
      actions.push({ property: 'x', from: distance, to: 0, unit: 'px' })
      break
    case 'slide-right':
      actions.push({ property: 'x', from: -distance, to: 0, unit: 'px' })
      break
    case 'scale':
      actions.push({ property: 'scale', from: 0.9, to: 1 })
      break
  }

  return useIX2<T>({
    trigger: 'scroll-into-view',
    actions,
    duration,
    delay,
    easing,
  })
}

// Hook for hover animations
export function useHoverAnimation<T extends HTMLElement = HTMLDivElement>(
  options: {
    scale?: number
    y?: number
    duration?: number
    easing?: EasingName
  } = {}
) {
  const {
    scale = 1.02,
    y = -4,
    duration = 300,
    easing = 'easeOutQuad',
  } = options

  const actions: AnimationAction[] = []
  
  if (scale !== 1) {
    actions.push({ property: 'scale', from: 1, to: scale })
  }
  if (y !== 0) {
    actions.push({ property: 'y', from: 0, to: y, unit: 'px' })
  }

  return useIX2<T>({
    trigger: 'mouse-hover',
    actions,
    duration,
    easing,
  })
}
