const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");



const app = express();
app.use(cors());
app.use(bodyParser.json());



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


  // Get All Users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
    [name, email, password], 
      (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
   );
});



// Update User
app.put("/users/:id", (req, res) => {
    const { name, email } = req.body;
    db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], (err) => {
      if (err) throw err;
      res.json({ message: "User updated" });
    });
  });



  // Delete User
app.delete("/users/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
      if (err) throw err;
      res.json({ message: "User deleted" });
    });
  });
  
app.post("/login", (req, res) => {
  const { email, password } = req.body;
    
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) {
            res.json({ message: "Login successful", user: results[0] });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});





  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
