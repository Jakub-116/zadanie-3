const API_KEY = '6758948e8b6820c7b8821c259497edcb'; 
const locationForm = document.getElementById('locationForm');
const locationInput = document.getElementById('locationInput');
const locationsList = document.getElementById('locationsList');

let locations = JSON.parse(localStorage.getItem('locations')) || [];

async function fetchWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Nie udało się pobrać danych pogodowych');
    return await response.json();
}

function renderLocations() {
    locationsList.innerHTML = '';
    locations.forEach(async (location) => {
        try {
            const weather = await fetchWeather(location);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="weather-info">
                    <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Ikona pogody">
                    <div>
                        <strong>${weather.name}</strong>
                        <p>Temp: ${weather.main.temp}°C</p>
                        <p>Wilg.: ${weather.main.humidity}%</p>
                        <p>Ciśnienie: ${weather.main.pressure} hPa</p>
                    </div>
                </div>
                <button onclick="removeLocation('${location}')">Usuń</button>
            `;
            locationsList.appendChild(listItem);
        } catch (error) {
            alert(`Błąd: ${error.message}`);
        }
    });
}

locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (location && !locations.includes(location)) {
        locations.push(location);
        localStorage.setItem('locations', JSON.stringify(locations));
        renderLocations();
    }
    locationInput.value = '';
});

function removeLocation(location) {
    locations = locations.filter((loc) => loc !== location);
    localStorage.setItem('locations', JSON.stringify(locations));
    renderLocations();
}

renderLocations();
