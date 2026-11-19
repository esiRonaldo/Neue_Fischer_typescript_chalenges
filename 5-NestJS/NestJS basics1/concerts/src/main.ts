import { Controller, Get, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


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
  constructor(private readonly concertsService: ConcertsService) { }

  @Get('concerts')
  findAll() {
    return this.concertsService.findAll()
  }
}


@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
class AppModule { }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
