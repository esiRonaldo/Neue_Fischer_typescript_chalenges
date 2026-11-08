import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import { connectDB, closeDB } from "./db/database";
import { seedDB } from "./db/seed";

process.env.NODE_ENV ??= "development";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

await connectDB();
await seedDB();
async function shutdown() {
  await closeDB();
  console.log("Database closed");
  process.exit(0);
}

nunjucks.configure(projectRoot, { autoescape: true, express: app });
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));
app.use(express.urlencoded({ extended: true }));
app.use("/", postRoutes);
app.use("/admin", adminRoutes);


const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
