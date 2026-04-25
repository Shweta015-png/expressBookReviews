const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// ✅ 1. Get all books
const getAllBooks = async () => {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
};

// ✅ 2. Get books by author
const getBooksByAuthor = async (author) => {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return response.data;
};

// ✅ 3. Get books by title
const getBooksByTitle = async (title) => {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return response.data;
};

// ✅ 4. Get book by ISBN
const getBookByISBN = async (isbn) => {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
};

module.exports = {
    getAllBooks,
    getBooksByAuthor,
    getBooksByTitle,
    getBookByISBN
};