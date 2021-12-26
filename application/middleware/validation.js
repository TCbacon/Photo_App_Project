
var validator = require('validator');

let errorMsg = "";

function checkRegistration(username, email, password, cpassword) {
    let special = /[/*-+!@#$^&*]/g;
    let digit = /[0-9]/g;
    let upper = /[A-Z]/g;

    username = validator.trim(username);
    email = validator.trim(email);
    password = validator.trim(password);
    cpassword = validator.trim(cpassword);


    if (!validator.isEmail(email) || !username
        || !password || !cpassword) {
        errorMsg = "Registration Failed: form was filled in incorrectly.";
        return false;
    }

    else if (username.length < 4 || !username[0].match(/[a-zA-Z]/i)) {
        errorMsg = "Registration Failed: username does not meet requirements.";
        return false;
    }

    else if (!special.test(password) || !digit.test(password) || !upper.test(password)
        || password.length < 8 || (password != cpassword)) {
        errorMsg = "Registration Failed: password does not meet requirements.";
        return false;
    }

    return true;
}

function checkLoginInfo(username, password) {

    if (!validator.trim(password) || !validator.trim(username)) {
        errorMsg = "fields cannot be empty";
        return false;
    }

    return true;
}

const validateRegistration = (req, res, next) => {
    let password = req.body.password;
    let username = req.body.username;
    let cpassword = req.body.cpassword;
    let email = req.body.email;

    if (!checkRegistration(username, email, password, cpassword)) {
        req.flash("error", errorMsg);
        req.session.save(err => {
            res.redirect('/registration')
        });
    }

    else {
        next();
    }
};

const validateLogin = (req, res, next) => {
    let password = req.body.password;
    let username = req.body.username;

    if (!checkLoginInfo(username, password)) {
        req.flash("error", errorMsg);
        req.session.save(err => {
            res.redirect('/login');
        });
    }

    else {
        next();
    }
}

module.exports = { validateRegistration, validateLogin }