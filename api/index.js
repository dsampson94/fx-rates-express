require('dotenv').config();
const express = require('express');
const {join} = require('node:path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files
app.use(express.static(join(__dirname, '../public')));

// Root route
app.get('/', (req, res) => {
    res.render('index', { title: 'Express', message: 'Hello from Express!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
