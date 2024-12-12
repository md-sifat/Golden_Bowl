// please read these comment first to get a overview about the code piece

//this is the main control panel of the full project and the routes folder is extenstion of that 
// all the routes of routes folder aere imported in that folder....
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');    


// Middleware to parse incoming JSON...all the file of routes are server-side code and thoose 
//and thoose routes should impiort in the main server file...that is server.js
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/order', orderRoutes);


// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '/../frontend')));

// Setup mysql databse connection , if you want of check from where we specifying the database 
// for that check db.js file just above db.js
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',  
    password: '',    
    database:'restDB' 
});

// Check database connection completed or not
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// starting with login.html but in express js index.html take as a default routing so,,,it will start with index html file as root routing page
app.get('/', (req, res) => {
    console.log("serving log in file");
    // Using path.join to ensure cross-platform compatibility
    res.sendFile(path.join(__dirname, '/../frontend/login.html')); 
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
