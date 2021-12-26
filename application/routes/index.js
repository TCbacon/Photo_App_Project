var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');


/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('viewpost');
});

/* Registration Page */
router.get('/registration', function(req, res, next){
  res.render('registration');
});

/* Login Page */
router.get('/login', function(req, res, next){
  res.render('login');
});

router.get('/postimage', isLoggedIn);
/*Post Image Page */
router.get('/postimage', function(req, res, next){
  res.render('postimage');
});


/*Privacy */
router.get('/privacy', function(req, res, next){
  res.render('privacy');
});

/*single post */
router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) =>{
  res.render("postdetails", {title: `Post ${req.params.id}`});
});

module.exports = router;
