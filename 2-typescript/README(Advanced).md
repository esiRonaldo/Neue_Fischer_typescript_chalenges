
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

