const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const flash = require("express-flash");
const User = require("../models/users");
const mailer = require("../config/mailer.js");

const forgotPasswordController = (req, res) => {
    User.findOne({email: req.body.email}).then((foundUser) => {
        if(!foundUser) return res.render("forgot_password", {message: "Account does not exist"});
        if(foundUser.google === true) return res.render("forgot_password", {message: "Account is created via Google, log in by pressing Sign in with Google"});

        const uuidLink = crypto.randomUUID();

        User.updateOne({email: req.body.email}, {passReset: uuidLink, passResetTimestamp: Date.now()}).then(() => {
            const email_data = {
                html: `
                <h1>2048 Clone account forgotten password</h1>
                <br>
                <p>Click the link below to create a new password to your 2048 Clone account</p>
                <p>${process.env.DOMAIN}forgot_password/${uuidLink}</p>
                `,
                subject: "2048 Clone account forgotten password",
                destination: req.body.email
            }
    
            mailer.sendConfirmationMail(email_data);
            res.redirect("/login");
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });  
}

const forgotPasswordResetController = async (req, res) => {

    if(req.body.new_password !== req.body.new_password2){
        req.flash("message", "Passwords are not the same");
        return res.redirect(`/forgot_password/${req.body.token}`);
    }

    const newPass = await bcrypt.hash(req.body.new_password, 10);
    User.updateOne({passReset: req.body.token}, {pass: newPass, passReset: null, passResetTimestamp: null}).then(() => {
        res.redirect("/login");
    })
    .catch((err) => {
        console.log(err);
    });

}

module.exports = {
    forgotPasswordController,
    forgotPasswordResetController
};