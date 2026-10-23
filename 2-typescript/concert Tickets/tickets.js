"use strict";
;
const ticketPrice = (tier) => {
    switch (tier) {
        case "standing":
            return 50;
        case "seated":
            return 100;
        case "vip":
            return 200;
    }
};
const describeSeat = (seat) => {
    const [row, number] = seat;
    return `Row ${row}, seat ${number}`;
};
const parseQuantity = (input) => {
    return typeof input === "number" ? input : 0;
};
const standingTicket = { id: 1, tier: "standing" };
const seatedTicket = { id: 2, tier: "seated", seat: ["C", 12] };
const vipTicket = { id: 3, tier: "vip", seat: ["A", 1], loungeAccess: true };
const tickets = [standingTicket, seatedTicket, vipTicket];
for (let ticket of tickets) {
    console.log(`Ticket ${ticket.id} ${ticket.tier} : ${ticketPrice(ticket.tier)}`);
    if (ticket.seat)
        console.log(describeSeat(ticket.seat));
}
console.log(parseQuantity(78));
console.log(parseQuantity('78'));
console.log(parseQuantity(JSON.parse('3')));
