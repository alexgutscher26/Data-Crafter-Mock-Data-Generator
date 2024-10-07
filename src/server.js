// src/server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { generateMockUser, generateCustomSchemaData } = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Default route for root URL
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Mock Data Generator API</h1>
        <p>Use the following endpoints to generate data:</p>
        <ul>
            <li><strong>POST /api/login</strong> - Get a JWT token for authentication.</li>
            <li><strong>GET /api/users</strong> - Generate mock user data. Requires token authentication.</li>
            <li><strong>POST /api/custom</strong> - Generate custom data based on a schema. Requires token authentication.</li>
        </ul>
    `);
});

// Public route to login and get a token
app.post('/api/login', (req, res) => {
    // Example login, you can replace this with a real authentication system
    const username = req.body.username;
    const password = req.body.password;

    if (username === 'user' && password === 'password') {
        // User is authenticated, generate a token
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(403).json({ error: 'Invalid credentials' });
    }
});

// Protected route to generate mock users
app.get('/api/users', authenticateToken, (req, res) => {
    const count = parseInt(req.query.count) || 1;
    const locale = req.query.locale || 'en';
    const users = generateMockUser(count, locale);
    res.json(users);
});

// Protected route to generate custom schema data
app.post('/api/custom', authenticateToken, (req, res) => {
    const { schema, count, locale } = req.body;
    if (!schema) {
        return res.status(400).json({ error: 'Schema is required' });
    }
    const dataCount = count || 1;
    const dataLocale = locale || 'en';
    const customData = generateCustomSchemaData(schema, dataCount, dataLocale);
    res.json(customData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
