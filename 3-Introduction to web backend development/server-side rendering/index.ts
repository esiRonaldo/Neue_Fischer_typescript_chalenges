
import express from "express";
import nunjucks from "nunjucks";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});

app.get("/", (req, res) => {
  res.render("index.njk", { title: "Home" });
});

app.use(express.static("public"));


app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});