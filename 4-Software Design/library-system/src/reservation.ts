type ReservationStatus = "reserved" | "returned" | "cancelled";

class BookReservation {
    memberId: string;
    bookTitle: string;
    #status: ReservationStatus = "reserved";

    constructor(memberId: string, bookTitle: string) {
        this.memberId = memberId;
        this.bookTitle = bookTitle;
    }

    get status(): ReservationStatus {
        return this.#status;
    }

    markReturned(): void {
        this.#ensureReserved();
        this.#status = "returned";
    }

    cancel(): void {
        this.#ensureReserved();
        this.#status = "cancelled";
    }

    #ensureReserved(): void {
        if (this.#status !== "reserved") {
            throw new Error(
                `Cannot change reservation: status is already "${this.#status}"`,
            );
        }
    }
}

const reservation = new BookReservation("42", "Dune");
console.log(reservation.status);

reservation.markReturned();
console.log(reservation.status);

try {
    reservation.cancel();
} catch (error) {
    console.log(error instanceof Error ? error.message : error);
}
