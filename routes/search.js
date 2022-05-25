const   express = require('express'),
        router  = express.Router(),
        Artist    = require('../models/artist'),
        Song    = require('../models/song'),
        User    = require('../models/user');
        middlewareObj  = require('../middleware');

router.post("/", function(req, res){
    let search = req.body.search;
    res.redirect('/search/' + search);
});

router.get('/:search', function(req, res){
    let search = req.params.search;
    Song.find({nameSong: {$regex: search, $options: "i"}}, function(err, foundSong){
        if(err){
            console.log(err);
        }
        else{
            Artist.find({name: {$regex: search, $options: "i"}}, function(err, foundArtist){
                if(err){
                    console.log(err);
                }
                else{
                    
                    if(req.isAuthenticated()){
                        User.findById(req.user._id, function(err, foundUser){
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.render('print/search.ejs', {artists: foundArtist, songs: foundSong, search: search, songUser: foundUser.songs});
                            }
                        });
                    }
                    else{
                        res.render('print/search.ejs', {artists: foundArtist, songs: foundSong, search: search});
                    } 
                }
            });
        }
    });
});

module.exports = router;