
var db = require("../config/database");
var bcrypt = require('bcrypt');
const { use } = require("../routes");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
const UserModel = {};

UserModel.create = (username, password, email) => {
    return bcrypt.hash(password, 15)
        .then((hashedPassword) => {

            let baseSQL = "INSERT INTO users \
        (username, \
        email, \
        password,\
        created) \
        VALUES (?,?,?, now());"
            return db.execute(baseSQL, [username, email, hashedPassword]);

        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            }
            else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });;
}


UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE username=?", [username])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

UserModel.emailExists = (email) => {
    return db.execute("SELECT * FROM users WHERE email=?", [email])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

UserModel.authenticate = (username, password) => {
    let userId;
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?";
    return db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                userId = results[0].id;
                return bcrypt.compare(password, hashedPassword);
            }

            else {
                return Promise.resolve(-1);
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) {
                return Promise.resolve(userId);
            }
            else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

UserModel.avatarChange = (userid, avatarpath, filepath) => {
    successPrint("inside avatar model");
    successPrint(userid);
    successPrint(avatarpath);
    successPrint(filepath);
    let baseSQL = "UPDATE users SET avatar=?, avatarpath=? WHERE id=?";

    if(!avatarpath || !userid){
        return false;
    }

    return db.execute(baseSQL, [avatarpath, filepath, userid])
        .then(([results, fields]) => {
            successPrint("can update avatar");
            return Promise.resolve(results && results.affectedRows == 1);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

UserModel.getAvatar = (userId) =>{
    if(!userId){
        return false;
    }
    let baseSQL = "SELECT id, avatar FROM users WHERE id=?;";
    return db.query(baseSQL, [userId])
    .then(([results, fields]) =>{
        if(results){
            return Promise.resolve(results);
        }
        
        else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) =>{
        return Promise.reject(err);
    })
}

module.exports = UserModel;