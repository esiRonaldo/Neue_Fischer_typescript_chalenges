import express from "express";
import nunjucks from "nunjucks";
import posts from "./posts.json" with {type:"json"}

const app = express();
const port = 3000;

// app.use("/static", express.static("public"));
app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});

app.get("/", (_req, res) => {
  res.render("index.njk", { posts });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
