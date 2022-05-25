const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        Artist      = require('../models/artist'),
        Song        = require('../models/song'),
        passport    = require('passport'),
        middlewareObj  = require('../middleware'),
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

router.get("/", function(req, res){
    Artist.find({}).populate('songs').exec(function(err, allArtist){
        if(err){
            console.log(err);
        }
        else{
            Song.find({}, function(err, allSong){
                if(err){
                    console.log(err);
                }
                else{
                    let sortFav1 = allSong.sort(function(a, b){
                        return parseInt(a.fav) - parseInt(b.fav);
                    });
                    let sortFav2 = sortFav1.reverse(function(a, b){
                        return parseInt(a.fav) - parseInt(b.fav);
                    });
                    let genre = Song.distinct('type', function(err, foundGenre){
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("landing.ejs", {artists:allArtist, sortFav: sortFav2, genre: foundGenre});
                        }
                    });
                    
                }
            });
        }
    });
});

router.get("/search", function(req, res){
    res.render("print/search.ejs");
});

router.get("/allArtist", function(req, res){
    Artist.find({}, function(err, allArtist){
        if(err){
            console.log(err);
        }
        else{
            res.render("print/allArtist.ejs", {artists: allArtist});
        }
    });
});

router.get("/top15fav", function(req, res){
    Song.find({}).populate('artist'). exec(function(err, allSong){
        if(err){
            console.log(err);
        }
        else{
            let sortFav1 = allSong.sort(function(a, b){
                return parseInt(a.fav) - parseInt(b.fav);
            });
            let sortFav2 = sortFav1.reverse(function(a, b){
                return parseInt(a.fav) - parseInt(b.fav);
            });
            if(req.isAuthenticated()){
                User.findById(req.user._id, function(err, foundUser){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("print/top15fav.ejs", {sortFav: sortFav2, songUser: foundUser.songs});
                    }
                });
            }
            else{
                res.render("print/top15fav.ejs", {sortFav: sortFav2});
            } 
        }
    });
});

router.get("/playlist", middlewareObj.isLoggedIn, function(req, res){
    res.render("print/playlist.ejs");
});

//login**************************************************
router.get("/login", function(req, res){
    res.render("login.ejs");
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true,
        successFlash: 'Successfully login.',
        failureFlash: 'Incorrect username or password.'
    }), function(req, res){
});
//********************************************************

//*register*********************************************************
router.get("/register", function(req, res){
    res.render("register.ejs");
});

//รับ form มาจาก register.ejs
router.post('/register', function(req, res){
    let newUser = new User({
        username:   req.body.username,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email
    });
    if(req.body.adminCode === 'topsecret'){
        newUser.isAdmin = true;
    }
    //register user เข้าระบบ-------
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        else{
            passport.authenticate('local')(req, res, function(){
                req.flash('success', user.username + ',Welcome to P|Audio.');
                res.redirect('/');
            });
        }
    });
    //---------------------------
});
//*********************************************************************

//logout*********************************************
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Log you out successfully.');
    res.redirect('/');
});
//**************************************************


module.exports = router;