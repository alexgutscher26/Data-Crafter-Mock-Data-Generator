// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { generateMockUser, generateCustomSchemaData } = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to generate mock users
app.get('/api/users', (req, res) => {
    const count = parseInt(req.query.count) || 1;
    const locale = req.query.locale || 'en';
    const users = generateMockUser(count, locale);
    res.json(users);
});

// Endpoint to generate custom schema data
app.post('/api/custom', (req, res) => {
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
