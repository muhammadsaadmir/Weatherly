const axios = require('axios');
const WEATHERSTACK_API_KEY = process.env.WEATHER_API_KEY;

async function getWeather(city) {
  try {
    const response = await axios.get(`http://api.weatherstack.com/current`, {
      params: {
        access_key: WEATHERSTACK_API_KEY,
        query: city
      }
    });

    const data = response.data;
    console.log('Weather API response:', data);

    if (!data || !data.current || !data.location) return null;

    return {
      name: data.location.name,
      temp: data.current.temperature,
      humidity: data.current.humidity,
      description: data.current.weather_descriptions[0],
      is_day: data.current.is_day === "yes",
      time: data.location.localtime,
      icon: data.current.weather_icons[0]
    };
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    return null;
  }
}

module.exports = { getWeather };
