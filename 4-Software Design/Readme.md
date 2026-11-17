# Software Design Paradigms - Challenges
Translate this file ↗
You build four small parts of a library system: a book list made with pure functions, a reservation that guards its own status, notifications that go out through several channels, and a fee report that you clean up with the design principles.

Parts 1 to 4 are the core of the day. They do not depend on each other, but they follow the order of the handouts. If you finish early, pick a task from the bonus section.

Prerequisites
Create a new project with Bun or Node.js. In what follows, we assume that Bun is used. Each part gets its own file:

src/
  catalogue.ts
  reservation.ts
  notifications.ts
  fees.ts

bun src/catalogue.ts runs a file, and bun run typecheck reports type errors. Run both before you tick off a step.

1 Functional data transformation
The goal of this part is a small set of pure functions that turn database rows into the shape an API sends back, without changing the rows.

A model function returns these rows from a books table. SQLite has no boolean type, so is_available is 1 or 0, and added_at is a Unix timestamp in seconds. Copy the type and the rows into src/catalogue.ts:

type BookRow = {
  id: number;
  title: string;
  author_name: string;
  is_available: 0 | 1;
  added_at: number;
};

const bookRows: BookRow[] = [
  {
    id: 1,
    title: "Dune",
    author_name: "Frank Herbert",
    is_available: 1,
    added_at: 1730937600,
  },
  {
    id: 2,
    title: "Piranesi",
    author_name: "Susanna Clarke",
    is_available: 1,
    added_at: 1731196800,
  },
  {
    id: 3,
    title: "Kindred",
    author_name: "Octavia E. Butler",
    is_available: 0,
    added_at: 1731024000,
  },
  {
    id: 4,
    title: "Neuromancer",
    author_name: "William Gibson",
    is_available: 0,
    added_at: 1731283200,
  },
  {
    id: 5,
    title: "The Left Hand of Darkness",
    author_name: "Ursula K. Le Guin",
    is_available: 1,
    added_at: 1731110400,
  },
];

Challenge
0/4
Map rows to responses

A type BookResponse with id, title, authorName, and addedAt. addedAt is a date string like "2024-11-07T00:00:00.000Z".

toBookResponse(row) turns one BookRow into one BookResponse

getAvailableBooks(rows) keeps only the available books and turns each one into a BookResponse. Use filter and map.

sortNewestFirst(rows) returns the rows sorted by added_at, newest first. The array you pass in keeps its order.
Done when
console.log(getAvailableBooks(sortNewestFirst(bookRows))) prints “Piranesi”, “The Left Hand of Darkness”, and “Dune”, in this order and with camelCase keys. Logging bookRows afterwards still shows five rows with “Dune” first.

Hint
new Date() expects milliseconds, so multiply added_at by 1000. toISOString() turns the date into the string format above.

Hint
sort() sorts the array it is called on, so the caller’s array changes too. toSorted() returns a sorted copy instead.

Challenge
0/2
Pure or impure

Above each function, write a one-line comment: is it pure, and why?

Below the functions, answer in a comment: imagine an Express app with a GET /api/books endpoint that uses these functions. Which layer runs the SQL query, which layer sends the response, and where is getAvailableBooks called?
Done when
Every function has a comment, and your answer names a layer for each of the three questions.

Hint
Refer to Functional Programming in TypeScript for pure functions, immutability, and side effects at the edges.

2 Reservation class
The goal of this part is a class that guards its own state. A new reservation has the status "reserved". From there it changes exactly once: to "returned" when the member brings the book back, or to "cancelled" when the member cancels. Any other change is rejected.

Challenge
0/6
BookReservation

A type ReservationStatus with the values "reserved", "returned", and "cancelled"

The class BookReservation in src/reservation.ts takes a member ID and a book title in its constructor and stores both in fields.

The status lives in a #private field and starts as "reserved"

A getter status returns the current status. Without a setter, code outside the class can read the status but not change it.

markReturned() changes the status to "returned". If the status is not "reserved", it throws an Error whose message names the current status.

cancel() works the same way and changes the status to "cancelled"
Done when
The script below prints reserved, returned, and your error message. Adding the line reservation.status = "cancelled"; makes bun run typecheck report that status is read-only.

const reservation = new BookReservation("42", "Dune");
console.log(reservation.status);

reservation.markReturned();
console.log(reservation.status);

try {
  reservation.cancel();
} catch (error) {
  console.log(error instanceof Error ? error.message : error);
}

Hint
markReturned and cancel start with the same check. A private method keeps that check in one place.

Refer to TypeScript Classes for #private fields and getters.

3 Notification system
The goal of this part is a notification system for the library. Members get a message when a reservation is confirmed or a book is overdue, through every channel they have turned on, for example email and SMS. All channels share one message format, and the code that sends notifications does not care which channels exist.

These are the pieces you build and how they relate:

Notifiable               interface
└─ BaseNotifier          abstract class, implements Notifiable
   ├─ EmailNotifier      extends BaseNotifier
   └─ SmsNotifier        extends BaseNotifier

NotificationService      uses a list of Notifiable channels

Everything goes into src/notifications.ts. Start with one type for the two events and use it wherever an event appears:

type LibraryEvent = "reservation" | "overdue";

Challenge
0/5
Interface and base class

The interface Notifiable declares notify(memberId: string, event: LibraryEvent, title: string): void and getChannelName(): string

The abstract class BaseNotifier implements Notifiable

Its protected method formatMessage(event, title) returns Your reservation for 'Dune' is confirmed. for "reservation" and Reminder: 'Dune' is overdue. for "overdue", with the real title instead of Dune

It declares protected abstract send(memberId: string, message: string): void and abstract getChannelName(): string. The subclasses fill in both.

Its notify method calls formatMessage, then send
Done when
bun run typecheck reports no errors. Adding new BaseNotifier() makes it report that you cannot create an instance of an abstract class.

Challenge
0/3
Email and SMS

EmailNotifier and SmsNotifier extend BaseNotifier

EmailNotifier sends by logging Sending email to member #<memberId>: <message>, SmsNotifier logs the same with SMS instead of email

getChannelName() returns "email" and "sms"
Done when
new EmailNotifier().notify("42", "overdue", "Dune") logs Sending email to member #42: Reminder: 'Dune' is overdue.

Challenge
0/4
NotificationService

The constructor takes an array of Notifiable channels, the ones a member has turned on. Store it in a private field.

dispatch(memberId, event, title) calls notify on every channel

getChannelNames() returns the names of all channels

In a comment above the class, explain why the constructor takes Notifiable[] and not BaseNotifier[]
Done when
The script below prints the names email and sms, followed by the two lines of expected output under the script.

const service = new NotificationService([
  new EmailNotifier(),
  new SmsNotifier(),
]);
console.log(service.getChannelNames());
service.dispatch("42", "reservation", "Dune");

Sending email to member #42: Your reservation for 'Dune' is confirmed.
Sending SMS to member #42: Your reservation for 'Dune' is confirmed.

Refer to TypeScript Classes for protected, interfaces, and abstract classes, and to OOP Design Principles for code that depends on an interface instead of a concrete class.

4 Refactor a fee report
The goal of this part is to apply SRP, DRY, and separation of concerns to code that works but is hard to change. The library charges 0.50 EUR for every day a book is overdue, at most 10 EUR per book. All amounts are in cents.

Copy the code into src/fees.ts and run it:

type Loan = {
  memberId: string;
  title: string;
  dueDate: string;
  returnedDate: string | null;
};

const loans: Loan[] = [
  { memberId: "42", title: "Dune", dueDate: "2024-11-15", returnedDate: null },
  {
    memberId: "7",
    title: "Piranesi",
    dueDate: "2024-11-18",
    returnedDate: "2024-11-17",
  },
  {
    memberId: "42",
    title: "Kindred",
    dueDate: "2024-10-20",
    returnedDate: null,
  },
  {
    memberId: "7",
    title: "Neuromancer",
    dueDate: "2024-11-25",
    returnedDate: null,
  },
  {
    memberId: "13",
    title: "The Left Hand of Darkness",
    dueDate: "2024-11-17",
    returnedDate: null,
  },
];

function printOverdueReport(loans: Loan[], today: string): void {
  console.log("Overdue report");
  let total = 0;
  for (const loan of loans) {
    if (loan.returnedDate === null) {
      const days = Math.floor(
        (Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000,
      );
      if (days > 0) {
        let fee = days * 50;
        if (fee > 1000) {
          fee = 1000;
        }
        total += fee;
        console.log(
          `${loan.title} (member #${loan.memberId}): ${days} days, ${(fee / 100).toFixed(2)} EUR`,
        );
      }
    }
  }
  console.log(`Total: ${(total / 100).toFixed(2)} EUR`);
}

function getMemberFee(loans: Loan[], memberId: string, today: string): number {
  let total = 0;
  for (const loan of loans) {
    if (loan.memberId === memberId && loan.returnedDate === null) {
      const days = Math.floor(
        (Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000,
      );
      if (days > 0) {
        total += Math.min(days * 50, 1000);
      }
    }
  }
  return total;
}

printOverdueReport(loans, "2024-11-20");
console.log(getMemberFee(loans, "42", "2024-11-20"));

It prints:

Overdue report
Dune (member #42): 5 days, 2.50 EUR
Kindred (member #42): 31 days, 10.00 EUR
The Left Hand of Darkness (member #13): 3 days, 1.50 EUR
Total: 14.00 EUR
1250

📌 Rule of thumb
A refactoring changes how the code is built, not what it does. After every step, the output stays exactly the same.

Challenge
0/1
Find the problems

In a comment at the top of src/fees.ts, name one problem for each principle: SRP, DRY, and separation of concerns. Point to the function or the lines.
Done when
Your comment has three entries, one per principle.

Challenge
0/4
Refactor

The fee rule lives in one place: two constants for the daily fee and the maximum, and one function calculateFee(daysOverdue)

Pure functions take over the steps that printOverdueReport mixes together, for example getDaysOverdue(loan, today), formatEuro(cents), and a function that returns the overdue loans

getMemberFee uses the same functions

Apart from the two test lines at the bottom, only printOverdueReport calls console.log
Done when
The output matches the one above character for character. To change the daily fee to 0.60 EUR, you edit one line, and both the report and getMemberFee change with it.

Hint
Refer to OOP Design Principles for SRP, DRY, and separation of concerns, and to Functional Programming in TypeScript for side effects at the edges.

Bonus
The bonus tasks are independent of each other. Pick the one that interests you most.

Challenge
0/3
Overdue reminders

The BookReservation constructor takes a third parameter, dueDate: Date

isOverdue(today: Date) returns true if the status is "reserved" and today is after the due date

In a new file src/reminders.ts, sendOverdueReminders(reservations, today, service) dispatches an "overdue" event for every overdue reservation
Done when
With three reservations, one of them overdue on the today you pass in, every channel sends exactly one reminder, for that book.

Hint
Challenge
0/3
A test channel

TestNotifier implements Notifiable directly, without BaseNotifier. Instead of logging, it stores each notification as an object with memberId, event, and title.

A getter sent returns a copy of the stored notifications, so code outside the class cannot change the list

Pass a TestNotifier to a NotificationService together with an EmailNotifier
Done when
After one dispatch, sent has one entry with the values you dispatched, and NotificationService did not change.

Challenge
0/1
Walk the prototype chain

getPrototypeNames(value: object) follows Object.getPrototypeOf until it reaches null and collects the constructor.name of each prototype
Done when
getPrototypeNames(new EmailNotifier()) returns ["EmailNotifier", "BaseNotifier", "Object"].

Refer to the section on classes before ES6 in JavaScript Classes for the prototype chain.

Challenge
0/4
Refactor your recap project

Create a branch refactor-design in the repository of your last recap project

Create REFACTORING.md and list places that break SRP, DRY, or separation of concerns. For each one, write the file, the principle, and one sentence on what is wrong.

Fix them one at a time, with one commit per fix. After each fix, the pages and endpoints you touched behave as before.

Look for a place where a class helps: state and behavior that belong together, or several variants of the same thing. Write down in REFACTORING.md why you added a class, or why you found no good place for one.
Done when
REFACTORING.md lists your findings and your class decision, git log shows one commit per fix, and the app behaves as before.

Hint
Good places to start: 404 handling that repeats in several controllers, the same checks in a form handler and in an API handler, and SQL or date formatting outside the model and util files. One candidate for a class is an error with a status code, like class NotFoundError extends Error.

# Software Design CS Fundamentals - Challenges
Translate this file ↗
You build an undo and redo feature from two stacks, read the complexity of code snippets, measure insertion sort, and choose architectures for three products. The parts follow the order of the handouts.

Parts 1 to 4 are the core of the day. They do not depend on each other. If you finish early, pick a task from the bonus section.

Prerequisites
Create a new project with Bun or Node.js. In what follows, we assume that Bun is used. Part 1 runs in the browser and needs Bun in any case: bun ./index.html turns your TypeScript into JavaScript the browser can load. Don’t forget to add "DOM" to lib in tsconfig.json as well. Without it, TypeScript reports Cannot find name 'document'.

"lib": ["ESNext", "DOM"]

The parts use these files:

index.html
big-o.md
architecture.md
src/
  edit-history.ts
  try-history.ts
  main.ts
  insertion-sort.ts

bun src/try-history.ts runs a file, bun ./index.html starts a development server for the page, and bun run typecheck reports type errors.

📝Node.js runs TypeScript files, but it cannot serve them to the browser. Projects without Bun usually use a build tool such as Vite for this.

1 Undo and redo with two stacks
Build a small UI with one text input and two buttons, Undo and Redo. It tracks the edit history with two stacks: back holds earlier values, forward holds values you have undone.

Use vanilla TypeScript and HTML. Write the logic as a class of its own, so you can test it without a browser.

Challenge
0/6
Edit history

In src/edit-history.ts, export a class EditHistory. It stores the current value and two private arrays, back and forward. Apart from emptying forward, use only push and pop on them, so they work as stacks.

The constructor takes the initial value

record(value) pushes the current value onto back, makes value the current value, and empties forward

undo() pushes the current value onto forward and makes the value popped from back the current value. If back is empty, it does nothing.

redo() works the other way round: it pushes the current value onto back and makes the value popped from forward the current value. If forward is empty, it does nothing.

The getters current, canUndo, and canRedo return the current value and whether undo or redo is possible
Done when
bun src/try-history.ts with the script below prints a true true, then ab, then abx false.

import { EditHistory } from "./edit-history.ts";

const history = new EditHistory("");
history.record("a");
history.record("ab");
history.record("abc");

history.undo();
history.undo();
console.log(history.current, history.canUndo, history.canRedo);

history.redo();
console.log(history.current);

history.record("abx");
console.log(history.current, history.canRedo);

Hint
Challenge
0/4
User interface

Copy the HTML below into index.html

src/main.ts creates an EditHistory and calls record on every input event of the text input, so every keystroke is one step

The Undo and Redo buttons call undo and redo and write current back into the input

A button is disabled while its action is not possible, also right after the page loads
Done when
Type abc. Three clicks on Undo empty the input and disable Undo. Two clicks on Redo show ab. Typing x shows abx and disables Redo.

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Undo and redo</title>
  </head>
  <body>
    <input id="text" type="text" />
    <button id="undo">Undo</button>
    <button id="redo">Redo</button>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>

Hint
Hint
Refer to Data Structures for stacks.

2 Big O reasoning
Each snippet below takes an array arr of length n, except snippets 5 and 6, which receive two arrays, a and b, with n elements each.

// snippet 1
function first(arr: number[]) {
  return arr[0];
}

// snippet 2
function second(arr: number[]) {
  let total = 0;
  for (const value of arr) {
    total += value;
  }
  return total;
}

// snippet 3
function third(arr: number[]) {
  for (const a of arr) {
    for (const b of arr) {
      if (a === b) console.log(a);
    }
  }
}

// snippet 4
function fourth(arr: number[]) {
  for (const value of arr) {
    for (let i = 0; i < 10; i++) {
      console.log(value, i);
    }
  }
}

// snippet 5
function fifth(a: number[], b: number[]) {
  return a.filter((value) => b.includes(value));
}

// snippet 6
function sixth(a: number[], b: number[]) {
  const lookup = new Set(b);
  return a.filter((value) => lookup.has(value));
}

// snippet 7: arr is sorted in ascending order
function seventh(arr: number[], target: number) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = arr[mid];
    if (value === undefined) return false;
    if (value === target) return true;
    if (value < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return false;
}

// snippet 8
function eighth(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return [...eighth(arr.slice(0, mid)), ...eighth(arr.slice(mid))];
}

Challenge
0/2
Assign complexity classes

In big-o.md, write the time complexity of each snippet and one sentence that explains it, in the form Snippet 1: O(...), because ...

For snippet 6, also write how much extra memory it needs
Done when
big-o.md has a class and a reason for all eight snippets. Compare your classes with the solution, and reread the matching part of the handout for every one that differs.

Hint
Some built-in methods walk the array, even though you don’t see a loop. includes, slice, and the spread syntax ... visit every element they work on.

Hint
For snippet 8, count how often the array can be halved until the pieces have one element, and how many elements are copied on each of these levels.

Solution
Are you sure you want the solution? 😇
Refer to Algorithms for Big O notation, the common complexity classes, and space complexity.

3 Insertion sort
The goal of this part is to implement insertion sort and to see its best case and its worst case in numbers.

🔔With noUncheckedIndexedAccess, arr[i] has the type number | undefined, even in a loop that stays inside the array. Store the value in a variable and check it for undefined before you compare it.

Challenge
0/3
Implement

In src/insertion-sort.ts, export a function insertionSort(numbers) that returns a copy sorted in ascending order. Copy the input once at the start and sort the copy in place, so numbers keeps its order.

Follow the algorithm from the handout: walk through the array from the second element, and slide each element to the left past every larger value

In a comment, explain why an empty array and an array with one element need no special case
Done when
insertionSort([5, 2, 4, 6, 1, 3]) returns [1, 2, 3, 4, 5, 6], insertionSort([]) returns [], and the input array keeps its order.

Challenge
0/4
Count comparisons

Add a counter that goes up by one each time your code compares two numbers of the array

Change the function so that it returns { sorted, comparisons }

Run it on the four inputs below and write the counts into a comment

In the same comment, explain why the reversed arrays cost so much more than the sorted one
Done when
The counts are 4, 10, 0, and 45, in the order of the inputs.

insertionSort([1, 2, 3, 4, 5]);
insertionSort([5, 4, 3, 2, 1]);
insertionSort([42]);
insertionSort([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

Hint
Count only the comparisons between two numbers of the array, not the check j >= 0. The comparison that ends the inner loop counts as well: in the sorted array, every element is compared once with its left neighbor, and nothing moves.

Hint
The while condition from the pseudo code reads arr[j], which TypeScript sees as possibly undefined. Move that part of the check into the loop body:

while (j >= 0) {
  const previous = sorted[j];
  if (previous === undefined || previous <= current) break;
  // move previous one position to the right
  j--;
}

Hint
From 5 to 10 reversed elements, the input doubles. How much does the count grow, and which complexity class grows like that?

Refer to Algorithms for insertion sort and its best and worst case.

4 Choose an architecture
The goal of this part is to apply the architecture patterns to three products. There is no single correct answer. What counts is that your reasons fit the situation.

Bakery orders: A bakery with four shops takes pre-orders online. Two developers build and run the system. There are about 200 orders a day, spread evenly over the day. Every night at 2:00, each shop gets a list of the next day’s orders.
Concert tickets: A ticket platform is quiet most of the time. When a big concert goes on sale, traffic grows a hundredfold within minutes and stays there for about an hour. Five developers work on it.
Online marketplace: Eight teams of six developers each work on search, product pages, checkout, recommendations, and tools for sellers. Checkout must keep working when recommendations fail. Each team wants to release several times a day without waiting for the others.
Challenge
0/3
Architecture decisions

In architecture.md, write for each product how it is deployed (monolith, microservices, serverless, or a combination) and how the code inside is organized

Name one trade-off you accept with each choice

Name one change in the product or the team that would make you rethink each choice
Done when
architecture.md covers all three points for each product, and every reason points to something in the description, such as team size, traffic, or a requirement.

💡Go through the scales one at a time: first how the product is deployed, then how the code inside is organized. Different answers in the group make a good discussion at the checkout.

Refer to Architecture, especially the example of the appointment booking product, for reasoning one scale at a time.

Bonus
The bonus tasks are independent of each other. Pick the one that interests you most.

Challenge
0/4
Undo history as a doubly linked list

LinkedEditHistory in src/linked-edit-history.ts has the same constructor, methods, and getters as EditHistory

Inside, every step is a node with value, previous, and next, and the class keeps a reference to the current node. It uses no arrays.

undo and redo move the reference. record appends a new node after the current one, so the steps that came after it are gone.

try-history.ts and main.ts use LinkedEditHistory instead of EditHistory
Done when
The test script prints the same three lines as before, and the page behaves the same.

Hint
Challenge
0/4
Walk a file tree

Copy the types and the tree below into src/file-tree.ts

totalSize(node) adds up the sizes of all files in the tree

height(node) returns the depth of the deepest leaf, counted in steps from node

findPath(node, name) returns the path to the file or folder with that name, or undefined if there is none
Done when
totalSize(root) returns 19, height(root) returns 3, and findPath(root, "format.ts") returns "project/src/utils/format.ts".

type FileNode = { name: string; size: number };
type FolderNode = { name: string; children: TreeNode[] };
type TreeNode = FileNode | FolderNode;

const root: FolderNode = {
  name: "project",
  children: [
    { name: "README.md", size: 2 },
    {
      name: "src",
      children: [
        { name: "main.ts", size: 4 },
        { name: "utils", children: [{ name: "format.ts", size: 1 }] },
      ],
    },
    { name: "assets", children: [{ name: "logo.svg", size: 12 }] },
  ],
};

Hint
Challenge
0/3
Merge sort against insertion sort

In src/merge-sort.ts, mergeSort(numbers) follows the pseudo code from the handout and returns { sorted, comparisons }, like your insertion sort

Run both functions on the three arrays below

In a comment, explain which algorithm wins on which input, and what that has to do with TimSort
Done when
For the reversed array, insertion sort makes 499,500 comparisons and merge sort about 5,000. For the sorted array, insertion sort needs only 999 and beats merge sort.

const sorted = Array.from({ length: 1000 }, (_, i) => i);
const reversed = sorted.toReversed();
const random = Array.from({ length: 1000 }, () =>
  Math.floor(Math.random() * 1000),
);

Hint
shift() moves every remaining element one position forward. Two index variables, one per half, avoid that.

Importing insertionSort also runs the top-level code of insertion-sort.ts. Move your test calls into a separate file.

Challenge
0/4
LRU cache

LruCache takes a capacity in its constructor and has get(key: string): string | undefined and set(key: string, value: string): void

get and set mark the key as the most recently used one

When set adds a new key to a full cache, it first removes the least recently used key

Both methods take the same time, no matter how many entries the cache holds
Done when
The script below prints undefined 1 3.

const cache = new LruCache(2);
cache.set("a", "1");
cache.set("b", "2");
cache.get("a");
cache.set("c", "3");
console.log(cache.get("b"), cache.get("a"), cache.get("c"));

Hint
A Map remembers the order in which its keys were inserted, and map.keys().next().value returns the oldest key. Deleting a key and setting it again moves it to the end. The handout describes the classic version with a hash map and a doubly linked list. Build that one if you want to go further.

# Software Design Patterns - Challenges
Translate this file ↗
These exercises test your ability to apply design patterns in realistic scenarios. The first three ask you to design a solution from scratch. The fourth one gives you existing, tightly coupled code that you should refactor using the concepts from this session.

Each challenge is written like a ticket in a real project. The acceptance criteria describe what the result must do, and the technical requirements name the patterns to use. How you get there is up to you. If you get stuck, open the step-by-step guide below the ticket.

Summoning Circle
In a fantasy game, the player puts ingredients into a summoning circle, and a creature appears that matches the ingredient. The game designers keep inventing new creatures, so the code that summons them should not have to change everywhere for each new one.

Challenge
0/5
Summoning Circle
Acceptance criteria


Each ingredient (fire, air, sparkles) summons a different creature

Every creature has a name, and when it uses its ability, it logs what it does, for example Dragon breathes fire

An unknown ingredient throws an error that names the ingredient
Technical requirements


A SummoningCircle class with a method summon(ingredient: string) works as a factory

The calling code only knows a shared Creature interface, never the concrete creature classes
Done when
A script summons one creature per ingredient, lets each one use its ability, and catches the error for an unknown ingredient.

Step by step
Define an interface Creature with a name: string and a method useAbility(): void that logs what the creature does.
Create one class per creature that implements Creature, for example Dragon (breathes fire), Phoenix (is reborn from its ashes), and Unicorn (dances on a rainbow).
Create the class SummoningCircle with a method summon(ingredient: string): Creature. A switch statement picks the class to create for each ingredient.
Add a default case that throws an error with the unknown ingredient in its message.
Call summon() with each ingredient and call useAbility() on the result. Then call it with an unknown ingredient inside try/catch.
API Request Builder
Your team sends HTTP requests from many places in the code. Right now, every call passes one large configuration object full of optional fields, and invalid requests, like a POST without a body, are only noticed when the server rejects them. Requests should be assembled step by step, and invalid ones should fail before they are sent.

Challenge
0/6
API Request Builder
Acceptance criteria


A request with method, URL, headers, query parameters, and a JSON body can be assembled in one chained expression

Building a request without a URL throws an error

Building a POST request without a body throws an error

TypeScript reports an error when code tries to change a finished request
Technical requirements


A RequestBuilder class with chainable methods and a build() method (Builder pattern)

build() is the only place that validates the parts and creates the finished HttpRequest
Done when
One chained call builds a valid GET request and another a valid POST request, and both invalid cases throw errors with clear messages.

Step by step
Define an interface HttpRequest with readonly properties for method, url, headers, query, and an optional body. Use Readonly<Record<string, string>> for headers and query, so that their entries cannot change either.
Create the class RequestBuilder. It keeps the parts set so far in private fields.
Add the methods withMethod(), withUrl(), withHeader(name, value), withQuery(name, value), and withJsonBody(body). Each one stores its value and returns this.
Write build(). It throws an error if no URL was set, or if the method is POST and no body was set. Otherwise, it returns a new HttpRequest.
Try to assign a new url to a built request, and check that TypeScript reports an error.
Hint
Don’t name your type Request. The browser and Node.js already have a global Request type from the Fetch API, and in a file without import or export, TypeScript reports a duplicate identifier.

Order Lifecycle
An online shop tracks every order from the shopping cart to the customer’s door. Support keeps finding orders in impossible situations, like orders that were shipped without being paid. The Order class should only allow the changes that make sense in its current state.

Challenge
0/5
Order Lifecycle
Acceptance criteria


A new order starts in the state Draft

The order allows exactly these transitions:
checkout: Draft → AwaitingPayment
payment_received: AwaitingPayment → Paid
dispatch: Paid → Shipped
confirm_delivery: Shipped → Delivered
cancel: Draft, AwaitingPayment, or Paid → Cancelled

Any other event throws an error that names the event and the current state
Technical requirements


The state is a single field with a union type, not several booleans

All legal transitions are listed in one transition table
Done when
A script runs one order from Draft to Delivered, cancels a second order after payment, and catches the error when it tries to dispatch an unpaid order.

Step by step
Log Exporter Refactoring
The log exporter below works, but it is hard to test and hard to extend. It opens its own database connection, so every test needs a database. And every new output format means another branch in the same method. In terms of design principles, it breaks the Single Responsibility Principle and the Open/Closed Principle. The ops team wants more formats soon, and tests should run without a database.

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

function getMockDB() {
  return {
    async query(_sql: string): Promise<LogEntry[]> {
      return [
        {
          timestamp: "2026-03-02T09:00:00Z",
          level: "info",
          message: "Server started",
        },
        {
          timestamp: "2026-03-02T09:05:12Z",
          level: "warn",
          message: "Slow response",
        },
        {
          timestamp: "2026-03-02T09:07:40Z",
          level: "error",
          message: "Database timeout",
        },
      ];
    },
  };
}

class LogExporter {
  async exportLogs(format: "json" | "csv" | "xml") {
    const db = getMockDB();
    const logs = await db.query("SELECT * FROM system_logs");

    if (format === "json") {
      return JSON.stringify(logs);
    } else if (format === "csv") {
      return logs
        .map((l) => `${l.timestamp},${l.level},${l.message}`)
        .join("\n");
    } else if (format === "xml") {
      return `<logs>${logs.map((l) => `<log>${l.message}</log>`).join("")}</logs>`;
    } else {
      throw new Error("Unknown format");
    }
  }
}

Challenge
0/6
Log Exporter Refactoring
Acceptance criteria


All three formats produce exactly the same output as before the refactoring

LogExporter can be tested with a fixed list of log entries, without any database

Adding a fourth format, like YAML, requires no change to LogExporter
Technical requirements


A LogRepository interface hides the data access, and LogExporter receives it through its constructor (Repository and Dependency Injection)

Each format is its own class behind a shared LogFormatter interface (Strategy), and a factory picks the formatter for a format string (Factory)

LogExporter contains no if/else chain or switch on the format
Done when
The refactored exporter, wired with an in-memory repository, prints the same JSON, CSV, and XML as the original code.

Step by step
Before you change anything, run the original code once per format and save the output, so that you can compare later.
Define an interface LogRepository with a method findAll(): Promise<LogEntry[]>. Write two implementations: DatabaseLogRepository, which runs the query from the original code, and InMemoryLogRepository, which returns the entries you pass to its constructor.
Change LogExporter, so that it receives a LogRepository in its constructor and no longer calls getMockDB().
Define an interface LogFormatter with a method format(logs: LogEntry[]): string. Move each branch into its own class: JsonFormatter, CsvFormatter, and XmlFormatter.
Write a factory createFormatter(format: string): LogFormatter that returns the matching formatter and throws an error for an unknown format.
Let exportLogs() ask the factory for a formatter and return its result. Compare the output with the one you saved in step 1.
Bonus: Order Notifications
When an order changes its state, other parts of the shop need to react. The warehouse reserves the items as soon as an order is paid, and the customer gets an email when it ships. The Order class from the order lifecycle ticket should not know anything about emails or the warehouse.

Challenge
0/4
Order Notifications
Acceptance criteria


When an order is paid, the warehouse logs a reservation message

When an order is shipped, a simulated email is logged

A new reaction to state changes can be added without changing the Order class
Technical requirements


Order lets listeners subscribe and notifies all of them after every transition, with the old and the new state (Observer)
Done when
Running one order from Draft to Delivered logs the reservation once and the email once.

Hint
Define a listener type like (from: OrderState, to: OrderState) => void, and call every listener at the end of transition(), after the state has changed.