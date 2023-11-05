const bcrypt = require("bcrypt");
const crypto = require("node:crypto");

const mailer = require("../config/mailer.js");
const User = require("../models/users");

const registrationController = async (req, res) => {
    
    if(req.body.password !== req.body.password2) return res.render("registration", {message: "Passwords are not the same"});

    User.findOne({email: req.body.email}).then(async (foundUser) => {
        if(foundUser) return res.render("registration", {message: "User email is already registered"});
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const uuidLink = crypto.randomUUID();

        const user = new User({
            nick: null,
            email: req.body.email,
            pass: hashPass,
            pic: null,
            wins: 0,
            avgScore: 0,
            avgMoves: 0,
            google: false,
            activated: false,
            actLink: uuidLink,
            passReset: null,
            passResetTimestamp: null
        }).save().then(() => {

            const email_data = {
                html: `
                  <h1>2048 Clone account confirmation</h1>
                  <br>
                  <p>Please confirm your new account by clicking link below</p>
                  <p>${process.env.DOMAIN}account-activation/${uuidLink}</p>
                `,
                subject: "2048 Clone account confirmation",
                destination: req.body.email
              }

              mailer.sendConfirmationMail(email_data);

            res.redirect("/login");
        })
    })
    .catch((err) => {
        console.log(err);
    })


}

const activationController = (req, res) => {

    User.findOne({actLink: req.params.token}).then((foundUser) => {
        if(!foundUser) return res.render("activation", {message: "Invalid link"});

        const expiresAfter = 1000 * 60 * 60 * 24; // miliseconds

        const now = new Date(Date.now()).toISOString();
        const timestamp = (new Date(foundUser.createdAt).valueOf()) + expiresAfter;
        const timestampISO = new Date(timestamp).toISOString();

        console.log(new Date(timestampISO));

        if(now > timestampISO){
            User.deleteOne({actLink: req.params.token}).then(() => {
                return res.render("activation", {message: "Your activation link has expired, please register again and confirm your account"});
            })
            .catch((err) => {
                console.log(err);
            })

        }
        else {
            User.updateOne({actLink: req.params.token}, {activated: true, actLink: null}).then(() => {
                return res.render("activation", {message: "Account activated! Now you can log in"});
            })
            .catch((err) => {
                console.log(err);
            });
        }

    })
    .catch((err) => {
        console.log(err);
    })

}

module.exports = {
    registrationController,
    activationController
};