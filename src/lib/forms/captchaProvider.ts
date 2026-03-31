export interface CaptchaProvider {
  isEnabled: () => boolean
  getClientKey: () => string
  getToken: () => Promise<string | null>
}

const noopCaptchaProvider: CaptchaProvider = {
  isEnabled: () => Boolean(import.meta.env.VITE_ENABLE_TURNSTILE === 'true'),
  getClientKey: () => import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '',
  getToken: async () => null,
}

export function getCaptchaProvider(): CaptchaProvider {
  return noopCaptchaProvider
}
