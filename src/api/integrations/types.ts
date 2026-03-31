export type IntegrationProvider = 'stub' | 'webhook'

export type WebsiteFormType =
  | 'coming-soon'
  | 'footer-newsletter'
  | 'home-newsletter'
  | 'contact-form'
  | 'hero-contact-form'
  | 'moonshiners-application'
  | 'financing-preapproval'

export interface FormContactPayload {
  fullName?: string
  email?: string
  phone?: string
}

export interface FormConsentPayload {
  legal?: boolean
  marketing?: boolean
}

export interface FinancingResultPayload {
  rank: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  requestedAmount: number
  approvedLimit: number
  eligible: boolean
}

export interface WebsiteFormSubmissionPayload {
  formType: WebsiteFormType
  submittedAt: string
  contact?: FormContactPayload
  consents?: FormConsentPayload
  formSpecificData?: Record<string, unknown>
  financingResult?: FinancingResultPayload
}

export interface IntegrationSubmissionResult {
  ok: boolean
  provider: IntegrationProvider
  error?: string
}
