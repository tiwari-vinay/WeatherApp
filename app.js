import express from "express";
import ejs from "ejs";
import axios from "axios";

//to use the __dirname we have to do this much extra
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const api_key = "a1445e393dcf11451c20b8cbc8e3254f";
let url = `https://api.openweathermap.org/data/2.5/weather?&appid=a1445e393dcf11451c20b8cbc8e3254f&units=metric`;
// let icon = "";
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  // res.render('index');
  res.sendFile(__dirname + "/index.html");
});

console.log("git flow test line")

app.post("/location", (req, res) => {
  // console.log(req.body);
  const { latitude, longitude } = req.body;
  const weather_data = {};

  let new_url = url + `&lat=${latitude}&lon=${longitude}`;

  //calling weather api
  axios
    .get(new_url)
    .then((response) => {
    //destructuring weather data
    const { name } = response.data;
    const { speed } = response.data.wind;
    const { description, icon } = response.data.weather[0];
    const { temp, humidity } = response.data.main;
    const icon_url = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    //let us construct the weather_data object
    weather_data.iconUrl = icon_url;
    weather_data.cityName = name;
    weather_data.windSpeed = speed;
    weather_data.description = description;
    weather_data.icon = icon; 
    weather_data.temp = temp;
    weather_data.humidity = humidity;
    // console.log(weather_data);
    res.render('weather.ejs',weather_data)
    })
    .catch((err) => {
      if (err) res.render('weather.ejs',{error:'error'});
    });
});

app.post('/city',(req,res)=>{
    let city = req.body.city;
    // console.log(city);
    let new_url = url+`&q=${city}`;
    let weather_data = {};

    // calling the api
    axios.get(new_url)
    .then((response) => {
    //destructuring weather data
    const { name } = response.data;
    const { speed } = response.data.wind;
    const { description, icon } = response.data.weather[0];
    const { temp, humidity } = response.data.main;
    const icon_url = ` https://openweathermap.org/img/wn/${icon}@2x.png`;

    //let us construct the weather_data object
    weather_data.iconUrl = icon_url;
    weather_data.cityName = name;
    weather_data.windSpeed = speed;
    weather_data.description = description;
    weather_data.icon = icon; 
    weather_data.temp = temp;
    weather_data.humidity = humidity;
    // console.log(weather_data);
    res.render('weather.ejs',weather_data)
    })
    .catch((err) => {
        weather_data.iconUrl = 'Not Found';
    weather_data.cityName = 'Not Found';
    weather_data.windSpeed = 'Not Found';
    weather_data.description = 'Not Found';
    weather_data.icon = 'Not Found'; 
    weather_data.temp = 'Not Found';
    weather_data.humidity = 'Not Found';
    // console.log(weather_data);
      if (err) res.render('weather.ejs',weather_data);
    });
});

app.listen("3000", () => console.log("server listening on port 3000"));
