const mailer = require("../config/mailer.js");
const { uploadPlayerPhoto } = require("../config/multer.js");

const User = require("../models/users");

// return profile info of a user by its nick
const playerIdController = async (req, res) => {
    const playerProfile = await User.findOne({
        nick: req.params.nick
    });
    res.send(playerProfile);
}

// returns profile info of logged in user
const playerProfileController = async (req, res) => {
    const playerProfile = await User.findOne({
        nick: req.user.nick
    });
    res.send(playerProfile);
}

const changeNickController = (req, res) => {
    User.findOne({nick: req.body.new_nick}).then((foundUser) => {
        console.log(foundUser)

        if(foundUser) {
            console.log("Nick not changed");
            res.send(JSON.stringify("Nick is already taken, choose a different one"));
        }
        else {
            console.log("changed");
            User.updateOne({email: req.user.email}, {nick: req.body.new_nick}).then(() => {
                console.log(`User -> ${req.user.email} -> Nick changed`);
                res.send(JSON.stringify("Nick changed!"));
            });
        }
    });
}

const changeEmailController = (req, res) => {
    User.findOne({email: req.body.new_email}).then((foundUser) => {

        if(foundUser) {
            console.log("Email not changed");
            res.send(JSON.stringify("Email is already taken, choose a different one"));
        }
        else {
            const email_data = {
                html: `
                  <h1>2048 Clone account email change confirmation</h1>
                  <br>
                  <p>Please confirm your new email address by clicking link below</p>
                  <p>${process.env.DOMAIN}player_profile/change/email/activation/${req.user.id}</p>
                `,
                subject: "2048 Clone account email change confirmation",
                destination: req.body.new_email
              }

              mailer.sendConfirmationMail(email_data);
        }
    });
    res.send(JSON.stringify("You will receive a link to activate your new email address"));
}

const changeEmailActivationController = (req, res) => {
    User.updateOne({_id: req.params.id}, {email: req.params.email}).then(() => {
        res.render('activation', {message: "Your email address was successfully changed"});
    });
}

const changePhotoController = (req, res) => {
    uploadPlayerPhoto(req, res, (err) => {
        if (err) {
            if(err.code === "LIMIT_FILE_SIZE"){
                res.send(JSON.stringify("File exceeds 512 kB size limit"));
            }
            else{
                res.send(err.message);
            }
        }
        else {
            User.updateOne({_id: req.user.id}, {pic: req.files.new_photo[0].filename}).then(() => {
                res.send(JSON.stringify("okej"));
            });
        }
    })
}

module.exports = {
    playerIdController,
    playerProfileController,
    changeNickController,
    changeEmailController,
    changeEmailActivationController,
    changePhotoController
};