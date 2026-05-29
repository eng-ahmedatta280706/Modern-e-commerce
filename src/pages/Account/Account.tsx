import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

interface User {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
}

const UserAccount: React.FC = () => {
    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("UserAccount must be used within CartProvider");

    const { cartItems, subtotal, clearCart } = cartContext;

    // بيانات المستخدم (ممكن تجيبها من Context أو API)
    const user: User = {
        name: "Ahmed Ali",
        email: "ahmed@example.com",
        address: "123 Street",
        city: "Asyut",
        country: "Egypt",
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">👤 My Account</h2>

            {/* بيانات المستخدم */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}, {user.city}, {user.country}</p>
            </div>

            {/* السلة الحالية */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">🛒 Current Cart</h3>
                {cartItems.length > 0 ? (
                    <ul className="divide-y">
                        {cartItems.map((item) => (
                            <li key={item.id} className="py-2 flex justify-between">
                                <div>
                                    <span className="font-medium">{item.name}</span> (x{item.quantity})
                                    <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Your cart is empty.</p>
                )}
                <p className="mt-2 font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
                {cartItems.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Clear Cart
                    </button>
                )}
            </div>

            {/* الطلبات السابقة (مثال ثابت) */}
            <div>
                <h3 className="text-xl font-semibold mb-2">📦 Previous Orders</h3>
                <ul className="list-disc pl-6 text-gray-700">
                    <li>Order #1234 – 2 items – $45.00 – Delivered</li>
                    <li>Order #5678 – 1 item – $20.00 – Pending</li>
                </ul>
            </div>
        </div>
    );
};

export default UserAccount;