require('dotenv').config()
require('./config/passport.config');
const express = require('express');
const passport = require('passport');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const db = require('./config/db.config');
const Route = require('./routes/index.routes');
const { PORT, SESSION_SECRET, FRONTEND_URL } = process.env;
const userModel = require('./model/user.model');

app.use(express.json({
    limit: '500mb',
    verify: (req, res, buf) => {
        const url = req.originalUrl;
    }
}));

app.use(express.urlencoded({
    extended: true,
    limit: '500mb'
}));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger(':remote-addr - :remote-user :method :url [:date[clf]] :status :res[content-length] - :response-time ms'));

db();
Route({ app });

let server = () => {
    app.listen(PORT, () => {
        console.log(`AI CMS Backend Server is running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
};

server();