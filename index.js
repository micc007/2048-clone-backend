// dependencies
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const pug = require("pug");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const flash = require("express-flash");

// project files
const passportConfig = require("./config/passport.js");
const routes = require("./routes/routes.js");

require('dotenv').config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI)
.then((result) => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
})
.catch((err) => {
  console.log(err);
})

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'storage')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_SESSION_KEY]
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "http://127.0.0.1:3000"],
          "script-src-attr": ["'self'", "http://127.0.0.1:3000"],
          //"style-src": ["'self'", "http://127.0.0.1:3000/style.css"]
        },
      },
    })
  );

// project routes
app.use("/", routes);
