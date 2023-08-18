import React, {useState, useEffect} from "react"
import axios from "axios"
import Home from './pages/Home.jsx'
import Feedback from './pages/Feedback.jsx'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './nav/Navbar.jsx'
import Info from './pages/Info.jsx';


function getCardinalDirection(angle) {
  let degree = (angle % 360 + 360) % 360;
  if (degree >= 337.5 || degree < 22.5) return "N";
  if (degree >= 22.5 && degree < 67.5) return "NE";
  if (degree >= 67.5 && degree < 112.5) return "E";
  if (degree >= 112.5 && degree < 157.5) return "SE";
  if (degree >= 157.5 && degree < 202.5) return "S";
  if (degree >= 202.5 && degree < 247.5) return "SW";
  if (degree >= 247.5 && degree < 292.5) return "W";
  return "NW";
}
function predictGreenheadActivity(data) {
  if (
    data.weather[0].main === "Rain" ||
    data.wind.speed > 30 ||
    (new Date().getMonth() > 9 && new Date().getMonth() < 6) ||
    (new Date().getHours() > 22 || new Date().getHours() < 5)
  ) {
    return 0; // Zero percent chance
  }

  let chance = 0;

  if (data.wind.deg >= 240 && data.wind.deg <= 300) {
    chance += 0.8;
} else if ((data.wind.deg >= 210 && data.wind.deg < 240) || (data.wind.deg > 300 && data.wind.deg <= 330)) {
    chance += 0.4;
} else if ((data.wind.deg > 330 && data.wind.deg <= 345) || (data.wind.deg >= 195 && data.wind.deg < 210)) {
    chance += 0.2;
} else if ((data.wind.deg > 120 && data.wind.deg < 150) || (data.wind.deg >= 30 && data.wind.deg <= 60)) {
    chance -= 0.3;
} else if (data.wind.deg > 60 && data.wind.deg <= 120) {
    chance -= 0.6;
}

  // Temperature factor
  chance += (data.main.temp - 70) * 0.01; // 1% increase for each degree above 70

  // Cloudiness
  if (data.clouds.all >= 0 && data.clouds.all <= 20) {
      chance += 25;
  } else if (data.clouds.all >= 71 && data.clouds.all <= 100) {
      chance -= 15;
  }

  // Peak time of year
  if (
    ((new Date().getMonth() === 6) && (new Date().getDate() > 15)) ||
    ((new Date().getMonth() === 7)) ||
    ((new Date().getMonth() === 7) && (new Date().getDate() < 7))
  ) {
    chance += 0.45; // Additional 45% chance
  }
  else if(
    (new Date().getMonth() === 5) ||
    ((new Date().getMonth() === 6) && (new Date().getDate() <= 15)) ||
    ((new Date().getMonth() === 7) && (new Date().getDate() >= 7)) ||
    (new Date().getMonth() === 8) 
  ){
    chance+=15; 
  }

  // Humidity
  chance += (data.main.humidity - 50) * 0.005; // 1% increase for each percent above 50%

  // Time of Day
  if ((new Date().getHours() >= 11) && (new Date().getHours() <= 15)) {
    chance += 0.4; // Additional 20% chance
  }
  else if (((new Date().getHours() <= 11) && (new Date().getHours() >= 5)) || ((new Date().getHours() <= 22) && (new Date().getHours() >= 15))){
    chance+=0.2;
  }

  // Wind Speed
  if (data.wind.speed < 8) {
    chance += (8 - data.wind.speed) * 0.025; // Adjusted based on 8mph peak
  } else {
    chance -= (data.wind.speed - 8) * 0.025;
  }

  // Final adjustment to keep within 0 to 1 range
  return Math.min(Math.max(chance, 0), 1);
  // Generate the message based on the calculated chance
  
}
function statement(chance){
  let message = '';
  if (chance > 0.8) {
      message = "There are almost certainly greenheads.";
    } else if (chance > 0.6) {
        message = "There will most likely be greenheads.";
    } else if (chance > 0.4) {
        message = "There might be greenheads.";
    } else {
        message = "It is unlikely for there to be greenheads.";
    }
    return message
  }
function getClassForMessage(message) {
  if (message === "There are almost certainly greenheads.") {
      return "almost-certain";
  } else if (message === "There will most likely be greenheads.") {
     return "likely";
  } else if (message === "There might be greenheads.") {
    return "might";
  } else {
    return "unlikely";
    }
}
function App() {
  const [data, setData] = useState(null);
  const [greenheadChance, setGreenheadChance] = useState(null);
  const [greenheadMessage, setGreenheadMessage] = useState(null);
  const [cardinalDirection, setCardinalDirection] = useState(null);

  // Long Beach Island lat and lon
  const lat = 39.6398;
  const lon = -74.1816;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;


 
useEffect(() => {
  // Fetch the weather data
  axios.get(url)
    .then(response => {
      setData(response.data);
      const windDirectionDegree = response.data.wind.deg;
      const direction = getCardinalDirection(windDirectionDegree);
      setCardinalDirection(direction);

      // Once we have the weather data, calculate the greenhead likelihood
      const chance = predictGreenheadActivity(response.data);
      setGreenheadChance(chance);
      const messageResult = statement(chance);
      setGreenheadMessage(messageResult);
    })
    .catch(error => {
      console.error("Error fetching the weather data:", error);
    });
}, []);  // The empty dependency array ensures the effect runs only once when the component mounts




  if (!data) {
    return <div>Loading...</div>;
  }


  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <Home 
              greenheadMessage={greenheadMessage} 
              greenheadChance={greenheadChance} 
              cardinalDirection={cardinalDirection}
              getClassForMessage={getClassForMessage} 
              data={data}
            />
          } />
          <Route path="/feedback" element={<Feedback currentWeather={data} greenheadMessage={greenheadMessage} greenheadChance={greenheadChance} />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </main>
    </BrowserRouter>
  );

}

export default App;







