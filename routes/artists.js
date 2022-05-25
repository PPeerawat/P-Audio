const   express = require('express'),
        router  = express.Router(),
        Artist    = require('../models/artist'),
        Song    = require('../models/song'),
        User    = require('../models/user'),
        middlewareObj  = require('../middleware');


router.get("/new", function(req, res){
    res.render("print/newArtist.ejs");
});

router.post("/", middlewareObj.isLoggedIn, function(req, res){
    Artist.create(req.body.artist, function(err, newlyAdded){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    });
});

router.get("/:id", function(req, res){
    Artist.findById(req.params.id).populate('songs').exec(function(err, foundArtist){
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
                        res.render('print/info_artist.ejs', {infoArtist: foundArtist, songUser: foundUser.songs});
                    }
                });
            }
            else{
                res.render('print/info_artist.ejs', {infoArtist: foundArtist});
            } 
        }
    });
});

router.get('/:id/edit', function(req, res){
    Artist.findById(req.params.id, function(err, foundArtist){
        if(err){
            console.log(err);
        }
        else{
            res.render('print/editArtist.ejs', {artist: foundArtist});
        }
    });
});

router.put('/:id', function(req, res){
    Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err, updatedArtist){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            Song.updateMany({$set:{artist:{name: req.body.artist.name, id: req.params.id}}}).where('artist.id').equals(req.params.id).exec(function(err, updatedSong){
                if(err){
                    console.log(err);
                }
                else{
                    req.flash('success', 'Artist was updated successfully');
                    res.redirect('/allArtist'); 
                }
            });
        }
    });
});

router.delete('/:id', function(req, res){
    Artist.findByIdAndRemove(req.params.id, function(err, foundArtist){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            Song.deleteMany().where('artist.id').equals(req.params.id).exec(function(err){
                if(err){
                    console.log(err);
                }
                else{
                    req.flash('success', 'Artist has been deleted');
                    res.redirect('/');
                }
            });
        }
    });
});

module.exports = router;