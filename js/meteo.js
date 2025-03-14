document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "cfd6068f95494a30b0c7af04fbfc7e16"; // Clé API Weatherbit
  const weatherInfo = document.getElementById("weather-info");
  const weatherAnimation = document.getElementById("weather-animation");

  function getWeatherDescription(code) {
    const weatherConditions = {
      200: "⛈️ Orage avec pluie légère",
      201: "⛈️ Orage avec pluie",
      202: "⛈️ Orage avec forte pluie",
      230: "⛈️ Orage avec bruine légère",
      231: "⛈️ Orage avec bruine",
      232: "⛈️ Orage avec forte bruine",
      300: "🌧️ Bruine légère",
      301: "🌧️ Bruine",
      302: "🌧️ Forte bruine",
      500: "🌦️ Pluie légère",
      501: "🌧️ Pluie modérée",
      502: "🌧️ Pluie forte",
      511: "🌨️ Pluie verglaçante",
      520: "🌧️ Averses légères",
      521: "🌧️ Averses",
      522: "🌧️ Fortes averses",
      600: "❄️ Neige légère",
      601: "❄️ Neige",
      602: "❄️ Forte neige",
      610: "🌨️ Neige fondue",
      611: "🌨️ Neige fondante",
      621: "❄️ Averses de neige",
      622: "❄️ Fortes averses de neige",
      700: "🌫️ Brouillard",
      711: "🌫️ Fumée",
      721: "🌫️ Brume",
      731: "🌪️ Tempête de sable",
      741: "🌫️ Brouillard dense",
      751: "🌪️ Sable en suspension",
      800: "☀️ Ciel dégagé",
      801: "⛅ Quelques nuages",
      802: "🌥️ Nuages épars",
      803: "☁️ Nuageux",
      804: "☁️ Couvert",
    };
    return weatherConditions[code] || "🌦️ Temps variable";
  }

  function updateWeatherUI(cityName, temperature, windSpeed, weatherCode) {
    document.getElementById("city-name").textContent = `📍 ${cityName}`;
    document.getElementById("temperature").textContent = `🌡️ ${temperature}°C`;
    document.getElementById("wind-speed").textContent = `💨 ${windSpeed} km/h`;
    document.getElementById("weather-status").textContent =
      getWeatherDescription(weatherCode);

    // Effacer les classes précédentes
    weatherAnimation.className = "";
  }

  function fetchWeather(lat, lon) {
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}&lang=fr&units=M`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weather = data.data[0];
        updateWeatherUI(
          weather.city_name,
          weather.temp,
          weather.wind_spd,
          weather.weather.code
        );
        console.log("Données météo récupérées :", data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données météo:",
          error
        );
      });
  }

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        fetchWeather(43.2965, 5.3698); // Marseille par défaut
      }
    );
  } else {
    fetchWeather(43.2965, 5.3698);
  }
});
