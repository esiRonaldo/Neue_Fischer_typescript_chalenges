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

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const blogPosts = posts.map((post) => ({
  ...post,
  slug: slugify(post.title),
  date: formatDate(post.createdAt),
}));

app.get("/", (_req, res) => {
  res.render("index.njk", { posts: blogPosts });
});

app.get("/posts/:slug", (req, res) => {
  const post = blogPosts.find((p) => p.slug === req.params.slug);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("post.njk", { post });
});

app.get("/about", (_req, res) => {
  res.render("about.njk");
});

app.get("/contact", (_req, res) => {
  res.render("contact.njk");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
