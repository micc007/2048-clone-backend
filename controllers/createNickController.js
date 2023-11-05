const User = require("../models/users");

const createNickController = (req, res) => {

    User.findOne({nick: req.body.nick_input}).then((foundUser) => {
        if(foundUser){
            return res.render("create_nick", {message: `Username ${req.body.nick_input} is already taken`});
        }
        else {
            User.findOneAndUpdate({email: req.user.email},{nick: req.body.nick_input}).then(() => {
                res.redirect("/game");
            })
            .catch((err) => {
                console.log(err);
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })

}

module.exports = createNickController;