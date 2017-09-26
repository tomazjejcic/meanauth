const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database, {useMongoClient: true});

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

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Start Server
app.listen(port, () => {
    console.log('Server started on port: ', port);
})