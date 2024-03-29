const seedDB = require("./seeds"),
    express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
seedDB();


// Campground.create(
//     {
//         name: "Rapids Camp, Sagana", 
//         image: "https://i.imgur.com/8G5IehWb.jpg",
//         description: "Camp friendly to your wallet. You will get a tent, cooking utensils, refrigeration, cutlery, gas burners, jikos, a barbeque burner, and meeting facilities like chairs and whiteboards. Facilities which are provided at an additional fee include charcoal, firewood for the camp fire, sleeping bags, cooking gas and a cook or a chef."
//     }, 
//     function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("NEWLY CREATED CAMPGROUND:")
//             console.log(campground)
//         }
//     });

// var campgrounds = [
//     { name: "Camp Malta", image: "https://i.imgur.com/uEepnRVb.jpg" },
//     { name: "Wildebeest Eco Camp", image: "https://i.imgur.com/crBESiab.jpg" },
//     { name: "Camp Ya Kanzi", image: "https://i.imgur.com/a785ZXCb.jpg" },
//     { name: "Rapids Camp, Sagana", image: "https://i.imgur.com/8G5IehWb.jpg" },
//     { name: "Malewa Bush Ventures", image: "https://i.imgur.com/1ZqCkDEb.jpg" },
//     { name: "Camp Carnelley�s", image: "https://i.imgur.com/eTOogftb.jpg" },
//     { name: "El Karama", image: "https://i.imgur.com/4RSDCkkb.jpg" },
//     { name: "Kiboko Camp", image: "https://i.imgur.com/J9Gp9cKb.jpg" },
//     { name: "Mamba Village", image: "https://i.imgur.com/eUonOB7s.jpg" },
//     { name: "Thompson Falls Lodge Camp", image: "https://i.imgur.com/OHTymcR.jpg" },
//     { name: "Olorgesailie", image: "https://i.imgur.com/tyU7nrC.jpg" },
//     { name: "Hell\'s Gate Gorge", image: "https://i.imgur.com/WFyTL7yb.jpg" }
// ]


app.get("/", function(req, res){
    res.render("landing")
})

//INDEX ROUTE- shows all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
    
});

//CREATE ROUTE-- Add new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = {name: name, image: image, description: desc}

    //campgrounds.push(newCampground)
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    });
});

//NEW ROUTE-- show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
})

//SHOW ROUTE-- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });  
});

//Comments ROUTE
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

app.listen(3000, function(req, res){
    console.log("YelpCamp server serving on port 3000")
})