const arrowBack = document.querySelector("header i");

const inputCard = document.querySelector(".input-card");
const messageText = document.querySelector(".input-card_message__text");
const inputField = document.querySelector("#input-card-input");
const weatherBtn = document.querySelector("#input-card_button");

const weatherCard = document.querySelector(".weather-card");
const weatherIcon = document.querySelector("#weather-card_icon");
const temperatureElement = document.querySelector(".weather-card_temperature");
const weatherElement = document.querySelector(".weather-card_weather");
const locationElement = document.querySelector("#weather-card_location__text");
const feelsElement = document.querySelector("#weather-card_action__feels");
const humidityElement = document.querySelector(
  "#weather-card_action__humidity"
);

const apiKey = "466c356b7c61ed8c98b8eb8295b662e2";

weatherBtn.addEventListener("click", getWeather);
inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

arrowBack.addEventListener("click", () => {
  showInputCard();
});

function showInputCard() {
  weatherCard.classList.remove("active");
  inputCard.classList.remove("hidden");
  inputCard.classList.add("active");
  arrowBack.classList.remove("active");
}

function getWeather() {
  const city = inputField.value.trim();
  if (city === "") {
    return getCurrentLocationWeather();
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchWeatherData(apiUrl);
}

function fetchWeatherData(apiUrl) {
  showLoadingMessage("Getting weather details...");
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

function showWeatherData(data) {
  const { name, sys, weather, main } = data;
  const icon = getWeatherIcon(weather[0].id);

  weatherIcon.src = icon;
  temperatureElement.textContent = `${Math.round(main.temp)}°C`;
  weatherElement.textContent = weather[0].description.toUpperCase();
  locationElement.textContent = `${name}, ${sys.country}`;
  feelsElement.textContent = `${Math.round(main.feels_like)}°C`;
  humidityElement.textContent = `${main.humidity}%`;

  hideMessage();
  showWeatherCard();
}

function showWeatherCard() {
  inputCard.classList.remove("active");
  inputCard.classList.add("hidden");

  arrowBack.classList.add("active");

  weatherCard.classList.add("active");
}

function showLoadingMessage(message) {
  messageText.textContent = message;
  messageText.classList.add("pending");
}

function showError(message) {
  messageText.textContent = message;
  messageText.classList.add("error");
}

function hideMessage() {
  messageText.textContent = "";
  messageText.classList.remove("pending", "error");
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    showLoadingMessage("Getting current location...");
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

function getWeatherIcon(id) {
  switch (true) {
    case id == 800:
      return "icons/clear.svg";
    case id >= 200 && id <= 232:
      return "icons/storm.svg";
    case id >= 600 && id <= 622:
      return "icons/snow.svg";
    case id >= 701 && id <= 781:
      return "icons/haze.svg";
    case id >= 801 && id <= 804:
      return "icons/cloud.svg";
    case (id >= 500 && id <= 531) || (id >= 300 && id <= 321):
      return "icons/rain.svg";
    default:
      return "icons/cloud.svg";
  }
}
