import { useEffect, useRef, type RefObject } from "react";
import type { ParsedPlace } from "@/types";

interface UsePlacesAutocompleteOptions {
  inputRef: RefObject<HTMLInputElement | null>;
  enabled: boolean;
  onSelect: (place: ParsedPlace) => void;
  types?: string[];
}

function extractComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
): google.maps.GeocoderAddressComponent | undefined {
  return components.find((c) => c.types.includes(type));
}

export function usePlacesAutocomplete({
  inputRef,
  enabled,
  onSelect,
  types = ["(regions)"],
}: UsePlacesAutocompleteOptions): void {
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!enabled || !inputRef.current || acRef.current) return;
    if (!window.google?.maps?.places?.Autocomplete) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types,
      componentRestrictions: { country: "us" },
      fields: ["address_components", "formatted_address", "geometry"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place?.address_components) return;

      const parts = place.address_components;
      const get = (t: string) => extractComponent(parts, t);

      onSelect({
        formatted: place.formatted_address ?? "",
        city:
          get("locality")?.long_name ??
          get("sublocality")?.long_name ??
          get("administrative_area_level_3")?.long_name ??
          "",
        state: get("administrative_area_level_1")?.short_name ?? "",
        zip: get("postal_code")?.long_name ?? "",
        country: get("country")?.short_name ?? "",
      });
    });

    acRef.current = ac;
  }, [enabled, inputRef, onSelect, types]);
}
