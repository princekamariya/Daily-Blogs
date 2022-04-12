//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const homeStartingContent = "Anyone can write on Daily Blogs. Thought-leaders, journalists, experts, and individuals with unique perspectives share their thinking here. You’ll find pieces by independent writers from around the globe, stories we feature and leading authors, and smart takes on our own suite of blogs and publications.";
const aboutContent = "We are creating a new model for digital publishing. One that supports nuance, complexity, and vital storytelling without giving in to the incentives of advertising. It’s an environment that’s open to everyone but promotes substance and authenticity. And it’s where deeper connections forged between readers and writers can lead to discovery and growth. Together with millions of collaborators, we’re building a trusted and vibrant ecosystem fueled by important ideas and the people who think about them.";
const contactContent = "We can't solve your problem if you don't tell us about it! So if you are having any problem just email at kamriyaprince@gmail.com , we will contanct you ASAP.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = {
  email: String,
  username: String,
  password: String
}

const postSchema = {
  title: String,
  content: String
};


mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});



const User = mongoose.model("User",userSchema);
const Post = mongoose.model("Post", postSchema);


app.get("/home", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register", function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
   });
 
    newUser.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect("/home");
      }
    })
 });
});

app.post("/login", function(req,res){

  const username = req.body.email;
  const email = req.body.email
  const password = req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result==true){
            res.redirect("/home");
          }
        })
      }
    }
  })
});

app.get("/logout", function(req,res){
  res.redirect("/");
})

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
