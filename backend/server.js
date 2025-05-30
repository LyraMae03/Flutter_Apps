const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "flutter_crud",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ==========================
// CRUD ROUTES for /users
// ==========================

// GET all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// POST a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "User added successfully" });
    }
  );
});

// UPDATE user
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "User updated" });
    }
  );
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "User deleted" });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
