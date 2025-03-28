const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'aquacultureintel.com',
  user: process.env.DB_USER || 'admin_news',
  password: process.env.DB_PASSWORD || 'ZnyEGn5VItB.[a@o',
  database: process.env.DB_NAME || 'data_shrimpvet',
  port: parseInt(process.env.DB_PORT || '3306', 10)});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('MySQL database connected successfully');
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// MySQL login test endpoint
app.post('/api/mysql-login-test', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }
  
  // Query to check if the user exists and credentials are correct
  const sql = 'SELECT * FROM user_infor WHERE username = ? AND password = ?';
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('MySQL login test error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error', 
        error: err.message 
      });
    }
    
    if (results.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Don't send password back to client
    const user = results[0];
    delete user.password;
    
    return res.json({ 
      success: true, 
      message: 'Login successful', 
      user 
    });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM user_infor';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const sql = 'SELECT * FROM user_infor WHERE username = ? AND password = ?';
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Don't send password back to client
    const user = results[0];
    delete user.password;
    
    res.json({ 
      message: 'Login successful', 
      user
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 