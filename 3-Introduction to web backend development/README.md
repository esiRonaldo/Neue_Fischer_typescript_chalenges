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



# Backend Server-Side Rendering - Challenges
Translate this file ↗
Code Along: Event Hub
Build a small event listing site called Event Hub. Each step builds on the previous, so work through them in order.

Setup
Create a new Express + TypeScript project with bun init. Install the required packages:

bun install express nunjucks
bun install --dev @types/express @types/nunjucks
bun install --dev prettier prettier-plugin-jinja-template

Configure Nunjucks in src/index.ts as described in the Nunjucks Setup handout. Add a .prettierrc file with the jinja-template plugin. Install the Better Nunjucks extension in VS Code.

Base layout
Create views/base.njk with a title block and a content block. The base template should include a header with the site name “Event Hub”, a nav with links to Home and Events, and a footer.

Create views/index.njk that extends the base and fills the content block with a heading: “Welcome to Event Hub”.

Add a GET / route that renders index.njk.

Events listing
Add the events below to your server and pass them to the template:

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

Create views/events.njk that extends the base. Render each event’s name, date, and location in a list. Add an {% else %} clause to the for loop that shows “No events scheduled” when the array is empty.

Add a GET /events route that renders events.njk with the events data.

Sold out badge
Add a badge to each event card that renders only when soldOut is true. Verify it works by toggling the soldOut value on one of the events.

Event card macro
Extract the event card HTML into a macro called eventCard that accepts name, date, location, and an optional soldOut parameter defaulting to false. Move the macro into views/macros/events.njk and import it in events.njk.

Build a Blog
Set up an Express application with TypeScript and Nunjucks. Use the Clean Blog theme from Start Bootstrap as the visual template. Download it from the theme page.

The blog content is provided as JSON below. Store it in a file and read it at startup. You can import a JSON file directly: import posts from "./posts.json" with { type: "json" };.

Make sure to download the images before starting. Serve them and the theme’s CSS as static files.

Home page

List all posts on the home page using the index layout. Each entry shows the title, teaser, author, and date. The createdAt field is a Unix timestamp — convert it to a human-readable date string before passing it to the template. Do not modify the JSON structure.

Post detail page

Render each post on its own page using the post layout. The URL should include a slug derived from the post title so that each post has a unique, readable path. Display the full content and the post’s image. The content field contains HTML, so render it with the safe filter.

Contact page

Implement the contact page. The form does not need to process submissions — plain HTML is sufficient. Use a macro for the form fields to avoid repeating input markup. The input should accept a label, placeholder and type parameter. If the type is “textarea”, a textarea element should be rendered instead of an input element.

Blog data
[
  {
    "title": "Black: The Absence, Not the Presence, of Color",
    "image": "colorful-umbrella.jpg",
    "author": "Peter Parker",
    "createdAt": 1743120000,
    "teaser": "Scientifically, black is not a color but rather the absence of all colors, occurring when an object absorbs nearly all light wavelengths instead of reflecting them.",
    "content": "<p>When you think about the rainbow, you see a vibrant spectrum of hues: red, orange, yellow, green, blue, indigo, violet. But where's black? And why isn't it typically included in our discussions of light and color in the same way as, say, blue or green?</p><p>The simple answer, from a scientific perspective, is that black is the absence of color.</p><p>Think about how we perceive color. Objects have color because they reflect certain wavelengths of light and absorb others. A red apple, for example, appears red because it reflects red light and absorbs most of the other colors in the visible spectrum. White, on the other hand, is what we see when an object reflects all wavelengths of light.</p><p>Black is the opposite. When an object appears black, it's because it's absorbing nearly all of the wavelengths of light that hit it. Very little, if any, light is being reflected back to our eyes. Without reflected light, there's no color for our eyes to perceive.</p><p>This concept becomes even clearer when we talk about light itself. A prism splits white light into its constituent colors. But you can't split black light into colors, because there is no black light in the same way there is white light. In a dark room, where there is no light, everything appears black.</p><p>Of course, in the world of art and pigments, we often talk about &quot;black paint&quot; and mix colors to create black. In this context, black is indeed a pigment. However, even then, black pigments work by absorbing most of the light that hits them, effectively removing color from what we see.</p><p>So, while black is undeniably powerful, chic, and fundamental in both our everyday lives and artistic expression, scientifically speaking, it's not a color in the same way red or blue are. It's the ultimate absorber, the beautiful void that makes other colors pop, and the profound absence that allows light to define everything else.</p>"
  },
  {
    "title": "Flowers: Nature's Muse for Design",
    "image": "flowers.jpg",
    "author": "Peter Parker",
    "createdAt": 1745452800,
    "teaser": "Flowers endlessly inspire diverse design fields, from fashion to architecture, with their colors, patterns, forms, and functional structures, reminding us that nature is the ultimate muse for creativity.",
    "content": "<p>Flowers, with their riot of colors, intricate patterns, and graceful forms, are more than just botanical beauties; they are an endless wellspring of inspiration for designers across various fields. From fashion to architecture, and graphic design to interior decor, the influence of flora is evident everywhere.</p><p>Think about the delicate pleats of a rose petal inspiring the draping of a gown, or the vibrant color combinations of a tropical bloom dictating a bold new palette for a living room. The organic lines of a winding vine can inform the flow of a logo, while the symmetrical perfection of a sunflower's seeds might spark ideas for a repeating pattern.</p><p>Beyond just aesthetics, flowers also offer lessons in functionality and adaptability. Their structures are often optimized for survival and reproduction, showcasing ingenious engineering that can inspire biomimicry in design&mdash;creating solutions by emulating nature's designs and processes.</p><p>The ephemeral nature of flowers, their bloom and fade, can even influence design philosophies, encouraging the creation of pieces that celebrate transient beauty or evoke a sense of fleeting moments.</p><p>Ultimately, flowers remind us that the most profound and beautiful designs often come from the natural world. They encourage us to observe, appreciate, and translate their inherent artistry into our own creative endeavors, ensuring that their timeless charm continues to blossom in countless forms of human design.</p>"
  },
  {
    "title": "UDesign's Harmony: Core Purpose and Supporting Details",
    "image": "sailing.jpg",
    "author": "Peter Parker",
    "createdAt": 1748736000,
    "teaser": "Discover how distinguishing between the major core and minor supporting details in design creates a harmonious and impactful final product.",
    "content": "<p>In the world of design, you'll often hear about &quot;major&quot; and &quot;minor.&quot; These aren't just academic terms; they're a simple way to understand what's most important in a design and what helps it truly shine.</p><p>The major focus in design is the absolute core. It's the central problem you're solving, the main message you're conveying, or the primary function a product needs to perform. If you're creating a new brand identity, the major is designing that iconic logo that will represent the entire company. For a website, the major might be ensuring users can easily achieve their main goal, like buying a product or finding information. This is where the bulk of the creative energy and strategic thinking resides. It's the reason the design project exists.</p><p>Then there are the minor elements. These are all the crucial details that support, enhance, and complement the major focus. They're essential for a complete and polished design, but they don't carry the primary weight of the project's overall purpose. Continuing our examples, for that new brand identity, the minor elements would include the specific typography chosen for marketing materials, the subtle color palette used across different applications, or the style of accompanying imagery. For the website, the minor considerations could be the precise spacing between elements, the micro-interactions when a user hovers over a button, or the tone of voice in the help text. These details refine the user experience and contribute to the overall aesthetic without being the central function themselves.</p><p>The true art of design lies in the harmonious interplay between the major and minor. A brilliant core idea needs well-executed supporting details to be fully realized and impactful. Conversely, even the most exquisite minor flourishes can't rescue a design if its major purpose isn't clear or effective. Understanding this distinction allows designers to prioritize their efforts, ensuring that every element serves its intended role in creating a cohesive and successful outcome. It's about finding that perfect balance where every piece contributes to the overall symphony of the design.</p>"
  }
]

Images
colorful-umbrella.jpg
flowers.jpg
sailing.jpg
Side Project Setup
Think about the different options how to run your typescript code as well as adding typescript to your frontend. Update the setup of your side project to fit your needs. If you haven’t choosen a project yet, then pick one now.



# Backend Express Advanced - Challenges

Build a burn-on-read service
Build a small Express application with TypeScript that lets one user create a message and another user open it exactly once.

Use the logger from this session as shared infrastructure for the whole app, then add the burn-on-read behavior on top.

Requirements:

Set up an Express application with TypeScript
Use Nunjucks for templates
Add your own CSS or use a small CSS framework
Provide a text field where the user can enter a message
Make sure a message can’t inject HTML into the page when it is displayed
Store the message in a file
Generate a unique link for the stored message
Show that link to the sender after creation
Delete the file after the link is opened once
Useful review questions while building:

Which part of the app should create the file name or ID?
Where should files be stored so the path stays predictable?
What should happen if a user opens an expired or missing link?
Which requests should appear in the access log for this app?


# Backend MVC Pattern - Challenges
Translate this file ↗
This session has two challenges and two bonus challenges. The first is a guided code-along that refactors a monolithic blog app into MVC. The second builds an admin panel on top of the refactored project. The bonus challenges are optional: one adds a small JSON API, the other a basic auth mechanism.

Work through them in order. Each challenge depends on the structure built in the previous one.

1 Code Along: Refactor the blog into MVC
The starter app below is a working blog server. It renders a list of posts on the home page and a detail page for each post under /posts/:slug. It also supports simple filtering, sorting, and pagination from query params. All routing, data access, slug logic, query parsing, and date formatting live in a single file. Your task is to refactor it into a Model-View-Controller structure without changing what the user sees.

After each step, the app should still serve the same pages with the same content. If something breaks, the step is not done.

Setup
Download the starter project, install the dependencies, and verify that the app works as intended:

npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/mvc-pattern-challenge mvc-pattern-challenge

cd mvc-pattern-challenge
npm install

Verify the starter works:

run npm run dev, which restarts the server whenever you save a file
open http://localhost:3000
click into a post, confirm the date is human-readable
test /?sort=oldest&page=1
test /?page=2
run npm run typecheck in a second terminal, it reports no errors
💡The starter runs on Node with tsx. If you prefer Bun, bun install and bun src/app.ts work as well. Pick one of them for the whole project, so that only one lock file ends up in it.

Step 1: Extract routes into a router module
Move the routing definitions out of your main application file and into a dedicated router module.
Use Express Router, as described in the Express Router handout, to group these routes, and then mount that router back in your main entry file.
For this step, keep the actual request-handler logic (the bodies of the routes) inline where they are. The goal right now is simply to separate the routing wiring from the server setup.

When you are done, your main application file should no longer contain direct route declarations (like app.get), but it should still handle your template engine setup, static files, and server listener.

Verify: Your home page, detail pages, and contact page should all still work identically.

Step 2: Extract handlers into a controller
Create a controller module and extract the inline handler bodies out of your router.
Each handler should become a cleanly named, exported function within your new controller.
Don’t forget to properly type your request and response parameters using Express’s built-in types.
Update your router file so that it imports these controller functions and maps them to their respective routes.
Your router file should now read as a clean, simple list of route-to-function mappings, while the controller contains the actual logic (reading the query, calling helpers, and rendering templates).
Hint
Verify: Test the application again. All three pages must still serve correctly with no changes in behavior.

Step 3: Extract data access into a model
To finish the separation of concerns, create a data model.
Move all data-fetching and data-manipulation logic out of the controller and into this new model module. This should include:
Your data interfaces/types.
Your data source (in the starter, the array of posts).
Helper functions specifically related to data parsing (like generating slugs).
A function to fetch all posts.
A function to fetch a single post by its identifier.
A function to replace the stored posts with a new list (you will need this for the next challenge).
Update your controller to import and use these model functions instead of working with the posts array directly. The controller’s only job now is to ask the model for data, decide what to do with it, and render the appropriate response.
Hint
Verify: Your project structure should now clearly separate routes, controllers, and models. The application should still behave exactly as it did in Step 1.

Hint
2 Admin Panel CRUD
Build an admin section on top of your refactored project that lets a content editor create, update, and delete posts. The admin panel does not need authentication for the main task.

Routes
Implement these endpoints:

GET /admin renders a list of all posts with edit and delete buttons next to each entry.
GET /admin/posts/new renders an empty form for creating a new post.
POST /admin/posts creates a new post from the form submission and redirects back to /admin.
GET /admin/posts/:slug/edit renders a form pre-filled with the existing post data.
POST /admin/posts/:slug saves the edited post and redirects back to /admin.
POST /admin/posts/:slug/delete removes the post and redirects back to /admin.
Don’t forget to continue following the MVC pattern consistently!

The starter has no admin templates yet. Create them next to the other templates, for example admin.html for the list and adminForm.html for the form, and let them extend _baseLayout.html. Every form field needs a name attribute, otherwise its value is missing in req.body. Check this when you reuse the formField macro from the contact page.

Form parsing
Register express.urlencoded({ extended: true }) in app.ts so that req.body contains the submitted form fields, and answer each POST with res.redirect(). The middleware handout in Backend Express Advanced explains both.

HTML sanitization
The post content is HTML. If you save the raw form input straight into your posts and render it on the public detail page, anyone using the admin panel can inject <script> tags or other harmful markup that runs in your readers’ browsers. This is a stored cross-site scripting vulnerability.

Install the sanitize-html package:

npm install sanitize-html
npm install --save-dev @types/sanitize-html

Run every submitted content field through sanitizeHtml before passing it to the model. Configure an allowlist of tags and attributes that match what the blog actually needs (paragraphs, headings, links, lists, images). Strip everything else.

Model functions to add
The admin controller will need new functions in postModel.ts:

addPost(post) appends a new post to the list and saves it.
updatePost(slug, changes) finds the post by slug, replaces its fields, and saves the list.
deletePost(slug) removes the post by slug and saves the list.
These all build on getAllPosts and writePosts, which already exist from the code-along.

💡The posts live in memory, as in the starter. Every restart resets them, and npm run dev restarts whenever you save a file. If you want the posts to survive a restart, let getAllPosts and writePosts read and write data/posts.json, as shown in the models handout. The controllers stay the same, because only the model knows where the posts are stored.

Bonus Tasks
Add a search input on /admin that filters posts by title.
The home page already reads ?page=, but index.html shows no links for it. Add previous and next links to the home page, using the controls that the controller already passes, and add pagination to the admin list.
Replace the plain content textarea with a WYSIWYG editor like Quill or Editor.js. Make sure the sanitization step still runs server-side, regardless of what the editor produces client-side.
3 Bonus: Public REST API Endpoints
So far, our blog application has been a classic ‘server-side rendered’ (SSR) app: Express fetches the data, combines it with Nunjucks templates, and sends the finished HTML to the browser (res.render()).

In practice, however, many web applications also make their data available in a machine-readable format. For example, for mobile apps, single-page applications (React/Vue) or for widgets on external websites.

Extend the Express application with a small, public REST API. To do this, define three new routes under the path /api/..., which do not render a Nunjucks template but return raw data in JSON format (res.json()).

GET /api/posts/random returns a random blog post as a JSON object.
GET /api/posts/latest returns the three most recent blog posts as a JSON array.
GET /api/stats returns a JSON object with blog statistics, for example { "totalPosts": 15, "newestPostDate": "2026-04-30" }.
4 Bonus: Rudimentary Auth
This challenge is optional and intended as a bonus exercise. Proper authentication is covered in a later session. The goal here is only to think about how to gate a set of routes behind a check.

Pick one of the two approaches:

HTTP Basic Auth middleware
Write a small middleware function that reads the Authorization header, decodes the Base64-encoded user:password string, and compares it against a hardcoded value (or a value from an environment variable). If the credentials match, call next(). If not, set the WWW-Authenticate: Basic response header and return a 401 status.

Apply this middleware only to the admin router with app.use("/admin", basicAuth, adminRoutes). The browser will prompt for credentials the first time the user visits an admin page.

Session cookie
Add a GET /login page with a form, a POST /login handler that checks a hardcoded password and sets a cookie like admin=true on success, and a middleware that checks for that cookie before any admin route runs. If the cookie is missing or wrong, redirect to /login.

Use the cookie-parser package to read cookies from req.cookies.

🚨Neither approach is production-ready. Hardcoded passwords, plain cookies without signing, and missing CSRF protection are all real problems. The point of this challenge is to feel where the auth seam goes in an MVC app, not to ship a secure system.

# Integrate SQLite into Your Express Project
Connect your existing Blog project to a SQLite database and replace the posts in your code with real database reads.

Requirements:

Create src/db/database.ts with connectDB(), getDB(), and closeDB() functions
Call connectDB() in your entry file before starting the server. In the MVC challenge starter, that is src/app.ts.
Register SIGINT and SIGTERM handlers that call closeDB() before exiting
Define the table schema in connectDB() using CREATE TABLE IF NOT EXISTS
Create a db folder in the project. SQLite creates the database file blog.db in it on the first start, but not the folder itself.
Let the server start successfully and generate the empty table. Then fill the table with the posts your project already has, either with a seed file as shown in the SQLite setup handout or in DB Browser.
Refactor your model so that the get-all function uses the database instead of the data in your code
Refactor your model so that the get-one function uses the database instead of the data in your code
Verify the data is being read correctly by inspecting the database file with DB Browser
Hint
Design the table for the posts you already have, not for the example in the handout. The posts in the starter have no id, store createdAt as a Unix timestamp, and are found by a slug that slugify builds from the title.

A createdAt column of type INTEGER keeps formatDate working.
A column slug TEXT NOT NULL UNIQUE lets the get-one function find a post with WHERE slug = ?. You can copy the slugs from the URLs of the detail pages.
Inside a SQL string, an apostrophe is written twice: 'Flowers: Nature''s Muse for Design'.
Hint
getAllPosts and getPostBySlug now return a Promise. Mark every controller that calls them as async and await the result. Run npm run typecheck to find every place that still uses the result without await. TypeScript reports them like this: Property 'filter' does not exist on type 'Promise<Post[]>'.

The admin functions addPost, updatePost, and deletePost from the MVC challenge also build on getAllPosts. Until the next session moves them to SQL, let them work on the array directly. Posts you create in the admin panel do not show up on the site in the meantime.

SQL Practice Games
Work through one or more of these interactive SQL games. Each one teaches SQL through a story or puzzle — you write real queries to progress.

# Backend SQL Advanced - Challenges
Translate this file ↗
Move the Admin Panel to SQL
Your blog reads its posts from the database, but the admin panel from the MVC challenge still writes to the array. Move the writes to SQL, so that the database is the only place where your posts live.

Requirements:

addPost(post) runs an INSERT. It stores the slug that slugify builds from the title, and the current time as a Unix timestamp in createdAt.
updatePost(slug, changes) runs an UPDATE scoped to the post’s slug. A new title also gets a new slug.
deletePost(slug) runs a DELETE scoped to the post’s slug.
updatePost and deletePost return whether a row was changed, based on result.changes. The admin controllers answer with a 404 when nothing changed.
Mark the admin controllers that call these functions as async and await the result.
Remove the array and writePosts from the model. From now on, every page and every admin action works with the database.
Use parameterized queries (? or named @ placeholders) for all values. Do not interpolate values directly into the SQL string
Create a post in the admin panel, restart the server, and check that the post is still there. Verify the changes in DB Browser.
Hint
Date.now() counts milliseconds, the posts count seconds: Math.floor(Date.now() / 1000).
The slug column is UNIQUE. A second post with the same title gets the same slug, and SQLite rejects the INSERT with SQLITE_CONSTRAINT: UNIQUE constraint failed: posts.slug (for a table called posts). Check with getPostBySlug before you save, and show the form again with an error message. The same can happen when an edit renames a post to the title of another post.
Optional: JSON API for Posts
Build the routes from the handouts for your blog. They are good practice for the recap project, which asks for the same kind of API.

Parse JSON bodies with app.use(express.json())
POST /api/posts creates a post from a JSON body and answers with 201 and the slug of the new post
PUT /api/posts/:slug replaces a post and answers with 200, or with 404 if the slug matches no post
DELETE /api/posts/:slug answers with 204 and no body, or with 404
A body without a title or content gets 400
If you built the Basic Auth bonus in the MVC challenge, protect the three routes with it
Test each route with a REST client like Bruno and verify the changes in DB Browser
Optional: Authors Table and JOIN
Create a separate authors table with at least id and name columns, and fill it with the authors of your posts
Replace the author column of your posts table with an author_id foreign key, and turn on foreign key checks with PRAGMA foreign_keys = ON in connectDB()
getAllPosts and getPostBySlug join authors and return the author’s name as author, so that your templates and the author filter keep working
The admin form offers the authors in a dropdown instead of a text field
(Optional) Add a user interface to manage authors — create, edit, and delete author records
Hint
CREATE TABLE IF NOT EXISTS does not change a table that already exists. After you change the schema in connectDB(), delete db/blog.db, so that the tables are created again, and fill them again with your seed file.