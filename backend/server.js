require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// MongoDB URI
const uri = process.env.MONGO_URI;  // Make sure to have this in a .env file or set it in your environment

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// Middleware to check the connection status
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database connection issue. Try again later.');
    }
    next();
});

// Test route to ping MongoDB
app.get('/ping', (req, res) => {
    const db = mongoose.connection;
    db.db.admin().ping().then(() => {
        res.send('Ping to MongoDB successful');
    }).catch(error => {
        console.error('Ping failed', error);
        res.status(500).send('Ping to MongoDB failed');
    });
});

// Another test route to check connection using a basic query
app.get('/test-query', (req, res) => {
    const TestCollection = mongoose.model('Test', new mongoose.Schema({ name: String }));
    TestCollection.find({}).limit(5).exec((err, docs) => {
        if(err) {
            console.error('Error executing find query', err);
            return res.status(500).send('Failed to execute test query');
        }
        res.send(docs);
    });
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

// Feedback route
app.post('/submit-feedback', (req, res) => {
    const feedback = req.body;

    const data = [
        feedback.date,
        feedback.time,
        feedback.greenheadMessage,
        feedback.greenheadChance,
        feedback.accuracy,
        feedback.weatherDescription,
        feedback.temperature,
        feedback.feelsLike,
        feedback.tempMin,
        feedback.tempMax,
        feedback.pressure,
        feedback.humidity,
        feedback.windSpeed,
        feedback.windDeg,
        feedback.windGust,
        feedback.sunrise,
        feedback.sunset,
        feedback.optionalFeedback
    ];

    const csvContent = data.join(",") + "\r\n";
    const feedbackFilePath = path.join(__dirname, 'feedback.csv');

    try {
        if (!fs.existsSync(feedbackFilePath)) {
            const headers = "Date,Time,Model's Prediction Message,Model's Prediction Chance,Accuracy Feedback,Weather Description,Temperature,Feels Like,Temperature (Min),Temperature (Max),Pressure,Humidity,Wind Speed,Wind Direction,Wind Gust,Sunrise,Sunset,Optional Feedback";
            fs.writeFileSync(feedbackFilePath, headers + "\r\n");
        }

        fs.appendFileSync(feedbackFilePath, csvContent);
        res.status(200).json({ message: 'Feedback recorded' });

    } catch (err) {
        console.error('Failed to write to CSV:', err);
        res.status(500).send('Failed to record feedback.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

