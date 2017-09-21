const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);

// Connection success
mongoose.connection.on('connected', () => {
    console.log('Connected to database: ', config.database);
})

// Connection error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ', err);
})

// initialize app with express
const app = express();

const users = require('./routes/users');

// set port number
const port = 3000;

// CORS Middleware:  to make api request from diferent domain name
app.use(cors());

// Set Static Folder: where client side will go
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser Middleware: parses incoming request bodies
app.use(bodyParser.json());

app.use('/users', users);

// Indes Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})

// Start Server
app.listen(port, () => {
    console.log('Server started on port: ', port);
})