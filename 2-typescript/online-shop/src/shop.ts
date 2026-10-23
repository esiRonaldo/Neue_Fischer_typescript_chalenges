import type { Order, Product } from "./types.js"

export const orderTotal = (order: Order): number => {
    let total = 0
    for (const item of order.items) {
        total += item.product.price * item.quantity
    }
    return total
}

export const formatOrder = (order: Order): string => {
    const items = order.items.map((item) => `${item.quantity} × ${item.product.name}`).join(", ")
    return `Order #${order.id} for ${order.customer.name} (${order.status}): ${items} — Total: €${orderTotal(order).toFixed(2)}`
}


export const isInStock = (product: Product): boolean => {
    return product.stock > 0
}
