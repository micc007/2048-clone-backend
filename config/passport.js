const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcrypt");

require('dotenv').config();

const User = require("../models/users");

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

// Google strategy

passport.use(
    new GoogleStrategy({
        callbackURL: "/login-google/success",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, (accessToken, refreshToken, email, done) => {
        console.log(email.id);
        console.log(email.emails[0].value);

        //check if there is a user in mongoDB BY EMAIL
        //if yes, fetch that user
        //if no, create new user

        User.findOne({email: email.emails[0].value}).then((foundUser) => {
            if(foundUser){
                console.log(`user already exists -> ${email.emails[0].value} -> ${foundUser}`);
                done(null, foundUser);
            }
            else {
                new User({
                    nick: null,
                    email: email.emails[0].value,
                    pass: null,
                    pic: null,
                    wins: 0,
                    avgScore: 0,
                    avgMoves: 0,
                    google: true,
                    activated: true,
                    actLink: null,
                    passReset: null,
                    passResetTimestamp: null
                }).save().then((newUser) => {
                    console.log(`user created -> ${newUser}`);
                    done(null, newUser);
                })
            }
        })

    })
)

// Local strategy

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
        User.findOne({email: email}).then(async (foundUser) => {
            if(foundUser){
                if(foundUser.google) return done(null, false, {message: "Account is already registered via Google, please press Sign in with Google"});
                if(await bcrypt.compare(password, foundUser.pass)){
                    if(foundUser.activated === true){
                        return done(null, foundUser);
                    }
                    return done(null, false, {message: "Please confirm your account in your email address"});
                }
                else {
                    return done(null, false, {message: "Incorrect password"});
                }
            }
            else { // {message:"Invalid user"}
                return done(null, false, {message:"Invalid user"});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    })
)
