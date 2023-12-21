const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../services/auth');
const authenticateToken = require('../authMiddleware');
const connection = require('../services/db');
const bcrypt = require('bcryptjs');

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;

		// const connection = await pool.getConnection();
		const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

		if (rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user = rows;

		// Compare the provided password with the hashed password from the database
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ message: 'Invalid password' });
		}

		// Password matches - create and send the JWT token
		const accessToken = jwt.sign({ email: user.email, userId: user.id }, 'your_secret_key', {
			expiresIn: '1h', // Token expiration time
		});

		res.status(200).json({ accessToken, role_id: rows.roleID });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error logging in' });
	}
});

// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
	res.json({ message: 'This is a protected route!' });
});

router.post('/signup', async function (req, res, next) {
	try {
		auth.create(req.body);
		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: 'Error registering user' });
		next(err);
	}
});

module.exports = router;