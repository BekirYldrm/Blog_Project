import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from 'mongoose';

const app = express();

app
    .set("view engine", "ejs")
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"));

const homeContent = "Hello our user, You can create your own blog page by filling out the form in the compose section of this site. Our aim on this site is to be informed about the latest posts of bloggers that interest you and to create your own blog page";

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
        res.render("about");
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