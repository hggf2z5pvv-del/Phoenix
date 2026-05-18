type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
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

async function getLondonWeather() {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius",
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to fetch London weather");
  }

  return (await response.json()) as WeatherData;
}

export default async function Home() {
  let weather: WeatherData | null = null;
  let error = false;

  try {
    weather = await getLondonWeather();
  } catch {
    error = true;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 px-6 py-12 font-sans text-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/40">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
            Current weather
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            London
          </h1>
        </div>

        {error || !weather ? (
          <div className="rounded-2xl bg-red-50 p-5 text-red-900 dark:bg-red-950/50 dark:text-red-100">
            <h2 className="text-lg font-semibold">Weather unavailable</h2>
            <p className="mt-2 text-sm leading-6">
              Sorry, we could not load the latest London weather right now.
              Please try again soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-7xl font-bold tracking-tighter">
                {Math.round(weather.current.temperature_2m)}°C
              </p>
              <p className="mt-3 text-xl text-slate-700 dark:text-slate-300">
                {getWeatherDescription(weather.current.weather_code)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </>
        )}
      </section>
    </main>
  );
}
