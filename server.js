const express = require('express');
const path = require('path');

const port = 3000;

const app = express();

app.listen(port, () => {
    console.log('Server listening on port 3000');
});

// Bruker src-mappe som statiske filer
app.use('/src', express.static(path.join(__dirname + '/src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/index.html'));
})