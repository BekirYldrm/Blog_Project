import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from 'mongoose';

const app = express();

app
    .set("view engine", "ejs")
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

const homeContent = " Hello, this project is a code exercise I did to improve myself. With this project, it is aimed to have information about database and back-end services. In this project, there are many features such as generating answers for get and post requests and using the project in interaction with the database.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


mongoose.connect("mongodb+srv://bekir_yldrm:25.08.2001Bekir@cluster0.lwpqqyp.mongodb.net/BlogDB");

const postSchema = mongoose.Schema({ title: String, content: String });
const postModel = mongoose.model("Post", postSchema);



app
    .get("/", (req, res) => {
        postModel.find()
            .then(docs => {
                res.render("home", { homeContent: homeContent, posts: docs });
            })
            .catch(err => { console.log(err); });
    })

    .get("/about", (req, res) => {
        res.render("about", { aboutContent: aboutContent });
    })

    .get("/contact", (req, res) => {
        res.render("contact", { contactContent: contactContent });
    })

    .get("/compose", (req, res) => {
        res.render("compose");
    })

    .get("/post/:postName", (req, res) => {
        const urlTitle = _.lowerCase(req.params.postName);  // küçük harflerle girdiğimiz dinamik parametreyi tutuyor
        postModel.find()
            .then(docs => {
                docs.forEach(doc => {
                    const postTitle = _.lowerCase(doc.title);
                    if (urlTitle === postTitle) {
                        res.render("post", { postTitle: doc.title, postContent: doc.content });
                    }
                });
            });
    })
    .get("/post", (req,res)=>{
        res.render("post", {postTitle:"Home" , postContent:homeContent});
    })

    .post("/compose", (req, res) => {
        const post = new postModel({
            title: req.body.composeTitle,
            content: req.body.composeContent
        });
        post.save().then(() => {
            res.redirect("/");
        }).catch(err => {
            console.log(err);
        });
    })

    .listen(3000 || process.env.POST, function () {
        console.log("The server is running on port 3000");
    });