import React, { useState } from "react";
import { CartItem } from "../types/CartItem";

interface CartItemModalProps {
    item: CartItem;
    onClose: () => void;
    onUpdateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
    onRemove: (productId: string, selectedColor: string) => void;
}

const CartItemModal: React.FC<CartItemModalProps> = ({ item, onClose, onUpdateQuantity, onRemove }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleSave = () => {
        onUpdateQuantity(item.id, item.selectedColor, quantity);
        onClose();
    };

    const handleDelete = () => {
        onRemove(item.id, item.selectedColor);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            {/* Sidebar */}
            <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 transform transition-transform duration-300">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Edit Item</h2>

                    {item.image && (
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mb-4 mx-auto" />
                    )}

                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 mb-4">${item.price.toFixed(2)} each</p>

                    {/* تعديل الكمية */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                            -
                        </button>
                        <span className="px-4">{quantity}</span>
                        <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                            +
                        </button>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemModal;