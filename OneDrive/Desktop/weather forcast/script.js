document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');
  const cityName = document.getElementById('city-name');
  const currentTemp = document.getElementById('current-temp');
  const weatherDescription = document.getElementById('weather-description');
  const weatherIcon = document.getElementById('weather-icon');
  const feelsLike = document.getElementById('feels-like');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const pressure = document.getElementById('pressure');
  const forecastContainer = document.getElementById('forecast');
  const lastUpdated = document.getElementById('last-updated');
  const celsiusBtn = document.getElementById('celsius');
  const fahrenheitBtn = document.getElementById('fahrenheit');

  // API Key - Replace with your actual OpenWeatherMap API key
  const apiKey = '9110aabf25fb89d0802c4f270ab44ee1';
  let currentUnit = 'metric'; // Default to Celsius

  // Event Listeners
  searchBtn.addEventListener('click', fetchWeather);
  locationBtn.addEventListener('click', getLocationWeather);
  cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  });

  celsiusBtn.addEventListener('click', function () {
    if (!celsiusBtn.classList.contains('active')) {
      toggleUnit('celsius');
    }
  });

  fahrenheitBtn.addEventListener('click', function () {
    if (!fahrenheitBtn.classList.contains('active')) {
      toggleUnit('fahrenheit');
    }
  });

  // Functions
  function fetchWeather() {
    const city = cityInput.value.trim();
    if (city === '') {
      showError('Please enter a city name');
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;

    showLoading();
    clearError();

    // Fetch current weather
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data);
        // Fetch forecast after current weather
        return fetch(forecastUrl);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Forecast not available');
        }
        return response.json();
      })
      .then(data => {
        displayForecast(data);
        hideLoading();
        updateLastUpdated();
      })
      .catch(error => {
        showError(error.message);
        hideLoading();
      });
  }

  function getLocationWeather() {
    if (navigator.geolocation) {
      showLoading();
      clearError();
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;

          // Fetch current weather
          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Location weather not available');
              }
              return response.json();
            })
            .then(data => {
              displayWeather(data);
              cityInput.value = data.name; // Update input with location city
              // Fetch forecast after current weather
              return fetch(forecastUrl);
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Forecast not available');
              }
              return response.json();
            })
            .then(data => {
              displayForecast(data);
              hideLoading();
              updateLastUpdated();
            })
            .catch(error => {
              showError(error.message);
              hideLoading();
            });
        },
        error => {
          showError('Geolocation is not supported or permission denied');
          hideLoading();
        }
      );
    } else {
      showError('Geolocation is not supported by your browser');
    }
  }

  function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentTemp.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Update weather details
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnit === 'metric' ? 'km/h' : 'mph';

    feelsLike.textContent = `${Math.round(data.main.feels_like)}${tempUnit}`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${currentUnit === 'metric' ? Math.round(data.wind.speed * 3.6) : Math.round(data.wind.speed)} ${speedUnit}`;
    pressure.textContent = `${data.main.pressure} hPa`;
  }

  function displayForecast(data) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';

    // Filter to get one forecast per day (every 24 hours)
    const dailyForecasts = [];
    const days = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });

      // Only take one forecast per day (around midday)
      if (date.getHours() >= 11 && date.getHours() <= 14 && !days[day]) {
        days[day] = true;
        dailyForecasts.push({
          day: day,
          temp: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
          icon: item.weather[0].icon,
          description: item.weather[0].description
        });
      }
    });

    // Display forecast for the next 5 days
    dailyForecasts.slice(0, 5).forEach(forecast => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';

      forecastItem.innerHTML = `
              <div class="forecast-day">${forecast.day}</div>
              <div class="forecast-icon">
                  <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
              </div>
              <div class="forecast-temp">
                  <span>${forecast.temp}°</span>
                  <span>${forecast.feels_like}°</span>
              </div>
          `;

      forecastContainer.appendChild(forecastItem);
    });
  }

  function toggleUnit(unit) {
    if (unit === 'celsius') {
      currentUnit = 'metric';
      celsiusBtn.classList.add('active');
      fahrenheitBtn.classList.remove('active');
    } else {
      currentUnit = 'imperial';
      fahrenheitBtn.classList.add('active');
      celsiusBtn.classList.remove('active');
    }

    // If there's already weather data, fetch it again with new units
    if (cityName.textContent !== '--') {
      fetchWeather();
    }
  }

  function updateLastUpdated() {
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }

  function showLoading() {
    // You could implement a loading spinner here
    cityName.textContent = 'Loading...';
  }

  function hideLoading() {
    // Hide loading spinner
  }

  function showError(message) {
    // You could implement an error display here
    alert(message); // Simple alert for now
  }

  function clearError() {
    // Clear any error messages
  }

  // Initialize with default city
  cityInput.value = 'kathmandu';
  fetchWeather();
});