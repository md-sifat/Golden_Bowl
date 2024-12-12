const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config(); 

const router = express.Router();

// important notes from *****

//this folder is a extension of server.js 
// in that post router of signup you can see a function is called dynamiccaly as a parameter of post()
// with 2 param one is req and another is res.....*
// req carry all the data which are send from the frontend and we use them in server-side implementation
// and res is what we retuern in the frontend after nessesary work or operation
//this same strucutre used in all the routing and i am not going to explain this before everty routing 
// and also all the sql quries are writting in server-side codes



// this is for  SignUp Routing when user submit the signup form 
router.post('/signup', async (req, res) => {
    console.log("check sign up");
    // the req.body contain all the data from signup form
    const { firstname, lastname, username, email, password , role } = req.body;

    if (!['customer', 'manager', 'chef'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let tableName = `${role}s`;
    if(tableName === "managers"){
        tableName = "admins";
    }
    console.log(tableName);
    // Query to insert the user into the customers table
    const query = `INSERT INTO ${tableName} (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [firstname, lastname, username, email, hashedPassword], (err, results) => {
        if(err){
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'Sign up successful' });
    });
});
// this is the code 
router.post('/login', (req, res) => {
    const { email, password , role} = req.body;

    if (!['customer', 'manager', 'chef'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    let tableName = `${role}s`;
    if(tableName === "managers"){
        tableName = "admins";
    }
    const sql = `SELECT * FROM ${tableName} WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ message: 'User not found!' });

        const user = results[0];
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log(user);
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send({ message: 'Invalid credentials!' });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is missing!' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        res.send({ message: 'Login successful!', token });
    });
});



router.get('/user', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const sql = 'SELECT username, firstname, lastname FROM customers WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json(results[0]); 
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});
router.get('/manager', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const sql = 'SELECT username, firstname, lastname FROM admins WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json(results[0]); 
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});
router.get('/chef', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const sql = 'SELECT username, firstname, lastname FROM chefs WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json(results[0]); 
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});


module.exports = router;
