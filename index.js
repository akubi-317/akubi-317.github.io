let map;
let marker;

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // 現在地を地図の中心にする
            initMap(latitude, longitude);

            getPlaceName(latitude, longitude);
            getWeather(latitude, longitude);
        },
        function() {
            document.getElementById("location").textContent =
                "位置情報を取得できませんでした";

            // 位置情報が取得できない場合は日本付近を表示
            initMap(35.6762, 139.6503);
        }
    );
}

function initMap(lat, lon) {
    map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([lat, lon]).addTo(map)

    // 地図をクリックしたとき
    map.on("click", function(e) {
        const clickedLat = e.latlng.lat;
        const clickedLon = e.latlng.lng;

        // マーカーをクリック地点へ移動
        marker.setLatLng([clickedLat, clickedLon])

        // クリックした場所の情報を取得
        getPlaceName(clickedLat, clickedLon);
        getWeather(clickedLat, clickedLon);
    });
}

function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "北";
    if (deg < 67.5) return "北東";
    if (deg < 112.5) return "東";
    if (deg < 157.5) return "南東";
    if (deg < 202.5) return "南";
    if (deg < 247.5) return "南西";
    if (deg < 292.5) return "西";
    return "北西";
}

function getWeather(lat, lon) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m` +
        `&wind_speed_unit=ms`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.current.temperature_2m;
            const humidity = data.current.relative_humidity_2m;
            const weatherCode = data.current.weather_code;
            const windSpeed = data.current.wind_speed_10m;
            const windDirection = data.current.wind_direction_10m;

            let weatherText = "";

            if (weatherCode === 0) {
                weatherText = "☀️ 晴れ";
            } else if (weatherCode <= 3) {
                weatherText = "☁️ 曇り";
            } else if (weatherCode <= 67) {
                weatherText = "🌧️ 雨";
            } else if (weatherCode <= 77) {
                weatherText = "❄️ 雪";
            } else {
                weatherText = "🌥️ 不明";
            }

            document.getElementById("weather").innerHTML =
                `${weatherText}<br>
                気温 ${temp}℃<br>
                湿度 ${humidity}%<br>
                風速 ${windSpeed} m/s<br>
                風向き ${getWindDirection(windDirection)}`;
        })
        .catch(error => {
            document.getElementById("weather").textContent =
                "天気情報を取得できませんでした";
        });
}

function getPlaceName(lat, lon) {
    const url =
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const address = data.address || {};

            // 国名も取得
            const country = address.country || "";

            const prefecture =
                address.province ||
                address.state ||
                "";

            const city =
                address.city ||
                address.town ||
                address.village ||
                "";

            const town =
                address.suburb ||
                address.neighbourhood ||
                address.quarter ||
                "";

            const place = [country, prefecture, city, town]
                .filter(Boolean)
                .join("、");

            document.getElementById("location").textContent =
                place || `緯度 ${lat.toFixed(5)}、経度 ${lon.toFixed(5)}`;
        })
        .catch(error => {
            document.getElementById("location").textContent =
                `緯度 ${lat.toFixed(5)}、経度 ${lon.toFixed(5)}`;
        });
}
