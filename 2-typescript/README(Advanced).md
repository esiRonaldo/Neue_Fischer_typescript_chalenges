
Code Along: Music Library
This code along continues the music library project from the project setup session. The library gets a small API layer, and you derive the types for its requests and responses from the Track interface instead of writing each of them by hand. Each part maps directly to the session material.

Part 1: The keyof operator
Your library shows a label for each release format. Add a type for the labels to src/types.ts and derive the format names from it with keyof:

// src/types.ts
export interface FormatLabels {
  vinyl: string;
  cd: string;
  digital: string;
}

export type Format = keyof FormatLabels;

Add the labels and a function that looks them up to src/track.ts:

// src/track.ts
import type { Format, FormatLabels } from "./types.js";

const formatLabels: FormatLabels = {
  vinyl: "Vinyl record",
  cd: "Compact disc",
  digital: "Digital download",
};

export function describeFormat(format: Format): string {
  return formatLabels[format];
}

Import describeFormat in src/main.ts next to formatId and log describeFormat("vinyl"). Compile and run:

tsc
node dist/main.js

Now add cassette: string to FormatLabels and compile again. tsc reports that formatLabels is missing the property cassette: the new format exists in the type, so it needs a label. Add cassette: "Cassette" to formatLabels, and describeFormat("cassette") compiles. Remove cassette from both places before continuing.

Next, print your tracks as a small table. Add this to the end of src/main.ts:

const columns: (keyof Track)[] = ["title", "artist"];

for (const track of tracks) {
  console.log(columns.map((column) => track[column]).join(" | "));
}

Run the project and add "liked" to columns. Then add "album", compile, and read the error. Remove "album" before continuing.

Part 2: Generics
Add a generic response wrapper to src/types.ts:

// src/types.ts
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

Create src/api.ts with two generic functions:

// src/api.ts
import type { ApiResponse } from "./types.js";

export function ok<T>(data: T): ApiResponse<T> {
  return { status: 200, message: "OK", data };
}

export function findById<T extends { id: number }>(
  items: T[],
  id: number,
): T | undefined {
  return items.find((item) => item.id === id);
}

Import both functions in src/main.ts and use them with the tracks you already have:

const allTracks = ok(tracks);
const featured = ok(pick);

console.log(
  `${allTracks.data.length} tracks, featured: ${featured.data.title}, picked by ${featured.data.curatedBy}`,
);
console.log(findById(tracks, 2)?.title);

Compile and run the project again. Hover over allTracks and featured: TypeScript infers ApiResponse<Track[]> and ApiResponse<FeaturedTrack> from the argument, so featured.data.curatedBy is available without an annotation. findById may return undefined, so the last line reads title with ?..

Then call findById(["Blue Light", "Nights"], 1), compile, and read the error. The constraint T extends { id: number } rejects strings, because they have no id. Remove the call before continuing.

Part 3: Utility types
The server stores more data per track than Track describes. Add LibraryTrack and three types derived from it to src/types.ts:

// src/types.ts
export interface LibraryTrack extends Track {
  addedAt: Date;
  playCount: number;
}

export type TrackCreatePayload = Omit<
  LibraryTrack,
  "id" | "addedAt" | "playCount"
>;
export type TrackUpdatePayload = Partial<TrackCreatePayload>;
export type TrackPreview = Pick<LibraryTrack, "id" | "title" | "artist">;

Create src/library.ts. It plays the role of the server: it keeps the tracks in an array and sets the fields that a client must not send.

// src/library.ts
import { findById } from "./api.js";
import type {
  LibraryTrack,
  TrackCreatePayload,
  TrackPreview,
  TrackUpdatePayload,
} from "./types.js";

const library: LibraryTrack[] = [];

export function addTrack(payload: TrackCreatePayload): LibraryTrack {
  const track: LibraryTrack = {
    ...payload,
    id: library.length + 1,
    addedAt: new Date(),
    playCount: 0,
  };
  library.push(track);
  return track;
}

export function updateTrack(
  id: number,
  changes: TrackUpdatePayload,
): LibraryTrack | undefined {
  const track = findById(library, id);
  if (track) {
    Object.assign(track, changes);
  }
  return track;
}

export function toPreview(track: LibraryTrack): TrackPreview {
  return { id: track.id, title: track.title, artist: track.artist };
}

In src/main.ts, import the three functions, add a track, like it, and log its preview:

const ivy = addTrack({ title: "Ivy", artist: "Frank Ocean", liked: false });
updateTrack(ivy.id, { liked: true });

console.log(toPreview(ivy), ivy.liked);

Compile and run the project. Then try what the payload types prevent: pass id: 99 to addTrack, and pass { playCount: 1000 } to updateTrack. Read both errors, then remove the changes.

Finally, count your releases per format. Import Format together with the other types in src/main.ts and add:

const formatCounts: Record<Format, number> = {
  vinyl: 12,
  cd: 30,
  digital: 214,
};

console.log(formatCounts);

Delete the cd line and compile. Record requires a value for every format. Restore the line before you finish.

Build the BookShelf type layer
You are building the type layer for a library management API. Your goal is to define a complete set of types in a types file, then use them in a service module. Set up a new project with TypeScript installed locally, "type": "module" in its package.json, and the extended tsconfig.json.

Create a file src/types.ts for the base types:

Challenge
0/6
Base types

A type alias EntityId that accepts either a number or a string

A type Timestamped with createdAt: Date and updatedAt: Date

A type HasId with id: EntityId

A Book type that combines HasId, Timestamped, and book-specific fields (title, author, isbn, isAvailable) using intersection types

A tuple type IsbnParts representing the three components of an ISBN: group (number), publisher (string), and title identifier (string)

A generic ApiResponse<T> interface with status: number, message: string, and data: T
Done when
tsc --noEmit reports no errors, and a Book object without createdAt is a compile error.

In the same file, define these types using utility types. Do not repeat properties manually:

Challenge
0/3
Derived payload types

BookCreatePayload: all Book properties except id, createdAt, and updatedAt

BookUpdatePayload: same as BookCreatePayload, but every field is optional

BookPreview: only id, title, and author from Book
Done when
When you add a publisher field to Book, BookCreatePayload and BookUpdatePayload contain it without any other change.

Create a file src/bookService.ts that imports the types from ./types.js using import type. Stub implementations are fine. If a stub does not use one of its parameters yet, prefix the parameter name with an underscore, like _id, so the noUnusedParameters rule accepts it.

Challenge
0/5
Service module

fetchBooks(): Promise<ApiResponse<BookPreview[]>>

fetchBook(id: EntityId): Promise<ApiResponse<Book>>

createBook(payload: BookCreatePayload): Promise<ApiResponse<Book>>

updateBook(id: EntityId, changes: BookUpdatePayload): Promise<ApiResponse<Book>>

parseIsbn(isbn: string): IsbnParts
Done when
tsc --noEmit reports no errors.

Generic collection utilities
Write three generic utility functions that work with any object type. Test each one using an array of Book objects.

Challenge
0/4
Generic collection utilities

groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> takes an array and a property name, then returns an object where each key is a distinct value of that property and each value is an array of matching items. Example: grouping books by author.

pluck<T, K extends keyof T>(items: T[], key: K): T[K][] takes an array and a property name, then returns an array containing just that property’s value from each item. Example: extracting all book titles.

merge<T>(base: T, updates: Partial<T>): T takes a base object and a partial update, then returns a new object with the updates applied. Example: applying a BookUpdatePayload to a Book.

Each function is generic, fully annotated, and works with any object type, not just Book.
Done when
groupBy(books, "author") logs one array per author, pluck(books, "title") logs all titles, and merge returns a new book without changing the original.

Bonus: Your own utility types
Partial, Readonly, and Pick are not built into the compiler. They are regular generic types from TypeScript’s standard library, written as mapped types. A mapped type goes through the keys of a type with in keyof and creates one property for each key:

type Copy<T> = {
  [K in keyof T]: T[K];
};

Copy<Book> has the same properties as Book, with the same types. T[K] is the indexed access type you know from getProperty. A ? after the square brackets makes every property optional, readonly before them makes every property read-only.

Challenge
0/5
Your own utility types

Write MyPartial<T>, which makes every property optional

Write MyReadonly<T>, which makes every property read-only

Write MyPick<T, K extends keyof T>, which keeps only the properties in K

Use MyPartial and MyPick instead of the built-in types for BookUpdatePayload and BookPreview

Ctrl+click Partial in your editor (Cmd+click on macOS) and compare its definition with yours
Done when
tsc --noEmit still reports no errors, and MyPick<Book, "Id"> is a compile error, just like Pick<Book, "Id">.

Hint
Bonus: Type-safe event emitter
Create a generic function createEmitter<Events>() where Events is an object type that maps event names to their payload types:

type BookEvents = {
  bookAdded: Book;
  bookRemoved: { id: EntityId };
  searchPerformed: { query: string; resultCount: number };
};

const emitter = createEmitter<BookEvents>();

The function returns an object with two methods, on and emit:

Challenge
0/4
Type-safe event emitter

on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void registers a handler for an event

emit<K extends keyof Events>(event: K, payload: Events[K]): void calls every handler registered for that event

The compiler only accepts a Book as the payload of emit("bookAdded", payload)

on("searchPerformed", handler) passes { query: string; resultCount: number } to the handler function
Done when
emit("bookAdded", book) runs the handlers registered with on("bookAdded", ...), and emit("bookAdded", { id: 1 }) is a compile error.

# advanced 2
# TypeScript Client-Side - Challenges
Translate this file ↗
Code Along: Track Search
This code along builds a search page for your music library that runs in the browser. It loads the tracks from a JSON file, renders the results, and lets you like a track. Each part maps directly to the session material.

Part 1: Set up a browser project
Create a new folder for the project and install TypeScript in it:

mkdir track-search
cd track-search
npm init -y
npm install --save-dev typescript

Create this structure:

track-search/
  node_modules/
  src/
    main.ts
  index.html
  package.json
  tracks.json
  tsconfig.json

Add this HTML to index.html:

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Track Search</title>
    <script type="module" src="dist/main.js"></script>
  </head>
  <body>
    <form id="search-form">
      <input name="query" type="search" placeholder="Title or artist" />
      <button>Search</button>
    </form>
    <ul id="track-list"></ul>
  </body>
</html>

tracks.json plays the role of the API. Copy this data into it:

[
  { "id": 1, "title": "Blue Light", "artist": "Jorja Smith", "liked": true },
  { "id": 2, "title": "Nights", "artist": "Frank Ocean", "liked": false },
  { "id": 3, "title": "Golden", "artist": "Jill Scott", "liked": true },
  { "id": 4, "title": "Ivy", "artist": "Frank Ocean", "liked": true },
  { "id": 5, "title": "Be Honest", "artist": "Jorja Smith", "liked": false },
  {
    "id": "6",
    "title": "Pink + White",
    "artist": "Frank Ocean",
    "liked": false
  },
  { "id": 7, "title": "A Long Walk", "artist": "Jill Scott", "liked": false },
  { "id": 8, "title": "Teenage Fantasy", "liked": true }
]

Add the tsconfig.json for browser environments:

{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["dom", "esnext"],
    "strict": true
  }
}

Write console.log("ready") in src/main.ts. Then start the compiler in watch mode, and a local web server in a second terminal:

tsc --watch

npx http-server -c-1

Open the address that http-server prints, usually http://localhost:8080, and check the browser console for ready. The option -c-1 turns off caching, so a reload always loads your latest build. The Live Preview extension in VS Code or another static file server works too.

Part 2: Select the elements
Replace the console.log in src/main.ts. Select the form and the list, and instead of asserting their types, narrow them with instanceof. If an element is missing, stop with an error:

const form = document.getElementById("search-form");
const list = document.getElementById("track-list");

if (!(form instanceof HTMLFormElement)) {
  throw new Error("Element #search-form not found");
}
if (!(list instanceof HTMLUListElement)) {
  throw new Error("Element #track-list not found");
}

Hover over form and list below the checks: TypeScript now knows them as HTMLFormElement and HTMLUListElement. Rename one of the ids in index.html, reload the page, and read the error in the browser console. Then change the id back.

Part 3: Read the search query
Add a function that reads the query from the form, and a submit listener that logs it. Hover over event to see the type TypeScript inferred:

function readQuery(form: HTMLFormElement): string {
  const query = new FormData(form).get("query");
  return typeof query === "string" ? query.trim().toLowerCase() : "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(readQuery(form));
});

Type a search term, submit the form, and check the console. FormData.get() returns FormDataEntryValue | null, so readQuery() narrows it with typeof before it calls trim().

Part 4: Fetch and render the tracks
Create src/tracks.ts with the Track interface and a function that loads the tracks:

// src/tracks.ts
export interface Track {
  id: number;
  title: string;
  artist: string;
  liked: boolean;
}

export async function fetchTracks(url: string): Promise<Track[]> {
  const response = await fetch(url);
  const data = await response.json();
  return data as Track[];
}

Import it at the top of src/main.ts. The local import needs the .js extension, because the browser loads exactly this path:

import { fetchTracks } from "./tracks.js";
import type { Track } from "./tracks.js";

Below the element checks, add a function that renders a list of tracks, then load the tracks once and render them:

const render = (results: Track[]): void => {
  list.replaceChildren(
    ...results.map((track) => {
      const item = document.createElement("li");
      item.textContent = `${track.title} by ${track.artist}`;
      return item;
    }),
  );
};

const tracks = await fetchTracks("tracks.json");
render(tracks);

render is an arrow function stored in a const. A function declaration is hoisted and could run before the checks, so TypeScript would forget inside it that list is an HTMLUListElement.
textContent inserts the title as text. With innerHTML, a title that contains HTML would be interpreted as HTML.
Then change the submit listener so that it renders only the matching tracks:

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = readQuery(form);
  render(
    tracks.filter((track) =>
      `${track.title} ${track.artist}`.toLowerCase().includes(query),
    ),
  );
});

Reload the page and try a few searches, for example frank or jorja. In the full list, one track shows by undefined, and in tracks.json you find a second broken entry whose id is a string. The compiler did not warn you about either, because as Track[] checks nothing.

Part 5: Check the data
Replace the assertion with real checks. Add a type guard to src/tracks.ts:

// src/tracks.ts
function isTrack(value: unknown): value is Track {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "artist" in value &&
    typeof value.artist === "string" &&
    "liked" in value &&
    typeof value.liked === "boolean"
  );
}

Then change fetchTracks(), so that it checks the response and keeps only valid tracks:

// src/tracks.ts
export async function fetchTracks(url: string): Promise<Track[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Expected a list of tracks");
  }

  return data.filter(isTrack);
}

Reload the page. The two broken entries are gone, and the list shows six tracks.

Now show an error on the page when loading fails. In src/main.ts, replace the two lines that load and render the tracks:

let tracks: Track[] = [];

try {
  tracks = await fetchTracks("tracks.json");
  render(tracks);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  list.textContent = `Could not load tracks: ${message}`;
}

Change the URL to track.json and reload. The page shows Could not load tracks: Request failed with status 404. Change the URL back.

Part 6: Like tracks
Give every track a like button. Change render, so that each item starts with a button that stores the track id in a data-id attribute:

const render = (results: Track[]): void => {
  list.replaceChildren(
    ...results.map((track) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.dataset.id = String(track.id);
      button.textContent = track.liked ? "♥" : "♡";
      item.append(button, ` ${track.title} by ${track.artist}`);
      return item;
    }),
  );
};

One listener on the list handles all buttons, including the ones from later searches:

list.addEventListener("click", (event) => {
  const button = event.target;
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(button.dataset.id);
  const track = tracks.find((item) => item.id === id);
  if (track) {
    track.liked = !track.liked;
    button.textContent = track.liked ? "♥" : "♡";
  }
});

event.target is EventTarget | null. The instanceof check makes sure that the click hit a like button and not the text of a list item.
button.dataset.id has the type string | undefined, because any data attribute might be missing. For a missing attribute, Number() returns NaN, and find() finds nothing.
Click a few hearts and search again: the likes stay, until you reload the page.

Book Search
Build the same kind of search page for books, with a real API. The DBooks API lists free programming books. Its search endpoint https://www.dbooks.org/api/search/{query} returns JSON like this:

{
  "status": "ok",
  "total": "87",
  "books": [
    {
      "id": "3030168778",
      "title": "Programming for Computations - Python",
      "subtitle": "A Gentle Introduction to Numerical Simulations with Python 3.6",
      "authors": "Svein Linge, Hans Petter Langtangen",
      "image": "https://www.dbooks.org/img/books/3030168778s.jpg",
      "url": "https://www.dbooks.org/programming-for-computations-python-3030168778/"
    }
  ]
}

Challenge
0/7
Book Search

Set up a new browser project with index.html, src/main.ts, tsconfig.json, and TypeScript installed locally

Select a search form and a result list, and narrow both with instanceof

Define a Book interface for one entry and a SearchResult interface for the whole response. Look closely at the types of id and total.

Write the type guards isBook and isSearchResult

Write fetchBooks(query: string): Promise<Book[]>. It checks response.ok, checks the data with your type guards, and returns the books

Render each book as an <li> with its title and authors

Show an error message in the list when the request fails
Done when
A search for python lists books with their titles and authors, and with the network set to “Offline” in the developer tools, the page shows your error message.

Hint
Character Counter
A message box allows at most 140 characters. Start with this HTML:

<textarea id="message"></textarea>
<p id="char-count">0 / 140</p>
<button id="send-button">Send</button>

Challenge
0/4
Character Counter

Select the three elements and narrow them with instanceof

Write the handler as a separate function handleInput(event: InputEvent): void and register it for the input event

In the handler, read the text from event.target and narrow it to HTMLTextAreaElement

Update the count on every input, and disable the button while the message is longer than 140 characters
Done when
The count changes while you type, and at 141 characters the button is disabled.

Hint
Color Picker
A dropdown changes the background color of a box:

<select id="color-select">
  <option value="white">White</option>
  <option value="lightblue">Light Blue</option>
  <option value="lightgreen">Light Green</option>
</select>
<div
  id="color-box"
  style="width: 100px; height: 100px; border: 1px solid black"
></div>

Challenge
0/5
Color Picker

Define a union of literal types BoxColor with the three values of the <option> elements

Write a function paintBox(color: BoxColor): void that sets the background color of the box

Write a type guard isBoxColor(value: string): value is BoxColor

On change, read select.value and call paintBox() only if the value passes isBoxColor()

Add a fourth <option> with the value "orange" to the HTML, without changing your TypeScript code
Done when
The three colors paint the box, and choosing the new fourth option leaves the box as it is.

Counter
Two buttons change a number. The step of each button is stored in a data-step attribute:

<button data-step="-1">-</button>
<span id="counter">0</span>
<button data-step="1">+</button>

Challenge
0/4
Counter

Keep the count in a number variable and write it to the <span> after every change. Don’t read it back from textContent, which has the type string | null.

Select both buttons with querySelectorAll() and register the same handler function handleClick(event: MouseEvent): void on each

In the handler, narrow event.target to HTMLButtonElement and read the step from dataset.step

The count never goes below 0
Done when
+ and - change the number by one, and at 0 the - button does nothing.

To-do List
Build a to-do list where you can add tasks, check them off, and delete them:

<input id="todo-input" placeholder="New task" />
<button id="add-todo">Add</button>
<ul id="todo-list"></ul>

Challenge
0/5
To-do List

Define an interface Todo with id, text, and done, and keep all to-dos in an array

Write a function render(todos: Todo[]): void that rebuilds the list from the array. Each item has a checkbox, the text, and a delete button.

Add a to-do when the button is clicked, but not when the input is empty

Register a single click listener on the list for all checkboxes and delete buttons. Narrow event.target to find out what was clicked.

Show done items with a strikethrough
Done when
You can add, check off, and delete to-dos, and the list never contains an empty item.

Hint
Bonus: Keep the to-dos
Right now, a reload deletes all to-dos. Store them in localStorage, and check them when you load them, because anybody can change localStorage in the developer tools.

Challenge
0/4
Keep the to-dos

Save the to-do array to localStorage as JSON after every change

On page load, read it back with JSON.parse() and annotate the result as unknown

Write a type guard isTodo and keep only the entries that pass it

In the developer tools, change done of a saved to-do to a string, and reload the page
Done when
Your to-dos survive a reload, and the changed entry disappears instead of breaking the page.