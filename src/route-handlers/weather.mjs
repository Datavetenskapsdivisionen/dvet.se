import fs from "fs";
import { fetchWeatherApi } from 'openmeteo';

let cache = {
    data: null,
    timestamp: null
};

const CACHE_DURATION = 1000 * 60 * 15; // 15 min

const getWeather = async (req, res) => {
    const now = Date.now();

    if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
        return res.status(200).json(cache.data);
    }

    const params = {
        "latitude": 57.6876035,
        "longitude": 11.9783998,
        "current": ["temperature_2m", "is_day", "weather_code"],
        "timezone": "Europe/Berlin",
        "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0).value(),
            isDay: current.variables(1).value(),
            weatherCode: current.variables(2).value(),
            weatherIcon: getWeatherIcon(current.variables(2).value(), current.variables(1).value()),
        },
    };

    cache.data = weatherData;
    cache.timestamp = now;

    res.status(200).json(weatherData);
};

const getWeatherIcon = (weatherCode, isDay) => {
    const wmoCodes = JSON.parse(fs.readFileSync("./wmo_codes.json"));
    if (isDay) {
        return wmoCodes[weatherCode].day.image;
    } else {
        return wmoCodes[weatherCode].night.image;
    }
};

export { getWeather };
