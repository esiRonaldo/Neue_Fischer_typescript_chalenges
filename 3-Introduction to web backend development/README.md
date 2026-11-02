# intro-to-web-backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To type check:

```bash
bun check
```

Run `bun fmt` to format the code.

This project was created using `bun init` in bun v1.4.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


# Backend Basics and Express - Challenges
Translate this file ↗
Bookmark Manager API
Build a REST API that manages a collection of bookmarks. Each bookmark has an id, a url, a title, and an optional tag. All data is stored in a plain array variable, no database required.

Setup
Create a new project with bun init and install Express. Use express.json() middleware so the server can parse JSON request bodies. Configure a dev script that restarts on file changes with bun --watch.

Data structure
Each bookmark follows this shape:

interface Bookmark {
  id: number;
  url: string;
  title: string;
  tag?: string;
}

Start with a pre-filled array so you have data to test against immediately:

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

Endpoints
Implement the following four endpoints:

GET /bookmarks returns the full list of bookmarks as a JSON array with status 200.

GET /bookmarks/:id returns a single bookmark by its id. If no bookmark with that id exists, respond with status 404 and an error object like { "error": "Bookmark not found" }.

POST /bookmarks creates a new bookmark from the JSON request body. Assign an id automatically (a simple counter works fine). Respond with the created bookmark and status 201.

DELETE /bookmarks/:id removes the bookmark with the given id from the array. Respond with status 204 and an empty body.

Testing
Use your API client to send requests to each endpoint. Verify that:

GET /bookmarks returns the full array
GET /bookmarks/1 returns the first bookmark
GET /bookmarks/999 returns a 404 error
POST /bookmarks with a JSON body adds a new entry
GET /bookmarks after creating shows the new entry
DELETE /bookmarks/1 removes the bookmark
GET /bookmarks/1 after deleting returns 404
Filter by tag
Extend GET /bookmarks to accept an optional query parameter tag. When present, return only bookmarks whose tag matches the value. When absent, return all bookmarks.

Example: GET /bookmarks?tag=node returns only bookmarks tagged with “node.”

Partial updates
Add a PATCH /bookmarks/:id endpoint that updates individual fields of an existing bookmark. The request body contains only the fields to change. Fields not included in the body stay as they are. Return the updated bookmark with status 200, or 404 if the id does not exist.

Input validation
Validate incoming data on the POST /bookmarks endpoint. Both url and title are required fields. If either is missing from the request body, respond with status 400 and an error message that tells the client which field is missing. Example: { "error": "Missing required field: title" }.

Bun on the backend
Install Bun. Use bun to start one of your previous typescript projects. Run code via:

bun run src/index.ts

Then use the watch mode to get autmatic reloading when the code changes:

bun run --watch src/index.ts

Bun on the frontend
In one of your previous challenges from the client side session, swap the script file in side your HTML from the generated index.js to your index.ts file. Then serve the file with bun:

bun index.html



# Backend Server-Side Rendering - Nunjucks Setup
Translate this file ↗
Working with .njk template files in a standard development setup reveals two small gaps right away. VS Code treats .njk files as plain text by default — no syntax highlighting for Nunjucks expressions or tags, which makes templates hard to read. Prettier, which handles formatting in most Node.js projects, has no built-in parser for Nunjucks templates either. Without one, it either skips .njk files or mangles the syntax when treating them as plain HTML.

With this in mind, the first step is to integrate Nunjucks into Express.

Express configuration
Install Nunjucks as a dependency:

bun install nunjucks
bun install --dev @types/nunjucks

Then call nunjucks.configure() before your routes:

import express from "express";
import nunjucks from "nunjucks";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});

Three options are set here:

autoescape: true — Nunjucks escapes HTML characters in variables before rendering them. This prevents user-provided strings from injecting HTML into the page.
express: app — registers Nunjucks as the template engine for the Express app, so res.render() knows to use it.
watch: true — tells Nunjucks to watch the views/ directory for changes and reload the templates when they happen.
💡: Some older setups use node, tsc, nodemon and concurrently to run the code and automatically restart the dev server when the code changes. We will not cover this in this course, but please be aware that in some projects you might encounter a more verbose setup than ours.

With this in place, simply put your template files into the views/ directory. A basic route then looks like this:

app.get("/", (req, res) => {
  res.render("index.njk", { title: "Home" });
});

index.njk is the name of the template file, and title is a variable that will be passed to the template.

⚠ Watch out: Because of autoescape, a variable that contains HTML shows up as text: <p>Hello</p> appears on the page with its tags. If the HTML comes from a source you trust, such as content you wrote yourself, pass it through the safe filter: {{ post.content | safe }}. A filter is a function that changes a value before Nunjucks outputs it, and safe tells Nunjucks not to escape this one. Never use safe on text that users typed in, because that brings back the injection problem autoescape prevents.

Serving static files
A rendered page usually links to other files: a stylesheet, images, maybe a client-side script. The browser requests each of them with its own GET request, and Express answers with 404 Not Found because no route handles them. express.static() is built into Express and fixes this: it maps a folder on disk to URLs and sends the files in it as they are. Like express.json(), you add it with app.use():

app.use("/static", express.static("public"));

"public" is the folder whose files get served, relative to the folder you start the server from
"/static" is the URL prefix, so public/style.css is available at /static/style.css
Without a prefix, app.use(express.static("public")) serves the same file at /style.css.

VS Code syntax highlighting
The Better Nunjucks extension adds syntax highlighting for .html and .njk files in VS Code, including expressions ({{ }}), tags ({% %}), and comments ({# #}). Install it from the VS Code Marketplace.

Prettier configuration
The prettier-plugin-jinja-template package adds a Nunjucks-aware parser to Prettier. Install it alongside Prettier:

bun install --dev prettier prettier-plugin-jinja-template

Then add a .prettierrc file to the project root:

{
  "plugins": ["prettier-plugin-jinja-template"],
  "overrides": [
    {
      "files": ["*.njk"],
      "options": {
        "parser": "jinja-template"
      }
    }
  ]
}

Three things are configured here:

"plugins" registers the jinja-template plugin with Prettier
"overrides" applies a custom setting to a specific file pattern
"parser": "jinja-template" tells Prettier to use the Jinja/Nunjucks-aware parser for .njk files
