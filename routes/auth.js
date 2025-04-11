// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User created', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User already exists or database error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});



module.exports = router;
