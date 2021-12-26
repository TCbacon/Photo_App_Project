const postsMiddleWare = {};
const {getCommentsForPost} = require('../models/comments');
const {getNRecentPosts, getPostById} = require("../models/Posts");


postsMiddleWare.getRecentPosts = async function (req, res, next) {

    try {
        let results = await getNRecentPosts(8);
        res.locals.results = results;

        if (results && results.length == 0) {
            req.flash('error', 'There are no posts created yet.');
        }
        next();
    }

    catch (err) {
        next(err);
    }
}

postsMiddleWare.getPostById = async function(req,res,next){
    try{
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length){
            res.locals.currentPost = results[0];
            next();
        }

        else{
            req.flash("error","not the post you are looking for.");
            res.redirect('/');
        }
    }

    catch(error){
        next(error);
    }
}
postsMiddleWare.getCommentsByPostId = async function(req, res, next) {
    let postId = req.params.id;

    try{
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    }

    catch(err){
        next(err);
    }
}



module.exports = postsMiddleWare;