import express, { type Request, type Response } from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface Post {
  title: string;
  image: string;
  author: string;
  createdAt: number;
  teaser: string;
  content: string;
}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

nunjucks.configure(projectRoot, { autoescape: true, express: app });
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));


const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
