export type Status = 'pending' | 'confirmed' | 'shipped'

export interface Product {
    readonly id: number
    name: string
    price: number
    stock: number
    category: Category
}

export interface Category {
    name: string
    description?: string
}

export interface Customer {
    readonly id: number
    name: string
    email: string
}

export interface Order {
    readonly id: number
    customer: Customer
    items: LineItem[]
    status: Status
}

export interface LineItem {
    product: Product
    quantity: number
}