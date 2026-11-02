import express from "express";
import nunjucks from "nunjucks";

const app = express();
const port = 3000;
const events = [
  {
    name: "React Conf",
    date: "June 10, 2025",
    location: "Berlin",
    soldOut: false,
  },
  {
    name: "Vue.js Summit",
    date: "July 2, 2025",
    location: "Amsterdam",
    soldOut: true,
  },
  {
    name: "Node.js Interactive",
    date: "August 15, 2025",
    location: "London",
    soldOut: false,
  },
];

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});

app.get("/", (_req, res) => {
  res.render("index.njk");
});

app.get("/events", (_req, res) => {
  res.render("events.njk", { events });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
