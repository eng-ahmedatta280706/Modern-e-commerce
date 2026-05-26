// types/CartItem.ts

export interface CartItem {
    selectedColor: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    description?: string;
}