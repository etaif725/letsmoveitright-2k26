import type {
  IntegrationProvider,
  IntegrationSubmissionResult,
  WebsiteFormSubmissionPayload,
} from './types'

function getProvider(): IntegrationProvider {
  const configured = (import.meta.env.VITE_INTEGRATIONS_PROVIDER ?? 'stub').toLowerCase()
  if (configured === 'webhook') return 'webhook'
  return 'stub'
}

async function submitToStubProvider(
  _payload: WebsiteFormSubmissionPayload
): Promise<IntegrationSubmissionResult> {
  return {
    ok: true,
    provider: 'stub',
  }
}

async function submitToWebhookProvider(
  _payload: WebsiteFormSubmissionPayload
): Promise<IntegrationSubmissionResult> {
  // Phase-1 behavior: accept payloads without external side effects.
  return {
    ok: true,
    provider: 'webhook',
  }
}

export async function submitViaProvider(
  payload: WebsiteFormSubmissionPayload
): Promise<IntegrationSubmissionResult> {
  const provider = getProvider()
  if (provider === 'webhook') {
    return submitToWebhookProvider(payload)
  }
  return submitToStubProvider(payload)
}
