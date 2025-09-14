"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Sun, Cloud, Wind, Thermometer, Droplets, Target, Zap } from "lucide-react"
import Script from "next/script"

interface InteractiveMapProps {
  onLocationSelect: (latitude: number, longitude: number) => void
  selectedLatitude?: number
  selectedLongitude?: number
  disabled?: boolean
}

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  cloudCover: number
  solarRadiation: number
  pressure: number
}

export function InteractiveMap({
  onLocationSelect,
  selectedLatitude,
  selectedLongitude,
  disabled = false,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  // Generate weather data based on location
  const generateWeatherData = (lat: number, lng: number): WeatherData => {
    const baseTemp = 20 + (Math.abs(lat) - 30) * -0.5
    const seasonalVariation =
      10 * Math.sin((Date.now() / (1000 * 60 * 60 * 24 * 365)) * 2 * Math.PI)
    const temperature = baseTemp + seasonalVariation + (Math.random() - 0.5) * 5

    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const solarDeclination =
      23.45 * Math.sin(((360 * (284 + dayOfYear)) / 365) * (Math.PI / 180))
    const solarElevation =
      Math.asin(
        Math.sin((lat * Math.PI) / 180) * Math.sin((solarDeclination * Math.PI) / 180) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((solarDeclination * Math.PI) / 180) *
            Math.cos(0),
      ) *
      (180 / Math.PI)

    const maxRadiation = 1000
    const solarRadiation = Math.max(0, maxRadiation * Math.sin((solarElevation * Math.PI) / 180))

    return {
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round((30 + Math.random() * 40) * 10) / 10,
      windSpeed: Math.round((2 + Math.random() * 6) * 10) / 10,
      cloudCover: Math.round(Math.random() * 30),
      solarRadiation: Math.round(solarRadiation * 10) / 10,
      pressure: Math.round((1013 + (Math.random() - 0.5) * 20) * 10) / 10,
    }
  }

  // Initialize the map once Google Maps script loads
  const initMap = () => {
    if (!mapRef.current || googleMapRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: selectedLatitude || 0, lng: selectedLongitude || 0 },
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      streetViewControl: false,
    })

    googleMapRef.current = map
    setMapLoaded(true)

    // Handle click
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (disabled || !event.latLng) return

      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      onLocationSelect(lat, lng)
      setWeatherData(generateWeatherData(lat, lng))

        if (markerRef.current) {
          markerRef.current.setMap(null)
          markerRef.current = null
        }


      // Create new marker
      const newMarker = new google.maps.Marker({
        position: { lat, lng },
        map,
        animation: google.maps.Animation.DROP,
        title: "Selected Location",
      })
      markerRef.current = newMarker
    })
  }

  console.log("Deleting old marker:", markerRef.current)
  // Update marker if props change
  useEffect(() => {
    if (googleMapRef.current && selectedLatitude && selectedLongitude) {
      const position = new google.maps.LatLng(selectedLatitude, selectedLongitude)

      if (markerRef.current) {
        markerRef.current.setMap(null)
      }

      markerRef.current = new google.maps.Marker({
        position,
        map: googleMapRef.current,
        animation: google.maps.Animation.DROP,
        title: "Selected Location",
      })

      googleMapRef.current.panTo(position)
    }
  }, [selectedLatitude, selectedLongitude])

  return (
    <div className="space-y-4">
      {/* Load Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap`}
        strategy="afterInteractive"
        onLoad={initMap}
        onError={() => setMapLoaded(false)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Location Selector
          </CardTitle>
          <CardDescription>
            Click anywhere on the map to select your location for solar prediction analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div
              ref={mapRef}
              className="relative w-full h-96 rounded-lg border-2 border-border overflow-hidden"
              style={{ width: "100%", height: "400px" }}
            />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-primary animate-pulse">Loading Google Maps...</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weather Preview */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather Preview
            </CardTitle>
            <CardDescription>
              Estimated weather conditions for the selected location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="text-lg font-bold text-red-600">{weatherData.temperature}°C</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Wind Speed</div>
                  <div className="text-lg font-bold text-blue-600">{weatherData.windSpeed} m/s</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <Droplets className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="text-lg font-bold text-cyan-600">{weatherData.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Solar Radiation</div>
                  <div className="text-lg font-bold text-yellow-600">{weatherData.solarRadiation} W/m²</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-lg border border-accent/30">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-accent">How to Use the World Map</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Click anywhere on the map to select your location</li>
          <li>• The red marker shows your selected coordinates</li>
          <li>• Weather preview updates based on your selection</li>
        </ul>
      </div>
    </div>
  )
}
