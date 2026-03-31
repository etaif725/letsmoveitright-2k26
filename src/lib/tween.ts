/**
 * Tween animation system
 * Provides JavaScript-based animations similar to Webflow's tram library
 */

import { easings, createBezierEasing, type EasingName } from './bezier'

type TweenValue = number | string
type UpdateCallback = (value: TweenValue) => void
type CompleteCallback = () => void

interface TweenConfig {
  from: number
  to: number
  duration: number
  delay?: number
  easing?: EasingName | ((t: number) => number)
  onUpdate: UpdateCallback
  onComplete?: CompleteCallback
}

interface Tween {
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  isRunning: () => boolean
}

export function createTween(config: TweenConfig): Tween {
  const {
    from,
    to,
    duration,
    delay = 0,
    easing = 'webflow',
    onUpdate,
    onComplete,
  } = config

  let animationFrameId: number | null = null
  let startTime: number | null = null
  let pausedTime: number | null = null
  let isRunning = false
  let isPaused = false

  const easingFn = typeof easing === 'function' 
    ? easing 
    : easings[easing] || easings.webflow

  function animate(currentTime: number) {
    if (!isRunning || isPaused) return

    if (startTime === null) {
      startTime = currentTime
    }

    const elapsed = currentTime - startTime - delay
    
    if (elapsed < 0) {
      animationFrameId = requestAnimationFrame(animate)
      return
    }

    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFn(progress)
    const currentValue = from + (to - from) * easedProgress

    onUpdate(currentValue)

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      isRunning = false
      onComplete?.()
    }
  }

  return {
    start() {
      if (isRunning) return
      isRunning = true
      isPaused = false
      startTime = null
      animationFrameId = requestAnimationFrame(animate)
    },
    stop() {
      isRunning = false
      isPaused = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      startTime = null
      pausedTime = null
    },
    pause() {
      if (!isRunning || isPaused) return
      isPaused = true
      pausedTime = performance.now()
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    },
    resume() {
      if (!isRunning || !isPaused || pausedTime === null || startTime === null) return
      isPaused = false
      const pauseDuration = performance.now() - pausedTime
      startTime += pauseDuration
      animationFrameId = requestAnimationFrame(animate)
    },
    isRunning() {
      return isRunning && !isPaused
    },
  }
}

// Animation sequence for multiple tweens
interface SequenceItem {
  tween: TweenConfig
  startAt?: number // Delay from sequence start
}

export function createSequence(items: SequenceItem[]): {
  start: () => void
  stop: () => void
} {
  const tweens: Tween[] = []
  const timeouts: Array<ReturnType<typeof setTimeout>> = []

  return {
    start() {
      items.forEach((item) => {
        const timeout = setTimeout(() => {
          const tween = createTween(item.tween)
          tweens.push(tween)
          tween.start()
        }, item.startAt || 0)
        timeouts.push(timeout)
      })
    },
    stop() {
      timeouts.forEach(clearTimeout)
      tweens.forEach((tween) => tween.stop())
    },
  }
}

// Animate multiple properties at once
interface MultiTweenConfig {
  targets: HTMLElement | HTMLElement[]
  properties: {
    [key: string]: {
      from: number
      to: number
      unit?: string
    }
  }
  duration: number
  delay?: number
  stagger?: number
  easing?: EasingName | ((t: number) => number)
  onComplete?: () => void
}

export function animate(config: MultiTweenConfig): { stop: () => void } {
  const {
    targets,
    properties,
    duration,
    delay = 0,
    stagger = 0,
    easing = 'webflow',
    onComplete,
  } = config

  const elements = Array.isArray(targets) ? targets : [targets]
  const tweens: Tween[] = []
  let completedCount = 0

  elements.forEach((element, index) => {
    const elementDelay = delay + index * stagger

    Object.entries(properties).forEach(([property, values]) => {
      const { from, to, unit = '' } = values

      const tween = createTween({
        from,
        to,
        duration,
        delay: elementDelay,
        easing,
        onUpdate(value) {
          if (property === 'opacity') {
            element.style.opacity = String(value)
          } else if (property === 'x') {
            element.style.transform = `translateX(${value}${unit})`
          } else if (property === 'y') {
            element.style.transform = `translateY(${value}${unit})`
          } else if (property === 'scale') {
            element.style.transform = `scale(${value})`
          } else if (property === 'rotate') {
            element.style.transform = `rotate(${value}${unit || 'deg'})`
          } else {
            element.style[property as any] = `${value}${unit}`
          }
        },
        onComplete() {
          completedCount++
          if (completedCount === elements.length * Object.keys(properties).length) {
            onComplete?.()
          }
        },
      })

      tweens.push(tween)
      tween.start()
    })
  })

  return {
    stop() {
      tweens.forEach((tween) => tween.stop())
    },
  }
}

// Utility to parse color strings
export function parseColor(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ]
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ]
  }
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g)
    if (match) {
      return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])]
    }
  }
  return [0, 0, 0]
}

export function interpolateColor(from: string, to: string, progress: number): string {
  const [r1, g1, b1] = parseColor(from)
  const [r2, g2, b2] = parseColor(to)

  const r = Math.round(r1 + (r2 - r1) * progress)
  const g = Math.round(g1 + (g2 - g1) * progress)
  const b = Math.round(b1 + (b2 - b1) * progress)

  return `rgb(${r}, ${g}, ${b})`
}

export { createBezierEasing, easings }
