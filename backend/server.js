const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

const JWT_SECRET = 'secretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
};

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

// Fetch all employees
app.get('/employees', authenticateToken, (req, res) => {
    const filePath = path.join(__dirname, 'employees.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading employee data' });
        }

        const employees = JSON.parse(data);
        res.status(200).json(employees);
    });
});

// Fetch a specific employee by ID
app.get('/employee/:id', authenticateToken, (req, res) => {
    const filePath = path.join(__dirname, 'employees.json');
    const employeeId = parseInt(req.params.id);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading employee data' });
        }

        const employees = JSON.parse(data).data;
        const employee = employees.find(emp => emp.id === employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    });
});


app.post('/login', [
    body('email').isEmail().withMessage('Invalid email address').trim().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').trim()
], (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Hardcoded credentials
    const correctEmail = 'bhagya@eds.com';
    const correctPassword = 'password';

    if (email === correctEmail && password === correctPassword) {
        const user = { email: email, id: 1 };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
