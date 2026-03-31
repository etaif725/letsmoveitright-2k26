/**
 * Bezier easing function generator
 * Based on Webflow's animation system
 * Creates CSS cubic-bezier equivalent timing functions for JS animations
 */

const NEWTON_ITERATIONS = 4
const NEWTON_MIN_SLOPE = 0.001
const SUBDIVISION_PRECISION = 0.0000001
const SUBDIVISION_MAX_ITERATIONS = 10
const SPLINE_TABLE_SIZE = 11
const SAMPLE_STEP_SIZE = 1.0 / (SPLINE_TABLE_SIZE - 1.0)

function calcBezier(t: number, a1: number, a2: number): number {
  return ((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t * t + 3 * a1 * t
}

function getSlope(t: number, a1: number, a2: number): number {
  return 3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1
}

function binarySubdivide(x: number, a: number, b: number, mX1: number, mX2: number): number {
  let currentX: number
  let currentT: number
  let i = 0
  do {
    currentT = a + (b - a) / 2
    currentX = calcBezier(currentT, mX1, mX2) - x
    if (currentX > 0) {
      b = currentT
    } else {
      a = currentT
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
  return currentT
}

function newtonRaphsonIterate(x: number, guessT: number, mX1: number, mX2: number): number {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = getSlope(guessT, mX1, mX2)
    if (currentSlope === 0) {
      return guessT
    }
    const currentX = calcBezier(guessT, mX1, mX2) - x
    guessT -= currentX / currentSlope
  }
  return guessT
}

export function createBezierEasing(mX1: number, mY1: number, mX2: number, mY2: number) {
  if (!(mX1 >= 0 && mX1 <= 1 && mX2 >= 0 && mX2 <= 1)) {
    throw new Error('Bezier x values must be in [0, 1] range')
  }

  // Precompute samples table
  const sampleValues = new Float32Array(SPLINE_TABLE_SIZE)
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (let i = 0; i < SPLINE_TABLE_SIZE; ++i) {
      sampleValues[i] = calcBezier(i * SAMPLE_STEP_SIZE, mX1, mX2)
    }
  }

  function getTForX(x: number): number {
    let intervalStart = 0
    let currentSample = 1
    const lastSample = SPLINE_TABLE_SIZE - 1

    for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
      intervalStart += SAMPLE_STEP_SIZE
    }
    --currentSample

    // Interpolate to provide initial guess for t
    const dist = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample])
    const guessForT = intervalStart + dist * SAMPLE_STEP_SIZE
    const initialSlope = getSlope(guessForT, mX1, mX2)

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(x, guessForT, mX1, mX2)
    } else if (initialSlope === 0) {
      return guessForT
    } else {
      return binarySubdivide(x, intervalStart, intervalStart + SAMPLE_STEP_SIZE, mX1, mX2)
    }
  }

  return function bezierEasing(x: number): number {
    // Linear case
    if (mX1 === mY1 && mX2 === mY2) {
      return x
    }
    // Edge cases
    if (x === 0) return 0
    if (x === 1) return 1
    return calcBezier(getTForX(x), mY1, mY2)
  }
}

// Pre-built easing functions matching Webflow's defaults
export const easings = {
  linear: createBezierEasing(0, 0, 1, 1),
  ease: createBezierEasing(0.25, 0.1, 0.25, 1),
  easeIn: createBezierEasing(0.42, 0, 1, 1),
  easeOut: createBezierEasing(0, 0, 0.58, 1),
  easeInOut: createBezierEasing(0.42, 0, 0.58, 1),
  
  // Webflow specific
  webflow: createBezierEasing(0.25, 0.46, 0.45, 0.94),
  
  // Quad
  easeInQuad: createBezierEasing(0.55, 0.085, 0.68, 0.53),
  easeOutQuad: createBezierEasing(0.25, 0.46, 0.45, 0.94),
  easeInOutQuad: createBezierEasing(0.455, 0.03, 0.515, 0.955),
  
  // Cubic
  easeInCubic: createBezierEasing(0.55, 0.055, 0.675, 0.19),
  easeOutCubic: createBezierEasing(0.215, 0.61, 0.355, 1),
  easeInOutCubic: createBezierEasing(0.645, 0.045, 0.355, 1),
  
  // Quart
  easeInQuart: createBezierEasing(0.895, 0.03, 0.685, 0.22),
  easeOutQuart: createBezierEasing(0.165, 0.84, 0.44, 1),
  easeInOutQuart: createBezierEasing(0.77, 0, 0.175, 1),
  
  // Quint
  easeInQuint: createBezierEasing(0.755, 0.05, 0.855, 0.06),
  easeOutQuint: createBezierEasing(0.23, 1, 0.32, 1),
  easeInOutQuint: createBezierEasing(0.86, 0, 0.07, 1),
  
  // Sine
  easeInSine: createBezierEasing(0.47, 0, 0.745, 0.715),
  easeOutSine: createBezierEasing(0.39, 0.575, 0.565, 1),
  easeInOutSine: createBezierEasing(0.445, 0.05, 0.55, 0.95),
  
  // Expo
  easeInExpo: createBezierEasing(0.95, 0.05, 0.795, 0.035),
  easeOutExpo: createBezierEasing(0.19, 1, 0.22, 1),
  easeInOutExpo: createBezierEasing(1, 0, 0, 1),
  
  // Circ
  easeInCirc: createBezierEasing(0.6, 0.04, 0.98, 0.335),
  easeOutCirc: createBezierEasing(0.075, 0.82, 0.165, 1),
  easeInOutCirc: createBezierEasing(0.785, 0.135, 0.15, 0.86),
  
  // Back (with overshoot)
  easeInBack: createBezierEasing(0.6, -0.28, 0.735, 0.045),
  easeOutBack: createBezierEasing(0.175, 0.885, 0.32, 1.275),
  easeInOutBack: createBezierEasing(0.68, -0.55, 0.265, 1.55),
}

// CSS cubic-bezier strings for use in CSS transitions
export const cssEasings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  webflow: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

export type EasingName = keyof typeof easings
