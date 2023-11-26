const express = require("express");
const app = express();

//register view engine
app.set("view engine", "ejs");

//use .render(route, callback) to send the file to indicated route
// we may pass an object as 2nd param and access it in our ejs file
//to access it in ejs, we do  <%=name prop%>
app.get("/", (req, res) => {
  const blogs = [
    {
      title: "John Doe",
      snippet: " this is the snippet for John Doe",
      body: "this is body ",
    },
    {
      title: "Smith G",
      snippet: " Smith has a very good snippet",
      body: "this is body for Smith",
    },
    {
      title: "Martinez Ngozalo",
      snippet: " this is the snippet for martinez N.",
      body: "this body of Martinez....",
    },
  ];
  res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Create" });
});
app.use((req, res) => {
  res.render("404", { title: "404" });
});

app.listen(3000, () => {
  console.log("you are listening to port 3000");
});
