const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nick: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String
    },
    pic: {
        type: String
    },
    wins: {
        type: Number
    },
    avgScore: {
        type: Number
    },
    avgMoves: {
        type: Number
    },
    google: {
        type: Boolean
    },
    activated: {
        type: Boolean
    },
    actLink: {
        type: String
    },
    passReset: {
        type: String
    },
    passResetTimestamp: {
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model("users", userSchema)

module.exports = User;