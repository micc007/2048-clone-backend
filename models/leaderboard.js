const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
    nick: {
        type: String,
        required: true
    },
    highscore: {
        type: Number,
        required: true
    },
    moves: {
        type: Number,
        required: true
    },
    fieldSize: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Leaderboard = mongoose.model("highscores", leaderboardSchema)

module.exports = Leaderboard;