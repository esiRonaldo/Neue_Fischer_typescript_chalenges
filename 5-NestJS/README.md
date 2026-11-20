# NestJS Basics 1 - Challenges
Translate this file ↗
This file starts with a code along. After it come the challenges, written as tickets: a short context, then a box with acceptance criteria, which describe what the result must do, and technical requirements, which name what you have to use. If you get stuck, open the step-by-step help below a ticket.

Code Along: Concerts in a Single File
You build the concert API in a single file and break it on purpose, so that you recognize the error messages when they show up in your own project.

Part 1: Create and Run the Project
Create a single-file project and start it:

npx @nestjs/cli@latest new concerts --minimal --package-manager npm
cd concerts
npm run start:dev

If the CLI asks about observability, answer no. Open src/main.ts. Before you open http://localhost:3000 in the browser, predict what you will see and which method produces it. Then check.

Answer
Hello World!. The request GET / reaches getHello() in AppController, which calls getHello() in AppService.

Part 2: A Concerts Route
Delete AppService and AppController from src/main.ts. Write a ConcertsController that answers GET /concerts with an array containing one concert object with a title and an artist, and register it in AppModule. Try it yourself first, then compare:

Solution
@Controller()
class ConcertsController {
  @Get("concerts")
  findAll() {
    return [{ title: "Late Night Standards", artist: "Mina Okafor Quartet" }];
  }
}

@Module({
  controllers: [ConcertsController],
  providers: [],
})
class AppModule {}

Now break it: remove @Controller() above the class and save. Read the message in the terminal, then put the decorator back.

Part 3: Move the Data into a Service
Add the Concert type and a ConcertsService with two concerts, and inject the service into the controller:

type Genre = "rock" | "jazz" | "classical" | "electronic" | "pop";

type Concert = {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: Date;
  ticketPrice: number;
  genre: Genre;
};

@Injectable()
class ConcertsService {
  private readonly concerts: Concert[] = [
    {
      id: "0b8c2f1e-3d4a-4c5b-9e6f-7a8b9c0d1e2f",
      title: "Late Night Standards",
      artist: "Mina Okafor Quartet",
      venue: "Jazzkeller Hamburg",
      date: new Date("2026-12-04T20:00:00Z"),
      ticketPrice: 28,
      genre: "jazz",
    },
    {
      id: "5e6f7a8b-9c0d-4e1f-8a2b-3c4d5e6f7a8b",
      title: "Static Bloom Tour",
      artist: "Neon Harbor",
      venue: "Columbiahalle Berlin",
      date: new Date("2027-01-16T19:30:00Z"),
      ticketPrice: 45,
      genre: "electronic",
    },
  ];

  findAll(): Concert[] {
    return this.concerts;
  }
}

@Controller()
class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get("concerts")
  findAll() {
    return this.concertsService.findAll();
  }
}

@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
class AppModule {}

Injectable has to be added to the import from @nestjs/common. Check that http://localhost:3000/concerts shows both concerts.

Then break the wiring three times. Predict each outcome before you save, and undo each change before the next one:

Remove ConcertsService from providers.
Remove @Injectable() above ConcertsService.
In tsconfig.json, set emitDecoratorMetadata to false, stop npm run start:dev and start it again. Then request /concerts.
Answer
NestJS stops at startup: “Nest can’t resolve dependencies of the ConcertsController (?). Please make sure that the argument ConcertsService at index [0] is available in the AppModule module.” The entry under providers is what registers a class with the container.
Everything still works. ConcertsService has no dependencies of its own, so NestJS does not need its metadata. A provider with constructor parameters would get undefined for them, and the first request that uses one fails. Keep @Injectable() on every provider, so that adding a dependency later does not break anything.
NestJS starts with a warning that ConcertsController has no decorator metadata, and the request fails with 500 Internal Server Error. Without the parameter types, NestJS does not know what to inject, and this.concertsService is undefined.
List the Threads
The first thing visitors of a discussion board see is the list of threads. Cyber Chat starts there: an API that returns a few sample threads. Creating new threads comes later.

The type and the sample data:

type Thread = {
  id: string;
  title: string;
  author: string;
  body: string;
  createdAt: Date;
};

const sampleThreads: Thread[] = [
  {
    id: "4f5362f7-ee63-495a-8903-8240d95f6625",
    title: "Tabs or spaces, final answer?",
    author: "pixelpirate",
    body: "My team argues about this in every code review. What does your formatter do?",
    createdAt: new Date("2026-11-12T08:15:00Z"),
  },
  {
    id: "733f77d2-f899-4580-8d60-8bac152930c7",
    title: "Why does my useEffect run twice?",
    author: "neonbyte",
    body: "In development, every effect in my React app runs twice. In production, it runs once.",
    createdAt: new Date("2026-11-13T19:42:00Z"),
  },
  {
    id: "43f04043-20cf-4e7a-a430-4cbdf13a5f36",
    title: "Best keyboard for long coding sessions",
    author: "nullpointer",
    body: "My wrists hurt after a full day. Split keyboard, low profile, or something else?",
    createdAt: new Date("2026-11-14T10:05:00Z"),
  },
  {
    id: "ec5074f4-aacf-4f5b-b96b-beb7763d6073",
    title: "Is SQLite enough for a side project?",
    author: "neonbyte",
    body: "I expect maybe a hundred users. Do I really need a database server?",
    createdAt: new Date("2026-11-16T21:30:00Z"),
  },
  {
    id: "1ee0c21f-27cd-4eb3-9bb6-ab1975a77f56",
    title: "Show your terminal setup",
    author: "pixelpirate",
    body: "Prompt, font, color scheme: post a screenshot and tell us what you can't live without.",
    createdAt: new Date("2026-11-17T07:55:00Z"),
  },
];

Challenge
0/5
List the Threads
Acceptance criteria


GET /threads returns the five sample threads as a JSON array

createdAt arrives as an ISO string, for example "2026-11-12T08:15:00.000Z"
Technical requirements


The project comes from nest new --minimal, and ThreadsService and ThreadsController live in src/main.ts, registered in AppModule

The sample threads live in the service, and the controller only calls the service

The controller receives the service through its constructor, without new
Done when
With npm run start:dev running, http://localhost:3000/threads shows the five threads in the browser.

Step by step
Create the project: npx @nestjs/cli@latest new cyber-chat --minimal --package-manager npm. Answer no to observability.
Run cd cyber-chat and npm run start:dev, and check that http://localhost:3000 shows Hello World!.
In src/main.ts, remove AppService and AppController, and add the Thread type from above.
Add ThreadsService with @Injectable(), a private, read-only field threads with the sample data, and a method findAll() that returns it.
Add ThreadsController with @Controller(). It receives ThreadsService as a constructor parameter and has a method with @Get("threads") that returns the result of findAll().
In AppModule, list ThreadsController under controllers and ThreadsService under providers.
Open http://localhost:3000/threads.
Hint
If NestJS stops at startup with “Nest can’t resolve dependencies of the ThreadsController”, check that ThreadsService is listed under providers in AppModule.

Most Active Authors
Moderators want to know who keeps the discussions going. Cyber Chat lists the authors with the number of threads they started, the most active first.

Challenge
0/4
Most Active Authors
Acceptance criteria


GET /threads/authors returns one entry per author with the number of threads they started. For the sample data, that is [{ "author": "neonbyte", "threads": 2 }, { "author": "pixelpirate", "threads": 2 }, { "author": "nullpointer", "threads": 1 }]

Authors with more threads come first, and authors with the same number are sorted alphabetically

GET /threads works as before
Technical requirements


The counting happens in the service, and the controller method only returns the result
Done when
http://localhost:3000/threads/authors shows the array from the first criterion.

Step by step
Add a method getAuthorStats() to ThreadsService.
Count the threads per author in a Map<string, number>: for each thread, read the current count of its author (or 0) and store it increased by one.
Turn the map into an array of objects { author, threads }.
Sort the array: more threads first, and for the same number, alphabetically by author.
In ThreadsController, add a method with @Get("threads/authors") that returns the result of getAuthorStats().
Hint
A compare function can sort by two criteria: b.threads - a.threads || a.author.localeCompare(b.author). When the first difference is 0, || falls back to the second comparison.

Bonus: Filter by Author
Sometimes you only want to read what one person wrote.

Challenge
0/4
Filter by Author
Acceptance criteria


GET /threads?author=neonbyte returns only the threads of neonbyte

Without author, the response contains all threads as before

An author without threads, such as ?author=nobody, returns an empty array
Technical requirements


The filtering happens in the service
Done when
http://localhost:3000/threads?author=pixelpirate shows the two threads of pixelpirate.

Hint
The parameter decorator @Query("author") in front of a method parameter gives you the value from the URL, or undefined when it is missing. The NestJS docs on controllers show @Query() together with the other parameter decorators.

Bonus: Newest First
On a discussion board, new threads belong at the top.

Challenge
0/3
Newest First
Acceptance criteria


GET /threads returns the threads sorted by createdAt, the newest first: “Show your terminal setup” is the first entry, “Tabs or spaces, final answer?” the last

If you solved the bonus “Filter by Author”, the filtered list is sorted the same way
Technical requirements


The sorting happens in the service, and the stored array keeps its original order
Done when
http://localhost:3000/threads starts with “Show your terminal setup”.

Hint
sort() changes the array it is called on, toSorted() returns a sorted copy. createdAt.getTime() turns a date into milliseconds, which you can subtract in a compare function.

# NestJS Basics 2 - Challenges
Translate this file ↗
The challenges are written as tickets: a short context, then a box with acceptance criteria, which describe what the result must do, and technical requirements, which name what you have to use. If you get stuck, open the step-by-step help below a ticket.

Move Cyber Chat into a Full Project
Cyber Chat lives in a single file, and that file grows with every feature. Comments are next, so threads and comments each get a folder and a module of their own.

Challenge
0/5
Move Cyber Chat into a Full Project
Acceptance criteria


GET /threads and GET /threads/authors return the same data as in the single-file version

If you solved the bonus tickets of the single-file version, ?author= and the sorting work as before
Technical requirements


The project comes from nest new, and the threads module, service, and controller come from the Nest CLI

The Thread type lives in src/threads/thread.ts

ThreadsController uses @Controller("threads"), so its route decorators only contain the rest of the path
Done when
npm run start:dev runs without errors, and http://localhost:3000/threads/authors shows the same array as the single-file version.

Step by step
Rename the folder of the single-file project, for example to cyber-chat-single-file, so that the new project can use the name cyber-chat.
Run nest new cyber-chat --package-manager npm. Answer no to observability and keep ESM as the module system.
In the new project, generate the feature: nest g module threads, then nest g service threads, then nest g controller threads.
Create src/threads/thread.ts and move the Thread type there. Add export in front of it.
Move the sample threads and the methods of ThreadsService from the old main.ts into src/threads/threads.service.ts.
Move the handlers into src/threads/threads.controller.ts. Because the controller has the path threads, @Get("threads") becomes @Get(), and @Get("threads/authors") becomes @Get("authors").
Start the project and compare the responses with the single-file version.
Hint
Imports between your own files end in .js, for example import type { Thread } from "./thread.js";.

Open and Read Threads
So far, Cyber Chat only shows the threads it started with. People want to open threads of their own and read a single thread. The threads move into a repository, so the service no longer cares where they are stored.

Challenge
0/7
Open and Read Threads
Acceptance criteria


POST /threads with a JSON body { "title": "...", "author": "...", "body": "..." } creates a thread and answers with status 201 and the new thread, including a generated id and createdAt

GET /threads/:id returns the thread with that ID

GET /threads/:id with an unknown ID answers with status 404

New threads appear in GET /threads and count in GET /threads/authors
Technical requirements


A ThreadsRepository stores the threads in a Map<string, Thread> that starts with the sample threads, and ThreadsService receives it through its constructor

IDs come from randomUUID() from node:crypto, and the server sets createdAt

The 404 comes from a NotFoundException
Done when
After a POST /threads, GET /threads/<new id> returns the new thread, and GET /threads/does-not-exist answers with 404.

Step by step
Add the type ThreadPayload = Pick<Thread, "title" | "author" | "body"> to thread.ts. It describes what a client sends.
Create src/threads/threads.repository.ts with an injectable ThreadsRepository. It holds a Map<string, Thread> filled with the sample threads and offers findAll(), findById(id), and create(payload). create() adds an id from randomUUID() and createdAt: new Date().
Register ThreadsRepository under providers in ThreadsModule.
Let ThreadsService receive the repository through its constructor and use it instead of its own array. Add findById(id), which throws a NotFoundException when the repository returns undefined, and create(payload).
In ThreadsController, add a handler with @Get(":id") and @Param("id"), and one with @Post() and @Body().
Test the POST request with an HTTP client or with curl:

curl -X POST http://localhost:3000/threads -H "Content-Type: application/json" -d '{"title":"Hello","author":"ada","body":"My first thread"}'

Hint
Declare @Get("authors") above @Get(":id"). NestJS checks routes in the order they are declared. Otherwise, GET /threads/authors reaches the :id handler with the ID "authors" and answers with 404.

Comment on Threads
A discussion board without answers is a notice board. Comments get a module of their own, because they have their own data and their own routes.

The type of a comment:

export type Comment = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: Date;
};

Challenge
0/7
Comment on Threads
Acceptance criteria


POST /threads/:id/comments with { "author": "...", "body": "..." } creates a comment for that thread and answers with status 201 and the new comment, including id, threadId, and createdAt

POST /threads/:id/comments for an unknown thread answers with status 404

GET /threads/:id returns the thread with an additional field comments, the array of its comments

GET /comments/:id returns a single comment, or 404 for an unknown ID
Technical requirements


A CommentsModule with CommentsController, CommentsService, and a CommentsRepository that stores the comments in a Map<string, Comment>

CommentsModule exports CommentsService, and ThreadsModule imports CommentsModule. ThreadsService uses CommentsService, never CommentsRepository directly.

The Comment type lives in src/comments/comment.ts
Done when
After you post a comment to a thread, GET /threads/<id> shows it in comments, and GET /comments/<comment id> returns it.

Step by step
Generate the comments module, service, and controller with the CLI, and create src/comments/comment.ts with the type above and a CommentPayload = Pick<Comment, "author" | "body">.
Build CommentsRepository like ThreadsRepository, starting with an empty map. It offers findById(id), findByThread(threadId), and create(threadId, payload).
CommentsService uses the repository. Its findById(id) throws a NotFoundException for an unknown ID.
Add CommentsService to the exports of CommentsModule, and CommentsModule to the imports of ThreadsModule.
ThreadsService receives CommentsService as a second constructor parameter. addComment(threadId, payload) first checks with findById that the thread exists, then lets CommentsService create the comment. findById returns the thread together with comments: this.commentsService.findByThread(id).
ThreadsController gets a handler with @Post(":id/comments"), and CommentsController one with @Get(":id").
Hint
Posting a comment belongs to the threads feature, because its route starts with /threads. That is why only ThreadsModule imports CommentsModule. If both modules import each other, the application stops at startup with “ReferenceError: Cannot access ‘ThreadsModule’ before initialization”.

Delete Threads and Comments
Sometimes a thread was a mistake, and deleting it should remove its comments as well. A single comment is different: if it vanished, the comments after it might no longer make sense. A deleted comment therefore stays in place with the text "deleted".

Challenge
0/4
Delete Threads and Comments
Acceptance criteria


DELETE /threads/:id deletes the thread and all of its comments. Afterwards, GET /threads/:id and GET /comments/:id for its comments answer with 404.

DELETE /comments/:id keeps the comment, replaces its body with "deleted", and answers with the changed comment

Both routes answer with status 404 for an unknown ID
Technical requirements


ThreadsService deletes the comments of a thread through CommentsService
Done when
After DELETE /comments/<id>, GET /threads/<thread id> shows the comment with the body "deleted". After DELETE /threads/<id>, the thread and its comments answer with 404.

Step by step
Add delete(id) to ThreadsRepository, returning whether a thread was removed, and deleteByThread(threadId) to CommentsRepository.
In ThreadsService, remove(id) throws a NotFoundException when the repository reports that nothing was removed. Otherwise, it deletes the comments with this.commentsService.deleteByThread(id).
In CommentsService, markDeleted(id) loads the comment (404 if it is missing), stores a copy with body: "deleted", and returns it.
Add a handler with @Delete(":id") to both controllers.
Hint
Map.prototype.delete() returns true if the key existed and false otherwise.

Bonus: Edit a Thread
Typos happen. Authors want to fix the title or the text of a thread without deleting it.

Challenge
0/4
Edit a Thread
Acceptance criteria


PATCH /threads/:id with title, body, or both changes only the fields that were sent and answers with the updated thread

author, id, and createdAt never change, even if the request body contains them

An unknown ID answers with status 404
Technical requirements


The repository gets an update(id, changes) method
Done when
After PATCH /threads/<id> with { "title": "Fixed" }, GET /threads/<id> shows the new title and the old body.

Hint
Copy only title and body from the request body into the changes, and only if they are present. Spreading the whole request body into the thread would let clients overwrite author.

Bonus: Comment Counts
The thread list should show how lively each discussion is.

Challenge
0/3
Comment Counts
Acceptance criteria


Every thread in GET /threads has a field commentCount with the number of its comments

Threads without comments show 0
Technical requirements


ThreadsService gets the numbers through CommentsService
Done when
After two comments on one thread, GET /threads shows "commentCount": 2 for that thread and 0 for the others.