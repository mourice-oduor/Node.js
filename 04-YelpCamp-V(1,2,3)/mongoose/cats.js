var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

// mongoose.connect("mongodb://localhost/cat_app", { useNewUrlParser: true, useUnifiedTopology: true});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temparament: String
})

var Cat = mongoose.model("Cat", catSchema)

// adding a new cat to the DB
// when running this, make sure the =>> Cat.create is commented first
var myCat = new Cat({
    name: "George",
    age: 15,
    temparament: "Good"
})

myCat.save(function (err, cat) {
    if (err) {
        console.log("SOMETHING WENT WRONG!")
    } else {
        console.log("WE JUST SAVED ANOTHER CAT TO THE DB:")
        console.log(cat)
    }
});

// Cat.create({
//     name: "Snow White",
//     age: 12,
//     temparament: "Bland"
// }, function (err, cat) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(cat)
//     }
// })

//retrieve all cats from the DB and console.log each one
Cat.find({}, function (err, cats) {
    if (err) {
        console.log("OH NO! ERROR AGAIN!!")
        console.log(err)
    } else {
        console.log("ALL THE CATS .....")
        console.log(cats)
    }
})