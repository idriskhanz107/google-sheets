const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Idris@123', // Replace with your MySQL password
    database: 'google_sheets_clone',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Test API
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
