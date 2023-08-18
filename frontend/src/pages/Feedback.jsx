import React, { useState } from 'react';
import '../style/Feedback.css';

function Feedback({ currentWeather, greenheadMessage, greenheadChance }) {
  const [accuracy, setAccuracy] = useState(null);
  const [optionalFeedback, setOptionalFeedback] = useState('');

  const handleAccuracyChange = (event) => {
    setAccuracy(event.target.value);
  };

  const handleOptionalFeedbackChange = (event) => {
    setOptionalFeedback(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (accuracy === null) {
      alert("Please select the accuracy of the weather prediction!");
      return;
    }

    // Convert the feedback and weather data to CSV
    // Create feedback data object
    const feedbackData = {
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString(),
      greenheadMessage: greenheadMessage,
      greenheadChance: greenheadChance,
      accuracy: accuracy,
      weatherDescription: currentWeather.weather[0].description,
      temperature: currentWeather.main.temp,
      feelsLike: currentWeather.main.feels_like,
      tempMin: currentWeather.main.temp_min,
      tempMax: currentWeather.main.temp_max,
      pressure: currentWeather.main.pressure,
      humidity: currentWeather.main.humidity,
      windSpeed: currentWeather.wind.speed,
      windDeg: currentWeather.wind.deg,
      windGust: currentWeather.wind.gust,
      sunrise: new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString(),
      optionalFeedback: optionalFeedback
    };

    // Send feedback data to server
    fetch('http://localhost:5000/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
   })
    .then(data => {
        // After submission, reset the form
        setAccuracy(null);
        setOptionalFeedback('');
        alert('Thank you for your feedback!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit feedback. Please try again.');
    });
  };

  return (
    <div className="feedback">
      <h1>Performance Feedback</h1> {/* Changed this from h2 to h1 */}
      <form onSubmit={handleFormSubmit}>
        <div className="top"> {/* Added classname for styling */}
          <label>
            Was the weather prediction accurate?
            <select value={accuracy || ""} onChange={handleAccuracyChange} required>
              <option value="" disabled>Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>
        <div className="middle"> {/* Added classname for styling */}
          <label>
            How did you enjoy the application? (Optional)
            <textarea value={optionalFeedback} onChange={handleOptionalFeedbackChange} />
          </label>
        </div>
        <div className="bottom"> {/* Added classname for styling */}
          <button type="submit">Submit Feedback</button>
        </div>
      </form>
    </div>
  );
}

export default Feedback;