
const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        flash       = require('connect-flash'),
        methodOverride = require('method-override'),
        Artist      = require("./models/artist"),
        Song        = require("./models/song"),
        User        = require("./models/user"),
        seedDB      = require("./seeds.js");

const   indexRoutes  = require('./routes/index'),
        artistRoutes = require('./routes/artists'),
        searchRoutes = require('./routes/search'),
        userRoutes   = require('./routes/user'),
        favRoutes    = require('./routes/favorite'),
        songRoutes   = require('./routes/songs');



mongoose.connect('mongodb://localhost/Paudio');

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

//เกี่ยวกับ login register-----------------------------------------
app.use(require('express-session')({
    secret: 'secret word',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//--------------------------------------------------------------

//อ้างอิงถึงตัว user-------------------------
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash('error');
    res.locals.success      = req.flash('success')
    next();
});
//--------------------------------------

app.use('/', indexRoutes);
app.use('/artist', artistRoutes);
app.use('/search', searchRoutes);
app.use('/song', songRoutes);
app.use('/user', userRoutes);
app.use('/favorite', favRoutes);


app.listen(3000, function(){
    console.log("P|Audio Activated");
})