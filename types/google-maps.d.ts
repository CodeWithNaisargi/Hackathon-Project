// Type definitions for Google Maps JavaScript API
declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        setMapTypeId(mapTypeId: string): void;
        panTo(latLng: LatLng | LatLngLiteral): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setPosition(latLng: LatLng | LatLngLiteral): void;
        setMap(map: Map | null): void;
      }

      class LatLng {
        constructor(lat: number, lng: number, noWrap?: boolean);
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeId?: string;
        mapTypeControl?: boolean;
        fullscreenControl?: boolean;
        streetViewControl?: boolean;
      }

      interface MarkerOptions {
        position?: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        animation?: Animation;
      }

      interface MapsEventListener {
        remove(): void;
      }

      interface MapMouseEvent {
        latLng?: LatLng;
      }

      enum Animation {
        BOUNCE,
        DROP
      }

      enum MapTypeId {
        ROADMAP,
        SATELLITE,
        HYBRID,
        TERRAIN
      }
    }
  }
}

export {};