var express = require('express');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var router = express.Router();
const { create } = require('../models/comments');

router.post('/create', (req, res, next) => {
    if (!req.session.username) {
        res.json({
            code: -1,
            status: "danger",
            message: "must be logged in to create comment"
        });
    }

    else {
        let { comment, postId } = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
        let avatar = res.locals.userprofile.avatar;


        create(userId, postId, comment)
            .then((wasSuccessful) => {
                if (wasSuccessful != -1) {
                    res.json({
                        code: 1,
                        status: "success",
                        message: "comment created",
                        comment: comment,
                        avatar: avatar,
                        username: username
                    });
                }

                else {
                    req.json({
                        code: -1,
                        status: "danger",
                        message: "comment not created"
                    });
                }
            })
            .catch((err) => {
            return next(err)});
    }
});

module.exports = router;