const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// In-memory users list
let users = [];


// ✅ Check if user exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};


// ✅ Authenticate username + password
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};


// 🔥 LOGIN (TASK 7)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { username },
      "bookreviewkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token: accessToken
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});


// 🔥 AUTH MIDDLEWARE (VERY IMPORTANT)
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "User not logged in" });
  }

  try {
    const decoded = jwt.verify(token, "bookreviewkey");
    req.user = decoded.username;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// 🔥 ADD / UPDATE REVIEW (TASK 8)
regd_users.put("/auth/review/:isbn", auth, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // initialize reviews if not exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // store review by logged-in user
  books[isbn].reviews[req.user] = review;

  return res.json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});


// 🔥 DELETE REVIEW (TASK 9)
regd_users.delete("/auth/review/:isbn", auth, (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[req.user]) {
    delete books[isbn].reviews[req.user];

    return res.json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  }

  return res.status(404).json({ message: "Review not found for user" });
});


// exports
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;