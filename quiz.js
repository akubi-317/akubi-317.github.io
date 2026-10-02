let map,marker,currentTemperature=null;
function getLocation(){
 navigator.geolocation.getCurrentPosition(pos=>{
  const lat=pos.coords.latitude,lon=pos.coords.longitude;
  initMap(lat,lon);getPlaceName(lat,lon);getWeather(lat,lon);getHistoricalRecords(lat,lon);
 },()=>{
  document.getElementById("location").textContent="位置情報を取得できませんでした";
  initMap(35.6762,139.6503);getWeather(35.6762,139.6503);getHistoricalRecords(35.6762,139.6503);
 });
}
function initMap(lat,lon){
 map=L.map("map").setView([lat,lon],13);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
 marker=L.marker([lat,lon]).addTo(map);
 map.on("click",e=>{
  marker.setLatLng([e.latlng.lat,e.latlng.lng]);
  getPlaceName(e.latlng.lat,e.latlng.lng);getWeather(e.latlng.lat,e.latlng.lng);getHistoricalRecords(e.latlng.lat,e.latlng.lng);
  document.getElementById("answer").value="";
  document.getElementById("result").textContent="";
  document.getElementById("details").classList.add("hidden");
 });
}
function getWindDirection(d){
 if(d>=337.5||d<22.5)return"北";if(d<67.5)return"北東";if(d<112.5)return"東";if(d<157.5)return"南東";
 if(d<202.5)return"南";if(d<247.5)return"南西";if(d<292.5)return"西";return"北西";
}
function getWeather(lat,lon){
 const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;
 fetch(url).then(r=>r.json()).then(data=>{
  const c=data.current;currentTemperature=c.temperature_2m;
  let w=c.weather_code===0?"☀️ 晴れ":c.weather_code<=3?"☁️ 曇り":c.weather_code<=67?"🌧️ 雨":c.weather_code<=77?"❄️ 雪":"🌥️ 不明";
  document.getElementById("currentWeather").textContent=w;
  document.getElementById("temperature").textContent=`${c.temperature_2m}℃`;
  document.getElementById("humidity").textContent=`${c.relative_humidity_2m}%`;
  document.getElementById("windSpeed").textContent=`${c.wind_speed_10m} m/s`;
  document.getElementById("windDirection").textContent=getWindDirection(c.wind_direction_10m);
 }).catch(()=>document.getElementById("currentWeather").textContent="天気情報を取得できませんでした");
}
function checkAnswer(){
 if(currentTemperature===null)return;
 const v=Number(document.getElementById("answer").value);
 if(Number.isNaN(v)){document.getElementById("result").textContent="気温を入力してください。";return}
 const d=Math.abs(v-currentTemperature);
 document.getElementById("result").textContent=d<=1?"🎉 正解！かなり近いです！":d<=3?"👍 惜しい！":"😲 ちょっと離れていました！";
}
function toggleDetails(){document.getElementById("details").classList.toggle("hidden")}
function getPlaceName(lat,lon){
 fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
 .then(r=>r.json()).then(data=>{
  const a=data.address||{},place=[a.country||"",a.province||a.state||"",a.city||a.town||a.village||"",a.suburb||a.neighbourhood||a.quarter||""].filter(Boolean).join("、");
  document.getElementById("location").textContent=place||`緯度 ${lat.toFixed(5)}、経度 ${lon.toFixed(5)}`;
 }).catch(()=>document.getElementById("location").textContent=`緯度 ${lat.toFixed(5)}、経度 ${lon.toFixed(5)}`);
}
function getHistoricalRecords(lat, lon) {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const url =
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
        `&start_date=1940-01-01&end_date=${end}` +
        `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    document.getElementById("recordHigh").textContent = "取得中...";
    document.getElementById("recordLow").textContent = "取得中...";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const maxValues = (data.daily.temperature_2m_max || []).filter(v => v !== null);
            const minValues = (data.daily.temperature_2m_min || []).filter(v => v !== null);

            if (maxValues.length === 0 || minValues.length === 0) {
                throw new Error("履歴データがありません");
            }

            const recordHigh = Math.max(...maxValues);
            const recordLow = Math.min(...minValues);

            document.getElementById("recordHigh").textContent =
                `${recordHigh}℃`;

            document.getElementById("recordLow").textContent =
                `${recordLow}℃`;
        })
        .catch(error => {
            document.getElementById("recordHigh").textContent = "取得できません";
            document.getElementById("recordLow").textContent = "取得できません";
        });
}
