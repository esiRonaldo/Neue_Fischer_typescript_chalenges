# TypeScript Basics - Challenges
Translate this file ↗
Code Along: Music Library
This code along builds a small music library application from scratch, one concept at a time. Each part maps directly to the session material. By the end you have a working TypeScript project with typed data, union types, interfaces, intersections, and tuples. In the project setup session, you will split it into multiple modules.

Part 1: Install TypeScript and compile a file
Create a folder for the project and install the TypeScript compiler in it:

mkdir music-library
cd music-library
npm init -y
npm install --save-dev typescript

Confirm the installation worked:

tsc -v

You should see the version number as the output, something like Version 7.0.2.

Create a file called hello.ts in the music-library folder:

const greeting: string = "Hello from TypeScript!";
console.log(greeting);

Compile it and run the output:

tsc hello.ts
node hello.js

Open hello.js and compare it to hello.ts. The : string annotation is gone. The emitted file is plain JavaScript.

Part 2: Set up a project
Delete hello.ts and hello.js. Then create this folder structure:

music-library/
  node_modules/
  src/
  dist/
  package.json
  tsconfig.json

node_modules and package.json already exist from part 1. Add the tsconfig.json from the basic setup.

Part 3: Type annotations and aliases
Create src/index.ts. Add annotated variables and a type alias for the core data model:

type TrackId = number;
type ArtistName = string;

type Track = {
  id: TrackId;
  title: string;
  artist: ArtistName;
  liked: boolean;
};

function describeTrack(track: Track): string {
  return `${track.title} by ${track.artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

console.log(describeTrack(tracks[0]));

Compile and run:

tsc
node dist/index.js

From now on, you can also keep tsc --watch and node --watch dist/index.js running in two terminals, as described in the basic setup.

Now deliberately add a type error. Remove liked: true from the first track and run tsc again. Read the error, then fix it before continuing.

Part 4: Union types
Add the following block to src/index.ts. It adds a format for each release and a track length that can be given either in seconds or as a ready-made "m:ss" string:

type Format = "vinyl" | "cd" | "digital";
type TrackLength = number | string;

function describeFormat(format: Format): string {
  return `Available on ${format}`;
}

function formatLength(length: TrackLength): string {
  if (typeof length === "number") {
    const minutes = Math.floor(length / 60);
    const seconds = length % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
  return length;
}

console.log(describeFormat("vinyl"));
console.log(formatLength(245));
console.log(formatLength("3:12"));

Compile and run the project again. Then call describeFormat("cassette"), run tsc, and read the error. Remove the call before continuing.

Next, simulate a value from outside your code:

const rawLength: unknown = JSON.parse("198");

console.log(formatLength(rawLength));

The compiler rejects the call, because unknown is not assignable to TrackLength. Wrap the call in a typeof rawLength === "number" check so it only runs when the value really is a number.

Part 5: Type inference
Add the following block to src/index.ts:

const label = "My Library";
const trackCount = tracks.length;

function formatId(id: number): string {
  return `TRK-${id}`;
}

const ids = tracks.map((t) => formatId(t.id));
console.log(ids, label, trackCount);

None of these need explicit annotations. Hover over label, trackCount, ids, and the t parameter in your editor to confirm what TypeScript inferred.

Then add this line and try to compile:

const count: string = trackCount;

The error reports the inferred type of trackCount. Remove the line before moving on.

Part 6: Interfaces
Replace the Track type alias with an interface and extend it with a more specific shape. Remove the old type Track declaration and add:

interface Media {
  id: number;
  title: string;
}

interface Track extends Media {
  artist: string;
  liked: boolean;
}

interface FeaturedTrack extends Track {
  curatedBy: string;
  readonly addedDate: string;
}

The tracks array already uses Track, so nothing there needs to change. Add a FeaturedTrack object:

const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

console.log(`${pick.title} — featured since ${pick.addedDate}`);

Try reassigning pick.addedDate after the object is created and observe the compiler error. Remove that line before continuing.

Part 7: Intersection types and tuples
Give some tracks a rating without changing the Track interface. Combine Track with a small rating type using &:

type HasRating = {
  rating: 1 | 2 | 3 | 4 | 5;
};

type RatedTrack = Track & HasRating;

const review: RatedTrack = {
  id: 4,
  title: "Ivy",
  artist: "Frank Ocean",
  liked: true,
  rating: 5,
};

console.log(`${review.title}: ${review.rating}/5`);

Remove the rating property from review and read the error. Then try a rating of 6. Restore the object before continuing.

Now add a chart where each entry is a pair of a chart position and a track title:

type ChartEntry = [number, string];

const chart: ChartEntry[] = [
  [1, "Nights"],
  [2, "Blue Light"],
];

for (const [position, title] of chart) {
  console.log(`#${position} ${title}`);
}

Hover over position and title to see that each gets the type of its position in the tuple. Then add an entry with a third element, or with the two values swapped, and read the errors.

Recipe Book
Create a new folder outside of your music library project and install TypeScript in it with npm init -y and npm install --save-dev typescript. Then create a single TypeScript file called recipes.ts. Using only type annotations, type aliases, and function signatures, implement the following:

Challenge
0/5
Recipe Book

A type alias Ingredient with a name (string) and amountGrams (number)

A type alias Recipe with a name, servings (number), vegetarian (boolean), and ingredients (an array of Ingredient)

Two variables annotated as Recipe, each holding a realistic recipe with at least two ingredients

A function summarize(recipe: Recipe): string that returns a readable single-line description of the recipe

A call to summarize for each recipe, logged to the console
Done when
tsc recipes.ts exits without errors, and node recipes.js logs one line per recipe.

Hover over your variables in the editor and confirm the inferred types match what you declared.

Concert Tickets
Create a new folder and install TypeScript in it with npm init -y and npm install --save-dev typescript. Then create a single TypeScript file called tickets.ts. Model the ticket system of a small concert venue:

Challenge
0/9
Concert Tickets

A literal union type TicketTier with the values "standing", "seated", and "vip"

A tuple type Seat that holds a row letter (string) and a seat number (number)

A Ticket interface with a readonly id, a tier, and an optional seat

A VipTicket type that combines Ticket with { loungeAccess: boolean } using an intersection

A function ticketPrice(tier: TicketTier): number that returns a different price for each tier

A function describeSeat(seat: Seat): string that returns a text like "Row C, seat 12"

A function parseQuantity(input: unknown): number that returns the input if it is a number and 0 otherwise

Create at least one ticket of each tier, log their prices, and log the seat description for every ticket that has a seat

Call parseQuantity with a number, a string, and JSON.parse("3"), and log the results
Done when
tsc tickets.ts exits without errors, and node tickets.js logs the prices, the seat descriptions, and three quantities.

# Code Along 
TypeScript Project Setup - Challenges

Code Along: Music Library
This code along continues the music library project from the basics session. You extend its configuration, split the code into modules, read a file with a Node.js API, and look at the declaration files the compiler can generate. Each part maps directly to the session material.

Part 1: Extend the configuration
Open your music-library folder. Its package.json is already there from the basics session. Set its type to module and install the Node.js type package:

npm pkg set type=module
npm install --save-dev @types/node

Replace the content of tsconfig.json with the extended configuration from the extended tsconfig handout. Then compile:

tsc

The new coding rules report that TrackId and ArtistName are declared but never used. The Track interface replaced the old type alias that used them. Remove both aliases and compile again until tsc exits without errors.

Part 2: ES modules
Split the project into separate files. Create src/track.ts and move the interfaces and formatId into it:

// src/track.ts
export interface Media {
  id: number;
  title: string;
}

export interface Track extends Media {
  artist: string;
  liked: boolean;
}

export interface FeaturedTrack extends Track {
  curatedBy: string;
  readonly addedDate: string;
}

export function formatId(id: number): string {
  return `TRK-${id}`;
}

Create src/main.ts as the new entry point. Import the runtime function with a regular import and the interfaces with type-only imports:

// src/main.ts
import { formatId } from "./track.js";
import type { Track, FeaturedTrack } from "./track.js";

const libraryName = "Late Night Listening";

function describeTrack(title: string, artist: string): string {
  return `${title} by ${artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

console.log(`Library: ${libraryName}`);
console.log(describeTrack(tracks[0].title, tracks[0].artist));
tracks.forEach((t) => console.log(formatId(t.id)));
console.log(`Featured: ${pick.title}, added ${pick.addedDate}`);

Delete src/index.ts. Compile and run the new entry point:

tsc
node dist/main.js

Remove the .js extension from one of the import paths and compile again. tsc reports error TS2835, because Node.js would not find the file at runtime. Add the extension back before continuing.

Then move Track from the import type line into the regular import and compile again. verbatimModuleSyntax makes tsc report error TS1484. Undo the change before continuing.

Part 3: Type packages
Create a file called notes.txt in the project root with a line of text, for example Remember to update the playlist on Fridays. Then read it at the end of src/main.ts with the fs module from Node.js:

import { readFileSync } from "node:fs";

const notes = readFileSync("notes.txt", "utf8");
console.log(notes);

Move the import line to the top of the file, next to the other imports. Compile and run the project from the project root. Hover over readFileSync in your editor to see the type information that @types/node provides.

Now change "types": ["node"] to "types": [] in tsconfig.json and compile again. Read the errors about node:fs and console, then restore the setting.

Part 4: A types file and declaration files
Move the three interfaces from src/track.ts into a new file src/types.ts, so that src/track.ts only contains formatId. Export the interfaces from src/types.ts and update the type import in src/main.ts:

import type { Track, FeaturedTrack } from "./types.js";

Compile and run the project again.

Next, add "declaration": true to the compilerOptions in tsconfig.json and compile. Open dist/track.d.ts and dist/types.d.ts and compare them with their .ts sources: the function body of formatId is gone, and only the types and signatures are left. Remove the declaration option again before continuing.

Film Watchlist
Model a film watchlist in TypeScript. The requirements are:

Challenge
0/10
Film Watchlist

Set up a new project with "type": "module" in its package.json and TypeScript installed locally

Set up a tsconfig.json with strict mode enabled

A Watchable base interface with a readonly id, a title, and a year

A Film interface extending Watchable with watched: boolean and an optional rating between 1 and 5

A Playlist interface with a name and an array of films

A function formatFilm(film: Film): string that returns a one-line description. Include the rating only if one is set

A function getUnwatched(playlist: Playlist): Film[] that returns only films where watched is false

Organize the code across two files: one that defines and exports the interfaces and functions, one that imports them and runs the program

The entry point should define a playlist with at least three films and log the output of both functions

Use import type where appropriate
Done when
npx tsc reports no errors, and the entry point logs all films and then only the unwatched ones.

Online Shop
A small online shop sells products organized into categories. Customers place orders. Each order contains one or more line items.

Design the TypeScript type system for this shop from scratch, and implement at least the three functions in the list. Requirements:

Challenge
0/9
Online Shop

A product has a name, a price in euros, and a stock count. Its id must never be reassigned after creation.

Products belong to a category. A category has a name and an optional description.

A customer has an id, name, and email.

An order links a customer to a list of line items. Each line item references a product and a quantity. Orders carry a status of either "pending", "confirmed", or "shipped".

A function orderTotal(order: Order): number that returns the total price across all line items

A function formatOrder(order: Order): string that returns a readable summary of the order

A function isInStock(product: Product): boolean that returns whether the product has stock available

Split the code across at least three files.

Use strict mode.
Done when
The project compiles without errors and logs meaningful output when the entry point runs.