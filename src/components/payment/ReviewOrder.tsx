import React, { useState, useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { CartItem } from "../../types/CartItem";
import CartItemModal from "../modals/CartItemModal";
import CouponForm from "../forms/CouponForm";
import DeliveryOptions from "./DeliveryOptions";

interface ReviewOrderProps {
    onBack: () => void;
    onSubmit: () => void;
    onSelectItems: (itemIds: string[]) => void;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({ onBack, onSubmit, onSelectItems }) => {
    const cartContext = useContext(CartContext);
    if (!cartContext) throw new Error("ReviewOrder must be used within CartProvider");

    const { cartItems, subtotal, updateQuantity, removeFromCart } = cartContext;

    const [shippingMethod, setShippingMethod] = useState("standard");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);

    const shippingCost = shippingMethod === "express" ? 15 : shippingMethod === "pickup" ? 0 : 5;
    const taxes = subtotal * 0.1;

    let discount = 0;
    if (appliedCoupon && selectedItems.length > 0) {
        // نحسب الخصم على أول عنصر مختار فقط (يمكنك تعديل المنطق لو أردت تطبيقه على الكل)
        const item = cartItems.find((i) => String(i.id) === selectedItems[0]);
        if (item) {
            if (appliedCoupon.type === "percentage" && appliedCoupon.value) {
                discount = (item.price * item.quantity * appliedCoupon.value) / 100;
            } else if (appliedCoupon.type === "fixed" && appliedCoupon.value) {
                discount = Math.min(item.price * item.quantity, appliedCoupon.value);
            } else if (appliedCoupon.type === "shipping") {
                discount = shippingCost;
            }
        }
    }

    const total = subtotal + shippingCost + taxes - discount;

    // دالة لتبديل اختيار العناصر
    const toggleSelectItem = (itemId: string) => {
        setSelectedItems((prev) => {
            const newSelection = prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId];
            onSelectItems(newSelection);
            return newSelection;
        });
    };

    return (
        <div className="fade-in">
            <h2 className="text-2xl font-bold mb-6">Step 3: Review Order</h2>

            {/* قائمة المنتجات */}
            <ul className="divide-y mb-6">
                {cartItems.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div>
                                <span className="font-medium">{item.name}</span> (x{item.quantity})
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                                onClick={() => setEditingItem(item)}
                                className="px-3 py-1 rounded-lg text-sm bg-yellow-200"
                            >
                                Edit
                            </button>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(String(item.id))}
                                onChange={() => toggleSelectItem(String(item.id))}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            {/* خيارات الشحن */}
            <DeliveryOptions shippingMethod={shippingMethod} onChange={setShippingMethod} />

            {/* إدخال الكوبون */}
            <CouponForm onApply={setAppliedCoupon} />

            {/* تفاصيل التكلفة */}
            <div className="space-y-2 mb-6 text-sm text-gray-600">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Shipping: ${shippingCost.toFixed(2)}</p>
                <p>Taxes (10%): ${taxes.toFixed(2)}</p>
                {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
            </div>

            <p className="text-xl font-bold mb-6">Total: ${total.toFixed(2)}</p>

            <div className="flex justify-between">
                <button onClick={onBack} className="border px-6 py-3 rounded-lg hover:bg-gray-100">
                    Back
                </button>
                <button onClick={onSubmit} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                    Place Order
                </button>
            </div>

            {/* نافذة تعديل المنتج */}
            {editingItem && (
                <CartItemModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                />
            )}
        </div>
    );
};

export default ReviewOrder;