document.addEventListener("DOMContentLoaded", function () {
  const defaultLat = 43.2965; // Latitude de Marseille
  const defaultLon = 5.3698; // Longitude de Marseille
  const weatherAnimation = document.getElementById("weather-animation");

  // Fonction pour obtenir la description de la météo
  function getWeatherDescription(code) {
    const weatherConditions = {
      0: "☀️ Ciel dégagé",
      1: "🌤️ Peu nuageux",
      2: "⛅ Partiellement nuageux",
      3: "☁️ Couvert",
      45: "🌫️ Brouillard",
      48: "🌫️ Brouillard givrant",
      51: "🌦️ Bruine légère",
      53: "🌧️ Bruine modérée",
      55: "🌧️ Bruine dense",
      61: "🌦️ Pluie légère",
      63: "🌧️ Pluie modérée",
      65: "🌧️ Pluie forte",
      71: "❄️ Neige légère",
      73: "❄️ Neige modérée",
      75: "❄️ Neige forte",
      80: "🌦️ Averses légères",
      81: "🌧️ Averses modérées",
      82: "🌧️ Averses fortes",
    };
    return weatherConditions[code] || "🌦️ Temps variable";
  }

  // Fonction pour mettre à jour l'interface utilisateur avec la météo
  function updateWeatherUI(cityName, temperature, windSpeed, weatherCode) {
    document.getElementById("city-name").textContent = `📍 ${cityName}`;
    document.getElementById("temperature").textContent = `🌡️ ${temperature}°C`;
    document.getElementById("wind-speed").textContent = `💨 ${windSpeed} km/h`;
    document.getElementById("weather-status").textContent =
      getWeatherDescription(weatherCode);

    // Effacer les classes précédentes
    weatherAnimation.className = "";
  }

  // Fonction pour récupérer le nom de la ville via une API de géocodage (ex: Nominatim)
  function getCityNameFromCoordinates(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.address && data.address.city) {
          return data.address.city;
        } else if (data && data.address && data.address.town) {
          return data.address.town;
        } else {
          return "Ville inconnue";
        }
      })
      .catch(() => "Ville inconnue");
  }

  // Fonction pour récupérer les données météo
  function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weather = data.current_weather;
        getCityNameFromCoordinates(lat, lon).then((cityName) => {
          updateWeatherUI(
            cityName,
            weather.temperature,
            weather.windspeed,
            weather.weathercode
          );
        });

        console.log("Données météo récupérées :", data);

        // Stocker la localisation en localStorage avec la date
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem("weather_lat", lat);
        localStorage.setItem("weather_lon", lon);
        localStorage.setItem("weather_date", today);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données météo:",
          error
        );
      });
  }

  // Fonction pour récupérer la position de l'utilisateur
  function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Géolocalisation refusée ou erreur:", error);
          localStorage.setItem("weather_denied", "true"); // Stocker le refus
          fetchWeather(defaultLat, defaultLon); // Charger Marseille
        }
      );
    } else {
      fetchWeather(defaultLat, defaultLon); // Si pas de support, charger Marseille
    }
  }

  // Vérifier si l'utilisateur a refusé la géolocalisation
  const weatherDenied = localStorage.getItem("weather_denied");
  const savedLat = localStorage.getItem("weather_lat");
  const savedLon = localStorage.getItem("weather_lon");
  const savedDate = localStorage.getItem("weather_date");
  const today = new Date().toISOString().split("T")[0];

  if (weatherDenied === "true") {
    console.log(
      "L'utilisateur a refusé la géolocalisation. Utilisation de Marseille."
    );
    fetchWeather(defaultLat, defaultLon);
  } else if (savedLat && savedLon && savedDate === today) {
    console.log("Utilisation de la localisation enregistrée.");
    fetchWeather(savedLat, savedLon);
  } else {
    getUserLocation();
  }
});
