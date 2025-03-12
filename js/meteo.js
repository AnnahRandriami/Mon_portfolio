document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "cfd6068f95494a30b0c7af04fbfc7e16"; // Ta clé API Weatherbit
  const weatherInfo = document.getElementById("weather-info");
  const weatherAnimation = document.getElementById("weather-animation");

  // Fonction pour mettre à jour l'interface avec les données météo
  function updateWeatherUI(
    cityName,
    temperature,
    windSpeed,
    weatherDescription
  ) {
    document.getElementById("city-name").textContent = `📍 ${cityName}`;
    document.getElementById("temperature").textContent = `🌡️ ${temperature}°C`;
    document.getElementById("wind-speed").textContent = `💨 ${windSpeed} km/h`;

    // Modifier l'affichage selon l'état de la météo
    let weatherStatus = "";
    if (weatherDescription.includes("clear")) {
      weatherStatus = "☀️ Soleil";
    } else if (weatherDescription.includes("cloudy")) {
      weatherStatus = "☁️ Couvert";
    } else if (weatherDescription.includes("rain")) {
      weatherStatus = "🌧️ Pluie";
    } else {
      weatherStatus = "🌤️ Temps variable";
    }

    document.getElementById("weather-status").textContent = weatherStatus;
    // Effacer les classes précédentes
    weatherAnimation.className = "";
  }

  // Fonction pour récupérer les données météo à partir de l'API
  function fetchWeather(lat, lon) {
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}&lang=fr&units=M`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weather = data.data[0];
        // Récupérer la description de la météo
        const weatherDescription = weather.weather.description.toLowerCase();
        // Mettre à jour l'UI avec les données récupérées
        updateWeatherUI(
          weather.city_name,
          weather.temp,
          weather.wind_spd,
          weatherDescription
        );
        // Stocker les données dans le localStorage
        localStorage.setItem(
          "weatherData",
          JSON.stringify({
            cityName: weather.city_name,
            temperature: weather.temp,
            windSpeed: weather.wind_spd,
            weatherDescription: weatherDescription,
          })
        );
        //test console
        console.log("Données récupérées de l'API : ", data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des données météo:",
          error
        );
      });
  }

  // Vérifier si des données météo sont stockées dans le localStorage
  const storedWeather = localStorage.getItem("weatherData");

  if (storedWeather) {
    // Si des données sont présentes, les afficher directement
    const weather = JSON.parse(storedWeather);
    updateWeatherUI(
      weather.cityName,
      weather.temperature,
      weather.windSpeed,
      weather.weatherDescription
    );
  } else {
    // Demande la géolocalisation uniquement si aucune donnée n'est stockée
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          fetchWeather(43.2965, 5.3698); // Coordonnées par défaut (Marseille)
        }
      );
    } else {
      fetchWeather(43.2965, 5.3698); // Coordonnées par défaut (Marseille)
    }
  }
});
