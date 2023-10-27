const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport")
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require("dotenv").config();

function isLoggedIn(req,res,next) {
    req.user ? next() : res.sendStatus(401)
}

app.use(express.static("views"))
app.use(session({
    secret:"BaggerMan",
    resave: true,
    saveUninitialized:true,
}));

app.use(passport.initialize());
app.use(passport.session())


passport.use( new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:7050/auth/google/callback",
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return done (null, profile);
}));

passport.serializeUser((user,done)=> {
    done (null, user);
});

passport.deserializeUser((user,done)=> {
    done (null, user);
});

app.get("/auth/google", passport.authenticate('google', { scope : [ 'email', 'profile']}))

app.get("/auth/google/callback", passport.authenticate('google', {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/google/failure"
}));



app.get("/", (req,res) => {
    res.render(path.join(__dirname, "views", "ejsfolder", "index.ejs"));
});

app.get("/dashboard", isLoggedIn, (req,res) => {
    res.render(path.join(__dirname, "views", "ejsfolder", "dashboard.ejs"));
});

app.get("/logout", (req,res) => {
    req.logout(function () {
        req.session.destroy(function (err) {
            if (err) {
                console.error(err);
            }

            res.render(path.join(__dirname, "views", "ejsfolder", "index.ejs"));
        });
    });
});

app.listen(7050, () => {
    console.log("big Dripper, Magnum Zipper")
});
