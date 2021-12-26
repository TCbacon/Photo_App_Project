
const routeProtectors = {};


routeProtectors.userIsLoggedIn = function(req, res, next) {
    if(req.session.username){
        next();
    }

    else{;
        req.flash('error', 'you must be logged in to create a post!');
        res.redirect('/login');
    }
}

module.exports = routeProtectors;