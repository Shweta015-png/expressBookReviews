const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ✅ GET ALL BOOKS
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// ✅ GET BOOK BY ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});


// ✅ GET BY AUTHOR
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      result[key] = books[key];
    }
  });

  return res.json(result);
});


// ✅ GET BY TITLE
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      result[key] = books[key];
    }
  });

  return res.json(result);
});


// ✅ REGISTER USER
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});


module.exports.general = public_users;