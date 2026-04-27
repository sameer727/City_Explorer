import axios from 'axios';

const GEO_URL = 'https://nominatim.openstreetmap.org/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 10 * 60 * 1000;
const LOCATION_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const weatherCache = new Map();
const locationCache = new Map();

const WEATHER_LABELS = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

function getCacheKey(attraction) {
  return attraction?._id || `${attraction?.name || ''}|${attraction?.cityName || ''}`;
}

function getWeatherLabel(code) {
  return WEATHER_LABELS[code] || 'Unknown conditions';
}

async function geocodePlace(query) {
  const response = await axios.get(GEO_URL, {
    params: {
      q: query,
      format: 'jsonv2',
      addressdetails: 1,
      countrycodes: 'in',
      limit: 1
    }
  });

  const best = response.data?.[0];
  if (!best?.lat || !best?.lon) {
    return null;
  }

  return {
    latitude: Number(best.lat),
    longitude: Number(best.lon)
  };
}

export async function fetchCurrentWeatherForAttraction(attraction) {
  if (!attraction) return null;

  const cacheKey = getCacheKey(attraction);
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.value;
  }

  try {
    const location = await fetchCoordinatesForAttraction(attraction);

    if (!location) {
      return null;
    }

    const weatherResponse = await axios.get(WEATHER_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: ['temperature_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m'],
        timezone: 'auto'
      }
    });

    const current = weatherResponse.data?.current;
    if (!current) {
      return null;
    }

    const value = {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      weatherCode: current.weather_code,
      conditionLabel: getWeatherLabel(current.weather_code),
      windSpeed: current.wind_speed_10m,
      fetchedAt: Date.now()
    };

    weatherCache.set(cacheKey, { value, timestamp: Date.now() });
    return value;
  } catch {
    return null;
  }
}

export async function fetchCoordinatesForAttraction(attraction) {
  if (!attraction) return null;

  const cacheKey = getCacheKey(attraction);
  const cached = locationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < LOCATION_CACHE_TTL_MS) {
    return cached.value;
  }

  try {
    const placeQueries = [
      `${attraction.name}, ${attraction.cityName}, India`,
      `${attraction.name}, ${attraction.cityName}`,
      `${attraction.name}, India`,
      `${attraction.cityName}, India`
    ];

    let location = null;
    for (const query of placeQueries) {
      // Nominatim resolves known landmarks better with targeted fallbacks.
      location = await geocodePlace(query);
      if (location) break;
    }

    if (!location) {
      return null;
    }

    locationCache.set(cacheKey, {
      value: location,
      timestamp: Date.now()
    });

    return location;
  } catch {
    return null;
  }
}
