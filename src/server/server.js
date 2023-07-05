require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const db = require('./controllers/dbController')
const { localStrategy, session: passportSession } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes.js')
const app = express()

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "https://app-api-chatter-sphere.onrender.com", "http://localhost:5000", "https://eu-chatter-sphere.onrender.com"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    resave: true,
    saveUninitialized: true
}));

app.use(localStrategy) 
app.use(passportSession)
app.use(authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});