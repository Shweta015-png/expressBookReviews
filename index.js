const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));
function auth(req, res, next) {
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
}

app.use("/customer", customer_routes);   // normal routes
app.use("/", genl_routes);               // public routes

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
