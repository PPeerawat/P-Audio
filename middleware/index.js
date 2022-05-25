const   Artist = require('../models/artist'),
        Song   = require('../models/song'),
        User   = require('../models/user');

const   middlewareObj = {};
        
        
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first.');
    res.redirect('/login');
}

module.exports = middlewareObj;