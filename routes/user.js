
const   express = require('express'),
        router  = express.Router(),
        Artist    = require('../models/artist'),
        Song    = require('../models/song'),
        User    = require('../models/user'),
        middlewareObj  = require('../middleware');

router.get('/manage', function(req, res){
    User.find({}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render('user/manageUser', {user: foundUser});
        }
    });
});

router.get('/:id', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash('error', 'There is something wrong!');
            res.redirect('/');
        }
        else{
            res.render('user/show.ejs', {user: foundUser});
        }
    });
});

router.get('/:id/edit', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            res.render('user/editUser.ejs', {user: foundUser});
        }
    });
});

router.delete('/:id', function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success', 'Remove successfully');
            res.redirect('back');
        }
    });
});

router.post("/favorite/:id", middlewareObj.isLoggedIn, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err){
            console.log(err);
        }
        else{
            User.findByIdAndUpdate(req.user._id, {$push: {songs: foundSong}}, function(err, foundUser){
                if(err){
                    console.log(err);
                }
                else{
                    foundSong.fav = foundSong.fav + 1;
                    foundSong.save();
                    req.flash('success', 'Saved to your favorite');
                    res.redirect('back');
                }
            });
        }
    });
});

router.post("/unfavorite/:id", middlewareObj.isLoggedIn, function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err){
            console.log(err);
        }
        else{
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                }
                else{
                    foundUser.songs.pull(foundSong);
                    foundSong.fav = foundSong.fav - 1;
                    foundUser.save();
                    foundSong.save();
                    req.flash('success', 'Deleted your favorite song');
                    res.redirect('back');
                }
            });
        }
    });
});

router.put('/:id', function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedArtist){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            req.flash('success', 'User information was updated successfully');
            res.redirect('/user/' + req.params.id);
        }
    });
});



module.exports = router;