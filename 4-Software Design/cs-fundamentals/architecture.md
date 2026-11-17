# Architecture decisions

| Product            | Deployment                         | Code organization                 |
| ------------------ | ---------------------------------- | --------------------------------- |
| Bakery orders      | Monolith                           | Layered                           |
| Concert tickets    | Monolith + serverless for the sale | Feature modules                   |
| Online marketplace | Microservices                      | Layered inside each service       |

## Bakery orders

**Product:** A bakery with four shops takes pre-orders online. Two developers build and run the system. There are about 200 orders a day, spread evenly over the day. Every night at 2:00, each shop gets a list of the next day's orders.

### Scale 1: Deployment → Monolith

One app, one database, plus one scheduled job at 2:00 that creates the order lists.

- Only two developers build and run the system, so one deployable is all they can comfortably operate.
- About 200 orders a day, spread evenly, is very little load. One server handles it easily.
- The nightly list is a simple scheduled job inside the same app.

**Trade-off:** Everything is deployed together. A bug in one part (for example the nightly job) can take down the whole app, including the order page.

**Rethink when:** The bakery grows to hundreds of shops or orders arrive in big peaks (for example before holidays), so one server is no longer enough.

### Scale 2: Code organization → Layered

Routes → controllers → services → data access. The domain is small (orders, shops, products), so layers are enough.

**Trade-off:** One feature is spread over all layers, so a change like "add a pickup time to orders" touches several folders.

**Rethink when:** The team grows or new areas are added (payments, delivery, loyalty points). Then feature modules keep the areas apart.

## Concert tickets

**Product:** A ticket platform is quiet most of the time. When a big concert goes on sale, traffic grows a hundredfold within minutes and stays there for about an hour. Five developers work on it.

### Scale 1: Deployment → Combination (monolith + serverless)

A monolith for the quiet parts (event pages, accounts, admin) and serverless functions with a queue for the ticket sale.

- Traffic grows a hundredfold within minutes. Serverless scales up automatically and fast.
- The peak lasts only about an hour and the platform is quiet most of the time, so paying per request is cheaper than running big servers all the time.
- Five developers are too few to run many microservices.

**Trade-off:** Two ways of deploying and debugging. The sale is harder to test locally, and functions can start slowly (cold starts) right when the sale begins.

**Rethink when:** Traffic becomes high all the time (big sales every day). Then paying per request gets expensive, and servers that run all the time are cheaper.

### Scale 2: Code organization → Feature modules

Modules for events, sale, payment, and accounts, each with its own layers. The sale module has a clear boundary, so it can be deployed separately.

**Trade-off:** The boundaries need discipline. Shared code (for example the ticket type) must live in one place, and modules may not reach into each other's data.

**Rethink when:** The team shrinks to one or two developers, or the product is reduced to the sale only. Then simple layers are enough.

## Online marketplace

**Product:** Eight teams of six developers each work on search, product pages, checkout, recommendations, and tools for sellers. Checkout must keep working when recommendations fail. Each team wants to release several times a day without waiting for the others.

### Scale 1: Deployment → Microservices

One service per area: search, product pages, checkout, recommendations, seller tools. Each service has its own database.

- Eight teams of six developers: each team owns its service(s).
- Checkout must keep working when recommendations fail. Separate services isolate the failure.
- Each team wants to release several times a day without waiting. Independent deployments make that possible.

**Trade-off:** Much more operations work: network calls between services can fail, data is spread over several databases, and a bug that crosses services is hard to trace.

**Rethink when:** The company shrinks to one or two teams. Then running many services costs more than it gives, and a monolith with feature modules fits better.

### Scale 2: Code organization → Layered inside each service

Each service is small and covers one area, so layers are enough. Services talk through APIs and events, never through another service's database.

**Trade-off:** The same basics (logging, auth, error handling) are repeated in every service, and teams may solve them in different ways.

**Rethink when:** One service grows large and covers several areas (for example checkout also gets payments, invoices, and refunds). Then it needs feature modules inside, or it is split into more services.
