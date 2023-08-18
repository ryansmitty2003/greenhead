import React from 'react';

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, function(word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}


function Home({ data, greenheadMessage, getClassForMessage, cardinalDirection }) {

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <div className="top">
          <div className="location">
            <h1>LBI</h1>
          </div>
          <div className="temp">
            <p className="bold">Current Temperature</p>
            {data.main ? <p> {data.main.temp.toFixed()}°F</p> : null}
          </div>
        </div>
        <div className={`middle ${getClassForMessage(greenheadMessage)}`}>
          <p>{greenheadMessage}</p>
        </div>
        <div className="bottom">
          <div className="feels">
            <p className="bold">Description</p> 
            {data.weather ? <p> {capitalizeWords(data.weather[0].description)}</p> : null}
          </div>
          <div className="humidity">
            <p className="bold">Humidity</p>
            {data.main ? <p> {data.main.humidity}%</p> : null}
          </div>
          <div className="greenhead-likelihood">
            <p className="bold">Wind</p>
            <p>{data.wind.speed.toFixed()}MPH {cardinalDirection}</p>
          </div>
        </div>

      </div>  
    </div>
  );
}

export default Home;
