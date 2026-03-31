import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

export function useGooglePlaces(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setLoaded(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
    }

    if (!API_KEY) {
      console.warn(
        "VITE_GOOGLE_MAPS_API_KEY is not set. Add it to your .env file."
      );
      return;
    }

    window.__gmapsCallback = () => setLoaded(true);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async&callback=__gmapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return loaded;
}
