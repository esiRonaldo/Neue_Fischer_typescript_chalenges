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