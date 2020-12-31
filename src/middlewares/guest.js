const guest = (req, res, next) => {
    
    if(!req.session.userLog){
        return next();
    }
    return res.redirect('/');
}

module.exports = guest;