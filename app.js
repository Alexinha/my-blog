const express = require("express");

const ejs = require("ejs");

const _ = require("lodash");

const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// --------- make new database -------------
main().catch(err => console.log(err));

async function main() {
  //connect to mongodb and create a new DB called blogDB
  await mongoose.connect("mongodb://localhost:27017/blogDB");
}

const journalSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Journal = mongoose.model("Journal", journalSchema);





// ---- let the home page show the added posts using .find() ------
app.get("/", function(req, res) {

  Journal.find(function(err, journals) {

    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        journals: journals
      });

    }
  });
});

// ----- for the back to home page button -----
app.post("/", function(req, res){
  res.redirect("/");
});


app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});


//----- add the input into database -------

app.post("/compose", function(req, res) {

  const journal = new Journal({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  journal.save(function(err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });

});


//------ let read more lead to the full text of one particular blog, -----
//------ and the route should based on blog's document id in the database -----

app.get("/posts/:postId", function(req, res) {

  const id = req.params.postId;

  Journal.findById(id, function(err, journal) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        title: journal.title,
        content: journal.content,
        uniqueId: id
      });
    }
  });

});


app.post("/delete", function(req, res){
  const id = req.body.deleteBtn;
  Journal.findByIdAndDelete(id, function(err, journal){
    if(err){
      console.log(err);
    } else {
      res.redirect("/");
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
