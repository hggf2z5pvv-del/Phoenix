"use client";

import { useEffect, useState } from "react";

const LONDON_COORDS = {
  lat: 51.5074,
  lon: -0.1278,
};

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
};

type ReverseGeocodingData = {
  results?: Array<{
    name?: string;
  }>;
};

function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) {
    return ["Mostly clear", "Partly cloudy", "Overcast"][code - 1];
  }
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";

  return "Unknown conditions";
}

async function getWeather(lat: number, lon: number) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather");
  }

  return (await response.json()) as WeatherData;
}

async function getPlaceName(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`,
    );

    if (!response.ok) {
      return "Your location";
    }

    const data = (await response.json()) as ReverseGeocodingData;
    return data.results?.[0]?.name || "Your location";
  } catch {
    return "Your location";
  }
}

export default function Home() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [place, setPlace] = useState("Your location");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fallbackNote, setFallbackNote] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadWeatherForLocation(
      nextLat: number,
      nextLon: number,
      note = "",
    ) {
      if (!isMounted) return;

      setLoading(true);
      setError("");
      setFallbackNote(note);
      setLat(nextLat);
      setLon(nextLon);

      try {
        const [weatherData, placeName] = await Promise.all([
          getWeather(nextLat, nextLon),
          getPlaceName(nextLat, nextLon),
        ]);

        if (!isMounted) return;

        setWeather(weatherData);
        setPlace(placeName);
      } catch {
        if (!isMounted) return;

        setWeather(null);
        setPlace(note ? "London" : "Your location");
        setError("We could not load the latest weather. Please try again soon.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    function loadLondonFallback() {
      void loadWeatherForLocation(
        LONDON_COORDS.lat,
        LONDON_COORDS.lon,
        "Using London as fallback - enable location access for local weather",
      );
    }

    if (!("geolocation" in navigator)) {
      loadLondonFallback();
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          void loadWeatherForLocation(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        () => {
          loadLondonFallback();
        },
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const mapSrc =
    lat !== null && lon !== null
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}`
      : "";

  const description = weather
    ? getWeatherDescription(weather.current.weather_code)
    : "Weather details unavailable";

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-4 py-10 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center gap-6">
        <section className="rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
              Current weather
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {loading ? "Finding you" : place}
            </h1>
            {fallbackNote ? (
              <p className="mt-3 rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
                {fallbackNote}
              </p>
            ) : null}
          </div>

          {loading ? (
            <div className="rounded-2xl bg-blue-50 p-5 text-blue-950 dark:bg-white/10 dark:text-blue-100">
              <p className="text-lg font-medium">Detecting your location...</p>
              <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-100/80">
                We will use your position to show local weather and a nearby
                map.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-5 text-red-900 dark:bg-red-950/50 dark:text-red-100">
              <h2 className="text-lg font-semibold">Weather unavailable</h2>
              <p className="mt-2 text-sm leading-6">{error}</p>
            </div>
          ) : weather ? (
            <>
              <div className="mb-8">
                <p className="text-7xl font-bold tracking-tighter sm:text-8xl">
                  {Math.round(weather.current.temperature_2m)}°C
                </p>
                <p className="mt-3 text-xl text-slate-700 dark:text-slate-300">
                  {description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-white/10">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Humidity
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {weather.current.relative_humidity_2m}%
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-white/10">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Wind speed
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {weather.current.wind_speed_10m} km/h
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-white/10">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Conditions
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{description}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-slate-100 p-5 text-slate-800 dark:bg-white/10 dark:text-slate-100">
              <p>Weather details are not available right now.</p>
            </div>
          )}
        </section>

        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40">
          {lat !== null && lon !== null ? (
            <iframe
              src={mapSrc}
              className="h-96 w-full rounded-2xl border-0"
              title={`Map centered on ${place}`}
            />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-2xl bg-blue-50 text-blue-950 dark:bg-white/10 dark:text-blue-100">
              Detecting your location...
            </div>
          )}
          <div className="mt-3 flex flex-col gap-1 px-1 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <span>Map data from OpenStreetMap</span>
            {lat !== null && lon !== null ? (
              <span>
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
