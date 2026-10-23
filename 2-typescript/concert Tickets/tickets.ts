type TicketTier = "standing" | "seated" | "vip";
type Seat = [string, number];

interface Ticket {
    readonly id: number,
    tier: TicketTier,
    seat?: Seat
};

type VipTicket = Ticket & { loungeAccess: boolean };

const ticketPrice = (tier: TicketTier): number => {
    switch (tier) {
        case "standing":
            return 50
        case "seated":
            return 100;
        case "vip":
            return 200;
    }
}

const describeSeat = (seat: Seat): string => {
    const [row, number] = seat
    return `Row ${row}, seat ${number}`;
}

const parseQuantity = (input: unknown): number => {
    return typeof input === "number" ? input : 0
}

const standingTicket: Ticket = { id: 1, tier: "standing" }
const seatedTicket: Ticket = { id: 2, tier: "seated", seat: ["C", 12] };
const vipTicket: VipTicket = { id: 3, tier: "vip", seat: ["A", 1], loungeAccess: true };

const tickets: Ticket[] = [standingTicket, seatedTicket, vipTicket]

for (let ticket of tickets) {
    console.log(`Ticket ${ticket.id} ${ticket.tier} : ${ticketPrice(ticket.tier)}`)

    if (ticket.seat) console.log(describeSeat(ticket.seat))
}
console.log(parseQuantity(78))
console.log(parseQuantity('78'))
console.log(parseQuantity(JSON.parse('3')))