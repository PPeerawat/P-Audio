

const   express = require('express'),
        router  = express.Router(),
        Artist    = require('../models/artist'),
        Song    = require('../models/song'),
        User    = require('../models/user'),
        middlewareObj  = require('../middleware');

router.get('/:id', middlewareObj.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate('songs').exec(function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(req.isAuthenticated()){
                User.findById(req.user._id, function(err, User){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render('print/fav.ejs', {user: foundUser, });
                    }
                });
            }
            else{
                res.render('print/info_song.ejs', {infoSong: foundSong});
            } 
        }
    });
});

module.exports = router;