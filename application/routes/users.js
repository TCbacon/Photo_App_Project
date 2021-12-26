

var UserError = require('../helpers/error/UserError');
var express = require('express');
var router = express.Router();
const { validateLogin, validateRegistration } = require('../middleware/validation');
const UserModel = require("../models/Users");
const { successPrint } = require("../helpers/debug/debugprinters");
var multer = require('multer');
var sharp = require('sharp');
var crypto = require('crypto');


router.post('/register', validateRegistration, (req, res, next) => {
  let password = req.body.password;
  let username = req.body.username;
  let cpassword = req.body.cpassword;
  let email = req.body.email;

  UserModel.usernameExists(username)
    .then((userNameDoesExist) => {
      if (userNameDoesExist) {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      }

      else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      }
      else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new UserError(
          "Server Error, user could not be created.",
          "/registration",
          500
        );
      }
      else {
        req.flash('success', 'user account made');
        res.redirect('/login');
      }
    }).
    catch((err) => {
      if (err instanceof UserError) {
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      }
      else {
        next(err);
      }
    });
});

router.post('/login', validateLogin, (req, res, next) => {
  let password = req.body.password;
  let username = req.body.username;

  UserModel.authenticate(username, password).then((loggedUserId) => {
    if (loggedUserId > -1) {
      req.session.username = username;
      req.session.userId = loggedUserId;
      req.flash('success', 'you logged in successfully!');
      res.locals.logged = true;
      //res.locals.user = username;

      successPrint(res.locals);

      req.session.save(err => {
        res.redirect('/');
      });
    }

    else {
      throw new UserError("Invalid username and/or password!", "/login", 200);
    }
  })
    .catch((err) => {
      if (err instanceof UserError) {
        res.status(err.getStatus());
        req.flash('error', err.getMessage());
        req.session.save(err => {
          res.redirect("/login");
        });
      }
      else {
        next(err);
      }
    });
});


router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    else {
      res.clearCookie('csid');
      res.json({ status: "OK", message: "User logged out" });
    }
  });
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/avatars");
  },

  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split('/')[1];
    let randomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${randomName}.${fileExt}`);
  }
});

var uploader = multer({ storage: storage });

router.post("/avatar", uploader.single("avatar"), (req, res, next) => {
  let fileUpload = req.file.path;
  let avatar = `avatar-${req.file.filename}`;
  let avatarDest = req.file.destination + "/" + avatar;
  let userId = req.session.userId;

  successPrint(fileUpload);
  sharp(fileUpload)
    .resize(80, 50)
    .toFile(avatarDest)
    .then(() => {
      return UserModel.avatarChange
        (userId,
          avatarDest,
          fileUpload);
    })
    .then((isSuccess) => {
      successPrint(isSuccess);
      if (isSuccess) {
        req.flash("success", "avatar changed");
        res.json({avatar: avatarDest, message: "avatar changed", status:'OK', redirect:"/"});
      }

      else {
        res.json({avatar: avatarDest, message: "avatar cannot be changed", status:'OK', redirect:"/"});
      }
    })
    .catch((err) => {
      if (err instanceof UserError) {
        req.flash("error", "error changing avatar");
      }

      else{
        next(err);
      }
 
    });
});

module.exports = router;
