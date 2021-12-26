var db = require("../config/database");
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = 'INSERT INTO comments (comment, fk_postId, fk_userId, created)\
    VALUES(?,?,?, now());';

    return db.query(baseSQL, [comment, postId, userId])
    .then(([results, fields]) => {
        if(results && results.affectedRows){
            return Promise.resolve(results.insertId);
        }
        else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) => {
        return Promise.reject(err);
    })
}

CommentModel.getCommentsForPost = (userId) => {
    let baseSQL = 'SELECT u.username, c.comment, c.created, c.id, u.avatar\
    FROM comments c JOIN users u on u.id=fk_userid \
    WHERE c.fk_postid=? \
    ORDER BY c.created DESC';
    return db.query(baseSQL, [userId])
    .then(([results,fields]) =>{
        return Promise.resolve(results);
    })
    .catch((err) => {
        return Promise.reject(err);
    })
}

module.exports = CommentModel;