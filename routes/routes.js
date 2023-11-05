const express = require("express");
const router = express.Router();
const passport = require("passport");

const { gameController, 
        gameOverController 
      } = require("../controllers/gameController.js");
const { playerIdController, 
        playerProfileController, 
        changeNickController, 
        changeEmailController, 
        changeEmailActivationController, 
        changePhotoController 
      } = require("../controllers/playerController.js");
const leaderboardController = require("../controllers/leaderboardController.js");

const { registrationController, activationController } = require("../controllers/registrationController.js");
const { loginGetController } = require("../controllers/loginController.js");
const { forgotPasswordController, forgotPasswordResetController } = require("../controllers/forgotPasswordController.js");

const createNickController = require("../controllers/createNickController.js");

// middleware for checking if user is logged in

const accessGranted = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// main routes to the game

router.get("/", accessGranted, (req, res) => {
    if(req.user.nick === null) return res.redirect("/create-nick");
    res.redirect("/game");
});

router.get("/game", accessGranted, gameController);

router.post("/game_over", accessGranted, gameOverController);

// routes for leaderboard and player profiles

router.get("/player_profile", accessGranted, playerProfileController);

router.post("/player_profile/change/nick", accessGranted, changeNickController);

router.post("/player_profile/change/email", accessGranted, changeEmailController);

router.get("/player_profile/change/email/activation/:id/:email", changeEmailActivationController);

router.post("/player_profile/change/photo", accessGranted, changePhotoController);

router.get("/leaderboard", accessGranted, leaderboardController);

router.get("/player/:nick", accessGranted, playerIdController);

// routes for registration

router.get("/registration", (req, res) => {
    res.render("registration");
});

router.post("/registration", registrationController);

router.get("/account-activation/:token", activationController);

// routes for logging in and logging out

router.get("/login", loginGetController);

router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/login-google", passport.authenticate('google', {
        scope: ['email'],
    })
);

router.get("/login-google/success", passport.authenticate('google'), (req, res) => {
    if(req.user.nick === null){
        res.redirect("/create-nick");
    }
    else {
        res.redirect("/game");
    }
});

router.get("/logout", accessGranted, (req, res) => {
    req.logout();
    res.redirect("/");
})

// routes for restoring a forgotten password

router.get("/forgot_password", (req, res) => {
    res.render("forgot_password");
});

router.get("/forgot_password/:token", (req, res) => {
    res.render("forgot_password_reset", {token: req.params.token});
});

router.post("/forgot_password", forgotPasswordController);

router.post("/forgot_password_reset", forgotPasswordResetController);

// routes for creating players nickname when they are logging in for the first time

router.get("/create-nick", accessGranted, (req, res) => {
    if(req.user.nick === null) return res.render("create_nick");
    res.redirect("/");
})

router.post("/create_nick", createNickController);



module.exports = router;