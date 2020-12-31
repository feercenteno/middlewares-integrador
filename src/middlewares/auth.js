const auth = (req, res, next) => {

    if(req.session.userLog){
        return next();
    }
    return res.redirect('/user/login');
}

module.exports = auth;