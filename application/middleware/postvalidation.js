
var errorMsg = "";

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function checkValidPost(fileUploaded, title, description, fk_userId){
    if(!fileUploaded ||  isEmptyOrSpaces(title)  || isEmptyOrSpaces(description) || !fk_userId){
        errorMsg ="Make sure form is not empty!";
        return false;
    }

    if(fileUploaded){
        let ext = fileUploaded.mimetype.split("/")[1];
        if(ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg' && ext !== 'jfif') {
            errorMsg ="File must be an image!";
            return false;
        }
    }

    return true;
}

const validatePost = (req, res, next) =>{
    let fileUploaded = req.file;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    if(!checkValidPost(fileUploaded, title, description, fk_userId)){
        req.flash('error', errorMsg);
        res.json({message: errorMsg, redirect: "/postimage"});
    }

    else{
        next();
    }

}

module.exports = validatePost;