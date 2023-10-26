const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Add this line
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require("dotenv").config();

// USE AND SET
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("views"));
app.use(cookieParser()); // USE COOKIE PARSER

// Configure express-session
app.use(
  session({
    secret: 'Kartier',
    resave: true,
    saveUninitialized: true,
  })
);

// INITIALIZE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// USE NEW INSTANCE OF GOOGLE STRATEGY
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:6010/auth/google/callback',
}, (accessToken, refreshToken, profile, next) => {

    next()
}))

app.get("/", (req,res) => {
    res.render(path.join(__dirname, "views", "ejsfolder", "sign-up.ejs"));
});

app.get("/login", (req,res) => {
    res.render(path.join(__dirname, "views", "ejsfolder","login.ejs"));
});

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req,res) => {
        res.render("dashboard.ejs");
    }
)


app.listen(6010, () => {
    console.log("Danko Supreme");
});