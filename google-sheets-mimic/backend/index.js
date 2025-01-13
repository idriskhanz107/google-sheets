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
app.get('/cells', (req, res) => {
    const query = 'SELECT * FROM cells';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

// API to save or update cell data
app.post('/cells', (req, res) => {
    const { row, col, value } = req.body;

    const query = `
        INSERT INTO cells (row_number, column_number, value)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE value = ?;
    `;
    db.query(query, [row, col, value, value], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Cell data saved successfully' });
    });
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
