const   express = require('express'),
        router  = express.Router(),
        Artist  = require('../models/artist'),
        User    = require('../models/user'),
        Song    = require('../models/song'),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
                    destination: function(req, file, callback){
                        callback(null, './public/upload');
                    },
                    filename: function(req, file, callback){
                        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                    }
        }),
        audioFilter = function(req, file, callback){
            if(!file.originalname.match(/\.(ape|wv|m4a|mpeg4|mp3)$/i)){
                return callback(new Error('Only ape, wv, m4a, mpeg4 and mp3.'), flase);
            }
            callback(null, true);
        },
        upload  = multer({storage: storage, fileFilter: audioFilter});

router.get("/new", function(req, res){
    Artist.find({}, function(err, foundArtist){
        if(err){
            console.log(err);
        }
        else{
            res.render("print/newSong.ejs", {artists: foundArtist});
        }
    });
});

router.post("/", upload.single('audio'), function(req, res){
    Artist.findOne().where('name').equals(req.body.artist).exec(function(err, foundArtist){
        if(err){
            console.log(err);
        }
        else{
            req.body.song.audio = '/upload/' + req.file.filename;
            Song.create(req.body.song, function(err, newlyAdded){
                if(err){
                    console.log(err);
                }
                else{
                    newlyAdded.artist.id = foundArtist._id;
                    newlyAdded.artist.name = foundArtist.name;
                    newlyAdded.save();
                    foundArtist.songs.push(newlyAdded);
                    foundArtist.save();
                    req.flash('success', 'New song added');
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/genre/:genre', function(req, res){
    Song.find().where('type').equals(req.params.genre).exec(function(err, foundSong){
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
                        res.render('print/genre.ejs', {song: foundSong, genre: req.params.genre, songUser: foundUser.songs});
                    }
                });
            }
            else{
                res.render('print/genre.ejs', {song: foundSong, genre: req.params.genre});
            } 
        }
    });
});

router.get("/:id", function(req, res){
    Song.findById(req.params.id).populate('artist').exec(function(err, foundSong){
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
                        res.render('print/info_song.ejs', {infoSong: foundSong, songUser: foundUser.songs});
                    }
                });
            }
            else{
                res.render('print/info_song.ejs', {infoSong: foundSong});
            } 
        }
    });
});

router.get('/:id/edit', function(req, res){
    Song.findById(req.params.id, function(err, foundSong){
        if(err){
            console.log(err);
        }
        else{
            res.render('print/editSong.ejs', {song: foundSong});
        }
    });
});

router.put('/:id', function(req, res){
    Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, updatedSong){
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            req.flash('success', 'Song was updated successfully');
            res.redirect('/song/' + req.params.id);
        }
    });
});

router.delete('/:id', function(req, res){
    Song.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success', 'Song has been deleted');
            res.redirect('back');
        }
    });
});


module.exports = router;