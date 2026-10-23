import { formatOrder, isInStock } from "./shop.js";
import type { Product, Order } from "./types.js";

const lamp: Product = { id: 1, name: 'Lamp', price: 1000, stock: 2, category: { name: 'electricity' } };
const mug: Product = { id: 2, name: 'Mug', price: 12.5, stock: 0, category: { name: 'kitchen' } };

const order: Order = {
    id: 1,
    customer: { id: 1, name: 'Ali', email: 'asd@asd.com' },
    items: [
        { product: lamp, quantity: 1 },
        { product: mug, quantity: 2 },
    ],
    status: 'pending',
};

console.log(formatOrder(order));

for (const product of [lamp, mug]) {
    console.log(`${product.name} in stock: ${isInStock(product)}`);
}
