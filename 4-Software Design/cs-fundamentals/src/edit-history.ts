export class EditHistory {
    #current: string;
    #back: string[] = [];
    #forward: string[] = [];

    constructor(initialValue: string) {
        this.#current = initialValue;
    }

    record(value: string): void {
        this.#back.push(this.#current);
        this.#current = value;
        this.#forward = [];
    }

    undo(): void {
        const previous = this.#back.pop();
        if (previous === undefined) return;

        this.#forward.push(this.#current);
        this.#current = previous;
    }

    redo(): void {
        const next = this.#forward.pop();
        if (next === undefined) return;

        this.#back.push(this.#current);
        this.#current = next;
    }

    get current(): string {
        return this.#current;
    }

    get canUndo(): boolean {
        return this.#back.length > 0;
    }

    get canRedo(): boolean {
        return this.#forward.length > 0;
    }


}

