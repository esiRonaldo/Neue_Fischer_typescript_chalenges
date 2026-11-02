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