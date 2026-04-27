const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // change if needed
  database: 'test_db'
});

// connect
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ✅ Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`);

// ==========================
// 🔹 CRUD APIs
// ==========================

// ➤ Create user
app.post('/users', (req, res) => {
  const { name } = req.body;

  db.query(
    'INSERT INTO users (name) VALUES (?)',
    [name],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: 'User created',
        id: result.insertId
      });
    }
  );
});

// ➤ Read all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

// ➤ Read one user
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM users WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]);
    }
  );
});

// ➤ Update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  db.query(
    'UPDATE users SET name = ? WHERE id = ?',
    [name, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: 'User updated' });
    }
  );
});

// ➤ Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM users WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: 'User deleted' });
    }
  );
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});