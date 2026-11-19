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