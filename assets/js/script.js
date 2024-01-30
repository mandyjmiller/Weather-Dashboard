const apiKey = '166a433c57516f51dfab1f7edaed8413';
const searchForm = document.getElementById('searchForm');
const searchHistory = document.getElementById('searchHistory');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecastCards = document.getElementById('forecastCards');

// Function to fetch current weather data
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        throw error;
    }
}

// Function to fetch 5-day forecast data with one update per day at 12:00
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&cnt=40`);
        const data = await response.json();

        // Filter data to get only one update per day at 12:00
        const dailyForecasts = filterDailyForecasts(data.list);

        return dailyForecasts;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
}

// Helper function to filter one update per day at 12:00
function filterDailyForecasts(forecasts) {
    const filteredForecasts = {};

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const key = date.toDateString(); // Group by date

        if (date.getHours() === 12 && date.getMinutes() === 0 && !filteredForecasts[key]) {
            filteredForecasts[key] = forecast;
        }
    });

    return Object.values(filteredForecasts);
}

// Function to display current weather details
function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
        <h4>${data.name}, ${new Date(data.dt * 1000).toLocaleDateString('en-GB')}</h4>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

// Function to display 5-day forecast with one update per day at 12:00
function displayForecast(forecastData) {
    forecastCards.innerHTML = '';
    forecastData.forEach(forecast => {
        const card = document.createElement('div');
        card.classList.add('card', 'forecast-card');

        card.innerHTML = `
            <div class="card-body">
                <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString('en-GB')}</p>
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
                <p>Wind: ${forecast.wind.speed} m/s</p>
            </div>
        `;

        forecastCards.appendChild(card);
    });
}

// Function to display search history
function displaySearchHistory(history) {
    searchHistory.innerHTML = '';
    history.forEach(city => {
        const historyItem = document.createElement('p');
        historyItem.classList.add('mb-0', 'text-primary', 'search-history-item');
        historyItem.innerText = city;
        historyItem.addEventListener('click', () => handleHistoryItemClick(city));
        searchHistory.appendChild(historyItem);
    });
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city !== '') {
        try {
            const currentWeatherData = await fetchCurrentWeather(city);

            if (currentWeatherData.cod === '404') {
                alert('City not found. Please enter a valid city name.');
            } else {
                displayCurrentWeather(currentWeatherData);

                const forecastData = await fetchForecast(city);
                displayForecast(forecastData);

                let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
                if (!history.includes(city)) {
                    history.push(city);
                    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
                    displaySearchHistory(history);
                }
            }
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    } else {
        alert('Please enter a city name.');
    }
}

// Function to handle search history item click
async function handleHistoryItemClick(city) {
    cityInput.value = city;
    await handleFormSubmit(new Event('submit'));
}

// Initial setup
function initialize() {
    searchForm.addEventListener('submit', handleFormSubmit);

    const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    displaySearchHistory(history);

    if (history.length > 0) {
        cityInput.value = history[0];
        handleFormSubmit(new Event('submit'));
    }
}

// Call initialize function on page load
initialize();
