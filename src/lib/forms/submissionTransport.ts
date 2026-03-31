import { getCaptchaProvider } from './captchaProvider'
import { submitFormPayload, type WebsiteFormSubmissionPayload } from '@/api/integrations'

export type LeadSubmissionPayload = WebsiteFormSubmissionPayload

export interface LeadSubmissionResult {
  ok: boolean
}

export const FORM_DELIVERY_ERROR_MESSAGE = 'We could not submit your request right now. Please try again.'

// Phase-1: local stub transport.
// Phase-2: replace this with src/api endpoint integration and include captcha token.
export async function submitLeadCapture(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  const captchaProvider = getCaptchaProvider()
  if (captchaProvider.isEnabled()) {
    await captchaProvider.getToken()
  }
  const result = await submitFormPayload(payload)
  return { ok: result.ok }
}
