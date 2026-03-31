export {};

declare global {
  interface Window {
    google?: typeof google;
    __gmapsCallback?: () => void;
  }
}
