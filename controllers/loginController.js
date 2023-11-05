const flash = require("express-flash");

const loginGetController = (req, res) => {
    req.flash('message');
    res.render("login");
}

module.exports = {
    loginGetController
};