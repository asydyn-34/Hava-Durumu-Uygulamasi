const apiKey = '0224e12dce1c435a64cd31755c454a1d'; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('result');

// Callback fonksiyonu ile veri çekme işlemi
function getWeatherDataCallback(city, callback) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                callback(null, data);
            } else {
                callback('Şehir bulunamadı', null);
            }
        })
        .catch(error => callback('Hata oluştu', null));
}

// Promise ile veri çekme işlemi
function getWeatherDataWithPromise(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    resolve(data);
                } else {
                    reject('Şehir bulunamadı');
                }
            })
            .catch(() => reject('Hata oluştu'));
    });
}

// Async/Await ile veri çekme işlemi
async function getWeatherDataWithAsync(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            return data;
        } else {
            throw new Error('Şehir bulunamadı');
        }
    } catch (error) {
        throw new Error('Hata oluştu');
    }
}

// Callback fonksiyonu ile veri çekme ve gösterme
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherDataCallback(city, (error, data) => {
            if (error) {
                resultDiv.innerHTML = error;
            } else {
                displayWeather(data);
            }
        });
    } else {
        resultDiv.innerHTML = "Lütfen geçerli bir şehir girin.";
    }
});

// Promise ile veri çekme ve gösterme
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherDataWithPromise(city)
            .then(data => displayWeather(data))
            .catch(error => {
                console.error("Hata:", error);
                resultDiv.innerHTML = error;
            });
    } else {
        resultDiv.innerHTML = "Lütfen geçerli bir şehir girin.";
    }
});

// Async/Await ile veri çekme ve gösterme
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        try {
            const data = await getWeatherDataWithAsync(city);
            displayWeather(data);
        } catch (error) {
            console.error("Hata:", error);
            resultDiv.innerHTML = error.message;
        }
    } else {
        resultDiv.innerHTML = "Lütfen geçerli bir şehir girin.";
    }
});

// Hava durumu verisini ekrana yazdırma
function displayWeather(data) {
    const { name, weather, main, wind } = data;
    resultDiv.innerHTML = `
        <h2>${name} - ${weather[0].description}</h2>
        <p>Sıcaklık: ${main.temp}°C</p>
        <p>Rüzgar Hızı: ${wind.speed} m/s</p>
    `;
}
