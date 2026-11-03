import express from "express";
import nunjucks from "nunjucks";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from 'node:path'
import { randomUUID } from "node:crypto";


const app = express()
const port = 3000
const messageDir = path.join(import.meta.dirname, '..', 'messages')

app.use(express.urlencoded({ extended: false }))

nunjucks.configure("views", {
    autoescape: true,
    express: app,
    watch: true,
});

app.get('/', (_req, res) => {
    res.render('index.njk')
})

app.post('/messages', async (req, res) => {
    const message = req.body.message
    await mkdir(messageDir, { recursive: true })
    const id = randomUUID();
    await writeFile(path.join(messageDir, `${id}.txt`), message);

    const link = `${req.protocol}://${req.get("host")}/messages/${id}`;
    res.render("created.njk", { link });

})

app.get("/messages/:id", async (req, res) => {
  const id = req.params.id;

  if (id !== path.basename(id)) {
    return res.status(404).render("not-found.njk");
  }

  const filePath = path.join(messageDir, `${id}.txt`);

  let message: string;
  try {
    message = await readFile(filePath, "utf8");
  } catch {
    return res.status(404).render("not-found.njk");
  }

  await rm(filePath);
  res.render("message.njk", { message });
});

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})