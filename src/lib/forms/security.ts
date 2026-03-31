import { useRef, useState } from 'react'

export type FormGuardFailureReason = 'bot_detected' | 'submitted_too_fast' | 'cooldown_active'

export interface FormGuardResult {
  ok: boolean
  reason?: FormGuardFailureReason
}

interface UseFormGuardOptions {
  minSubmitDelayMs?: number
  cooldownMs?: number
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(normalizeEmail(value))
}

export function getFormGuardMessage(reason: FormGuardFailureReason): string {
  if (reason === 'bot_detected') return 'We could not verify your submission. Please try again.'
  if (reason === 'submitted_too_fast') return 'Please take a moment to review your information and submit again.'
  return 'Please wait a few seconds before submitting again.'
}

export function useFormGuard(options: UseFormGuardOptions = {}) {
  const minSubmitDelayMs = options.minSubmitDelayMs ?? 1200
  const cooldownMs = options.cooldownMs ?? 8000

  const [honeypot, setHoneypot] = useState('')
  const startedAtRef = useRef(Date.now())
  const cooldownUntilRef = useRef(0)

  const evaluateSubmission = (): FormGuardResult => {
    const now = Date.now()
    if (now < cooldownUntilRef.current) {
      return { ok: false, reason: 'cooldown_active' }
    }
    const isSubmittedTooFast = now - startedAtRef.current < minSubmitDelayMs
    if (isSubmittedTooFast && honeypot.trim()) {
      // Autofill tools can occasionally populate hidden fields; only fail if it is also an instant submission.
      return { ok: false, reason: 'bot_detected' }
    }
    if (isSubmittedTooFast) {
      return { ok: false, reason: 'submitted_too_fast' }
    }
    return { ok: true }
  }

  const markSubmitted = () => {
    const now = Date.now()
    cooldownUntilRef.current = now + cooldownMs
    startedAtRef.current = now
    setHoneypot('')
  }

  const resetGuard = () => {
    startedAtRef.current = Date.now()
    setHoneypot('')
  }

  return {
    honeypot,
    setHoneypot,
    evaluateSubmission,
    markSubmitted,
    resetGuard,
  }
}
