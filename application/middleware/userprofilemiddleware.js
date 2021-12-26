
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
var {getAvatar} = require('../models/Users');
let userProfile = {};


userProfile.getAvatar = async (req, res, next) => {

    try{
        let userId = req.session.userId;
        let results = await getAvatar(userId);
        
        if(results && results != -1 && results.length != 0){
            res.locals.userprofile = results[0];
        }
        next();
    }

    catch(err){
        next(err);
    }

}


module.exports = userProfile;