const Leaderboard = require("../models/leaderboard");

const leaderboardController = async (req, res, next) => {
    const leaderboard = await Leaderboard.find();
    res.send(leaderboard);
}

module.exports = leaderboardController;