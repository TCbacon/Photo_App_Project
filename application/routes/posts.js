var express = require('express');
var router = express.Router();
var sharp = require('sharp');
var multer = require('multer');
//to mangle file name
var crypto = require('crypto');
const PostError = require('../helpers/error/PostError');
var validatePost = require('../middleware/postvalidation');
var PostModel = require("../models/Posts");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads");
    },

    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });



router.post('/createPost', uploader.single("uploadImage"),  validatePost, (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    sharp(fileUploaded)
        .resize(250, 200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create
                (title,
                    description,
                    fileUploaded,
                    destinationOfThumbnail,
                    fk_userId);
        })
        .then((postWasCreated) => {
            if (postWasCreated) {
                req.flash('success', 'your post was created successfully!');
                res.json({ status: "OK", message: "post was created", redirect: "/" });
            }
            else {
                res.json({ status: "OK", message: "Post could not be created!", redirect: "/postImage" })
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                req.flash("error", err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }

            else {
                next(err);
            }
        });

});

router.get('/search', async (req, res, next) => {

    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
           
            res.send({
                resultsStatus: 'info'
                , message: "No search term given",
                results: []
            })
        }

        else {
            let results = await PostModel.search(searchTerm);
            if (results && results.length) {

                res.send({
                    resultsState: "info",
                    message: `${results.length} posts found`,
                    results: results
                });
            }
            else {

                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    resultsStatus: 'info',
                    message: "No results found, here are 8 recent posts",
                    results: results
                });

            }
        }
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;