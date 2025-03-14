const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const UPLOADS_FOLDER = "/src/Uploads";

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'loginadmin',
    password: 'AYywc3!8i!*W3kpRgSeA3Kve@',
    database: 'uploader_db'
});

app.listen(port, () => {
    console.log('Server listening on port 3000');
});

// Bruker src-mappe som statiske filer
app.use('/src', express.static(path.join(__dirname + '/src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/login.html'));
})

app.post('/loginauth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database error' });
            };
            
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (result) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        return res.status(200).json({ message: 'Login successful' });
                    } else {
                        return res.status(401).json({ message: 'Incorrect username or password' });
                    };
                });
            } else {
                return res.status(401).json({ message: 'Incorrect username or password' });
            };
        });
    } else {
        return res.status(400).json({ message: 'Missing username or password' });
    };
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/register.html'));
})

app.post('/registerauth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            };
            
            connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Database error' });
                };
                
                return res.status(200).json({ message: 'Registration successful' });
            });
        });
    } else {
        return res.status(400).json({ message: 'Missing username or password' });
    };
});