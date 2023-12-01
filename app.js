const express = require("express");
const Blog = require("./models/blog");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const morgan = require("morgan");

//register view engine
app.set("view engine", "ejs");

// MIDDLEWARE
// app.use((req, res, next) => {
//   console.log("req", req.hostname);
//   console.log("req", req.path);
//   console.log("req", req.method);
//   next();
// });

//   MIDDLEWARE & STATIC FILE
//NOTe: morgan is a middleware to log info about the req
app.use(morgan("dev"));
//express.static()
// allows to make some images, scc public by browser
app.use(express.static("public"));

//use a body parser to accept form data
// this allows to collect info from client side and
// convert them into string object and save to db
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
  //   const blogs = [
  //     {
  //       title: "John Doe",
  //       snippet: " this is the snippet for John Doe",
  //       body: "this is body ",
  //     },
  //     {
  //       title: "Smith G",
  //       snippet: " Smith has a very good snippet",
  //       body: "this is body for Smith",
  //     },
  //     {
  //       title: "Martinez Ngozalo",
  //       snippet: " this is the snippet for martinez N.",
  //       body: "this body of Martinez....",
  //     },
  //   ];
  //   res.render("index", { title: "Home", blogs });
});

// .render(route, callback) methd to send the file to indicated route
// we may pass an object as 2nd param and access it in our ejs file
//to access it in ejs, we do  <%=name prop%>

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//BLOGS ROUTES

// create a route via which we can add blogs
// app.get("/add-blog", (req, res) => {
//   const blog = new Blog({
//     title: "new Blog1",
//     snippet: "this is my new blog",
//     body: "Much more blogs to come",
//   });
//   blog
//     .save()
//     .then((result) => {
//       res.send(result);
//     })

//     .catch((e) => console.log("error occured ", e));
// });

app.get("/blogs", (req, res) => {
  Blog.find().then((data) => {
    res.render("index", { title: "All Blogs", blogs: data });
  });
  //res.render("blogs", { title: "blogs" });
});

app.post("/blogs", (req, res) => {
  //console.log("body", req.body);

  const blog = new Blog(req.body);
  console.log(blog);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((e) => console.log(e));
});

//create a new blog at create page
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create" });
});

//get a single blog
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id.trim();
  console.log("blog id", id);

  //use the id to find the blog doc and render
  // it in new page as singleblog page
  Blog.findById(id)
    .then((result) => {
      res.render("singleblog", { title: "Blog details", blog: result });
    })
    .catch((e) => console.log("error occured ", e));
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      console.log("result ", result);
      //send the result as json obj
      res.json({ redirect: "/blogs" });
    })
    .catch((er) => console.error(er));
});

//not found page
app.use((req, res) => {
  res.render("404", { title: "404" });
});

mongoose
  .connect(process.env.BLOG_URI)
  .then(() => {
    console.log("successfull connect to db");

    app.listen(3000, () => {
      console.log("you are listening to port 3000");
    });
  })
  .catch((er) => console.log("failed to connect ", er));
