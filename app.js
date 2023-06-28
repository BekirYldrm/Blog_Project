const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeContent = " Hello, this project is a code exercise I did to improve myself. With this project, it is aimed to have information about database and back-end services. In this project, there are many features such as generating answers for get and post requests and using the project in interaction with the database.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


mongoose.connect("mongodb+srv://bekir_yildirim:25.08.2001Bekir@cluster0.z4l3wpv.mongodb.net/BlogDB");

const postSchema = mongoose.Schema({ title: String, content: String });
const postModel = mongoose.model("Post", postSchema);


app.get("/", function (req, res) {
    postModel.find().then(docs => {
        res.render("home", { homeContent: homeContent, posts: docs });
    }).catch(err => { });

});

app.get("/about", function (req, res) {
    res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
});
app.get("/compose", function (req, res) {
    res.render("compose")
});


app.post("/compose", function (req, res) {
    const post = new postModel({
        title: req.body.composeInput,
        content: req.body.composeTextarea
    });
    post.save().then(function () {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
    });
});



app.get("/post/:postName", function (req, res) {
    const urlTitle = _.lowerCase(req.params.postName);
    postModel.find().then(posts => {
        posts.forEach(function (post) {
            const postTitle = _.lowerCase(post.title);
            if (urlTitle === postTitle) {
                res.render("post", { postTitle: post.title, postContent: post.content });
            }
        });
    });
});


app.listen(3000 || process.env.POST, function () {
    console.log("Sunucu 3000 portunda çalışıyor.");
});