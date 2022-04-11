const seedDB                = require("./seeds"),
      express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      Campground            = require("./models/campground"),
      Comment               = require("./models/comment");
      User                  = require('./models/user'),
      flash                 = require("connect-flash"),
      path                  = require("path"),
      passport              = require("passport"),
      methodOverride        = require("method-override"),
      passportLocalMongoose = require("passport-local-mongoose"),
      catchAsync            = require('./utils/catchAsync'),
      ExpressError          = require('./utils/ExpressError'),
      Review                = require("./models/review"),
      session               = require('express-session'),
      ExpressError          = require('./utils/ExpressError');

      
const commentRoutes         = require("./routes/comments"),
      campgroundRoutes      = require("./routes/campgrounds"),
      indexRoutes           = require("./routes/index"),
      reviews               = require('./routes/reviews');

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //For secured cookies
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash());
// seedDB();

// Passport Configurations
app.use(require("express-session")({
    secret: "Moryso is the best Node-js Developer in the universe",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To display only specific content when not logged in
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use('/campgrounds/:id/reviews', reviews)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`YelpCamp server running on port ${PORT}`);
  });

// app.listen(3000, (req, res) => {
//     console.log("YelpCamp server running on port 3000")
// })