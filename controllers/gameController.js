const User = require("../models/users");
const Leaderboard = require('../models/leaderboard');

const gameController = (req, res) => {
    res.render('game');
}

const gameOverController = (req, res) => {
    console.log(req.body.score)
    console.log(req.body.moves)
    console.log(req.body.size)

    Leaderboard.findOne({nick: req.user.nick}).then((foundUser) => {
        if(!foundUser){
            const leaderboard = new Leaderboard({
                nick: req.user.nick,
                highscore: req.body.score,
                moves: req.body.moves,
                fieldSize: req.body.size
            }).save().then(() => {
                console.log("new recond in leaderboard created")
                res.send(JSON.stringify("new recond in leaderboard created"));
            })
        }
        else {
            if(foundUser.highscore < req.body.score){
                Leaderboard.updateOne({_id: foundUser.id}, {highscore: req.body.score, moves: req.body.moves, fieldSize: req.body.size}).then(() => {
                    console.log("leaderboard record updated");
                    res.send(JSON.stringify("leaderboard record updated"));
                });
            }
            else {
                console.log("score not higher than the record on leaderboard");
                res.send(JSON.stringify("score not higher than the record on leaderboard"));
            }
        }
    })
}

module.exports = {
    gameController,
    gameOverController
};