const apiKey = CONFIG.API_KEY;

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");

const greeting = document.getElementById("greeting");
const clock = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    minutes = minutes < 10 ? "0" + minutes : minutes;

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    clock.textContent = `${hours}:${minutes} ${period}`;

    const currentHour = now.getHours();

    if (currentHour < 12) {
        greeting.textContent = "Good Morning";
    } else if (currentHour < 18) {
        greeting.textContent = "Good Afternoon";
    } else {
        greeting.textContent = "Good Evening";
    }
}

updateClock();
setInterval(updateClock, 1000);

async function getWeather(city) {

    try {

        cityName.textContent = "Loading...";

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        console.log(data);

        cityName.textContent = data.name;
        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        condition.textContent =
            data.weather[0].main;

        humidity.textContent =
            `${data.main.humidity}%`;

        wind.textContent =
            `${data.wind.speed} km/h`;

        feelsLike.textContent =
            `${Math.round(data.main.feels_like)}°C`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (error) {

        cityName.textContent = "City not found";
        temperature.textContent = "--";
        condition.textContent = error.message;
        humidity.textContent = "--";
        wind.textContent = "--";
        feelsLike.textContent = "--";
        weatherIcon.src = "";
    }
}

async function getWeatherByCoords(lat, lon) {

    try {

        cityName.textContent = "Loading...";

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const response = await fetch(url);

        const data = await response.json();

        cityName.textContent = data.name;

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        condition.textContent =
            data.weather[0].main;

        humidity.textContent =
            `${data.main.humidity}%`;

        wind.textContent =
            `${data.wind.speed} km/h`;

        feelsLike.textContent =
            `${Math.round(data.main.feels_like)}°C`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (error) {

        cityName.textContent =
            "Unable to fetch location weather";
    }
}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
    }
});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        searchBtn.click();
    }
});

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getWeatherByCoords(lat, lon);
        },

        () => {
            alert("Location access denied");
        }
    );
});

getWeather("Visakhapatnam");