const wrapper = document.querySelector(".wrapper");
const msgTxt = document.querySelector(".msg-txt");
const inputField = document.querySelector("#cityInput");
const getWeatherBtn = document.querySelector("#getWeatherBtn");
const weatherPart = document.querySelector(".weather-part");
const weatherIcon = document.querySelector("#weatherIcon");
const temperatureElement = document.querySelector("#temperature");
const weatherDescriptionElement = document.querySelector("#weatherDescription");
const locationElement = document.querySelector("#location");
const feelsLikeTemperatureElement = document.querySelector(
  "#feelsLikeTemperature"
);
const humidityElement = document.querySelector("#humidity");
const arrowBack = document.querySelector("header i");

const apiKey = "466c356b7c61ed8c98b8eb8295b662e2"; // Substitua com a sua chave de API do OpenWeatherMap

getWeatherBtn.addEventListener("click", getWeather);
inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

function getWeather() {
  const city = inputField.value.trim();
  if (city === "") {
    return getCurrentLocationWeather();
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetchWeatherData(apiUrl);
}

function fetchWeatherData(apiUrl) {
  msgTxt.textContent = "Getting weather details...";
  msgTxt.classList.add("pending");

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        showWeatherData(data);
      } else {
        showError(data.message);
      }
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
      showError("Something went wrong. Please try again.");
    });
}

function getWeatherIcon(id) {
  if (id == 800) {
    return (weatherIcon.src = "icons/clear.svg");
  } else if (id >= 200 && id <= 232) {
    return (weatherIcon.src = "icons/storm.svg");
  } else if (id >= 600 && id <= 622) {
    return (weatherIcon.src = "icons/snow.svg");
  } else if (id >= 701 && id <= 781) {
    return (weatherIcon.src = "icons/haze.svg");
  } else if (id >= 801 && id <= 804) {
    return (weatherIcon.src = "icons/cloud.svg");
  } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
    return (weatherIcon.src = "icons/rain.svg");
  }
}

function showWeatherData(data) {
  const { name, sys, weather, main } = data;

  const icon = getWeatherIcon(weather[0].id);

  weatherIcon.src = icon;
  temperatureElement.textContent = Math.round(main.temp);
  weatherDescriptionElement.textContent = weather[0].description;
  locationElement.textContent = `${name}, ${sys.country}`;
  feelsLikeTemperatureElement.textContent = Math.round(main.feels_like);
  humidityElement.textContent = `${main.humidity}%`;

  msgTxt.textContent = "";
  msgTxt.classList.remove("pending");
  wrapper.classList.add("active");
  clearInput();
}

function showError(message) {
  msgTxt.textContent = message;
  msgTxt.classList.add("error");
}

function clearInput() {
  inputField.value = "";
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    msgTxt.textContent = "Getting current location...";
    msgTxt.classList.add("pending");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        fetchWeatherData(apiUrl);
      },
      (error) => {
        console.log("Error getting current location:", error);
        showError("Could not get current location. Please try again.");
      }
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
}
