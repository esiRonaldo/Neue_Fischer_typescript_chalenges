interface Creature {
    name: string;
    useAbility(): void;
}

class Dragon implements Creature {
    name = "Dragon";

    useAbility(): void {
        console.log(`${this.name} breathes fire`);
    }
}

class Phoenix implements Creature {
    name = "Phoenix";

    useAbility(): void {
        console.log(`${this.name} is reborn from its ashes`);
    }
}

class Unicorn implements Creature {
    name = "Unicorn";

    useAbility(): void {
        console.log(`${this.name} dances on a rainbow`);
    }
}

// Factory
class SummoningCircle {
    summon(ingredient: string): Creature {
        switch (ingredient) {
            case "fire":
                return new Dragon();
            case "air":
                return new Phoenix();
            case "sparkles":
                return new Unicorn();
            default:
                throw new Error(`Unknown ingredient: ${ingredient}`);

        }
    }
}

const circle = new SummoningCircle();

for (const ingredient of ["fire", "air", "sparkles"]) {
    const creature = circle.summon(ingredient);
    creature.useAbility();
}

try {
    circle.summon("water");
} catch (error) {
    console.log(error instanceof Error ? error.message : error);
}
