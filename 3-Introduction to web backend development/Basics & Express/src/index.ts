import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

interface Bookmark {
  id: number;
  url: string;
  title: string;
  tag?: string;
}

let bookmarks: Bookmark[] = [
  { id: 1, url: "https://expressjs.com", title: "Express.js", tag: "node" },
  {
    id: 2,
    url: "https://typescriptlang.org",
    title: "TypeScript",
    tag: "typescript",
  },
  { id: 3, url: "https://developer.mozilla.org", title: "MDN Web Docs" },
];

app.get("/", (req, res) => {
  console.log('req')
  console.log(req)
  console.log('res')
  console.log(res)
  res.send("Hello World");
});

app.get('/bookmarks', (req, res) => {
  const tag = req.query.tag;

  if (tag) {
    return res.json(bookmarks.filter((b) => b.tag === tag));
  }

  res.json(bookmarks);
})

app.get('/bookmarks/:id', (req, res) => {
  const id = +(req.params.id)
  const bookmark = bookmarks.find((b) => b.id === id);
  if (!bookmark) {
    return res.status(404).json({ error: "Bookmark not found" });
  }

  res.json(bookmark);
})

let nextId = 4
app.post('/bookmarks', (req, res) => {
  const { url, title, tag } = req.body

  if (!url) {
    return res.status(400).json({ error: "Missing required field: url" });
  }
  if (!title) {
    return res.status(400).json({ error: "Missing required field: title" });
  }

  const newBookmark: Bookmark = {
    id: nextId++,
    url: url,
    title: title,
    tag: tag,
  }
  bookmarks.push(newBookmark);
  res.status(201).json(newBookmark)
})

app.patch("/bookmarks/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookmark = bookmarks.find((b) => b.id === id);

  if (!bookmark) {
    return res.status(404).json({ error: "Bookmark not found" });
  }

  const { url, title, tag } = req.body;
  if (url !== undefined) bookmark.url = url;
  if (title !== undefined) bookmark.title = title;
  if (tag !== undefined) bookmark.tag = tag;

  res.json(bookmark);
});

app.delete("/bookmarks/:id", (req, res) => {
  const id = Number(req.params.id);
  bookmarks = bookmarks.filter((b) => b.id !== id);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
