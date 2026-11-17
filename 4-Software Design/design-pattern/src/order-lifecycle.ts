type OrderState =
    | "Draft"
    | "AwaitingPayment"
    | "Paid"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

type OrderEvent =
    | "checkout"
    | "payment_received"
    | "dispatch"
    | "confirm_delivery"
    | "cancel";

const transitions: Record<OrderState, Partial<Record<OrderEvent, OrderState>>> = {
    Draft: { checkout: "AwaitingPayment", cancel: "Cancelled" },
    AwaitingPayment: { payment_received: "Paid", cancel: "Cancelled" },
    Paid: { dispatch: "Shipped", cancel: "Cancelled" },
    Shipped: { confirm_delivery: "Delivered" },
    Delivered: {},
    Cancelled: {},
};

// State machine
class Order {
    #state: OrderState = "Draft";

    get state(): OrderState {
        return this.#state;
    }
 
    transition(event: OrderEvent): void {
        const next = transitions[this.#state][event];

        if (next === undefined) {
            throw new Error(`Cannot ${event} an order in state ${this.#state}`);
        }

        console.log(`${event}: ${this.#state} → ${next}`);
        this.#state = next;
    }

        checkout(): void {
        this.transition("checkout");
    }

    receivePayment(): void {
        this.transition("payment_received");
    }

    dispatch(): void {
        this.transition("dispatch");
    }

    confirmDelivery(): void {
        this.transition("confirm_delivery");
    }

    cancel(): void {
        this.transition("cancel");
    }

}
// 1. Draft → Delivered
const order = new Order();
console.log('order');
console.log(typeof(order));
console.log(order);
console.log('----------');
console.log(order.state);
order.checkout();
console.log(order.state);
order.receivePayment();
console.log(order.state);
order.dispatch();
console.log(order.state);
order.confirmDelivery();
console.log(order.state);

// 2. Cancel after payment
const cancelledOrder = new Order();
cancelledOrder.checkout();
cancelledOrder.receivePayment();
cancelledOrder.cancel();
console.log(cancelledOrder.state);

// 3. Dispatch an unpaid order → error
const unpaidOrder = new Order();
unpaidOrder.checkout();
try {
    unpaidOrder.dispatch();
} catch (error) {
    console.log(error instanceof Error ? error.message : error);
}
