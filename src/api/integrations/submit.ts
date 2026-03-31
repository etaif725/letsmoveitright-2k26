import { submitViaProvider } from './providers'
import type { IntegrationSubmissionResult, WebsiteFormSubmissionPayload } from './types'

export async function submitFormPayload(
  payload: WebsiteFormSubmissionPayload
): Promise<IntegrationSubmissionResult> {
  return submitViaProvider(payload)
}
