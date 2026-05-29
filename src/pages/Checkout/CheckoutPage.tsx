import React, { useState, useContext } from "react";
import CardPaymentForm from "../../components/forms/CardPaymentForm";
import PaypalPaymentForm from "../../components/payment/PaypalPaymentForm";
import ReviewOrder from "../../components/payment/ReviewOrder";
import { CartContext } from "../../contexts/CartContext";
import Swal from "sweetalert2";

const CheckoutWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const cartContext = useContext(CartContext);
    if (!cartContext) {
        throw new Error("CheckoutWizard must be used within a CartProvider");
    }

    const { cartItems, subtotal, updateQuantity, removeFromCart } = cartContext;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        country: "",
        paymentMethod: "card",
        cardNumber: "",
        cardExpiry: "",
        cardCVC: "",
        paypalEmail: "",
        paypalName: "",
        paypalPhone: "",
        paypalNotes: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const changeStep = (newStep: number) => {
        setAnimating(true);
        setTimeout(() => {
            setStep(newStep);
            setAnimating(false);
        }, 300);
    };

    const handleSubmit = () => {
        if (selectedItems.length > 0) {
            selectedItems.forEach((id) => {
                const item = cartItems.find((i) => String(i.id) === id);
                if (item) {
                    removeFromCart(item.id, item.selectedColor);
                }
            });
            Swal.fire({
                title: "Order Successful!",
                text: `You have paid for ${selectedItems.length} item(s).`,
                icon: "success",
                confirmButtonText: "OK",
            });
            setSelectedItems([]);
        } else {
            Swal.fire({
                title: "No Items Selected",
                text: "⚠️ Please select at least one item to pay for.",
                icon: "warning",
                confirmButtonText: "OK",
            });
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div
                className={`max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg ${animating ? "fade-out" : "fade-in"
                    }`}>
                {/* Step 1: Customer Info */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Step 1: Customer Info</h2>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                            <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                        </div>
                        <button onClick={() => changeStep(2)} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            Next
                        </button>
                    </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Step 2: Payment Method</h2>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 mb-6"
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>

                        {formData.paymentMethod === "card" && (
                            <CardPaymentForm
                                cardNumber={formData.cardNumber}
                                cardExpiry={formData.cardExpiry}
                                cardCVC={formData.cardCVC}
                                onChange={handleChange}
                            />
                        )}

                        {formData.paymentMethod === "paypal" && (
                            <PaypalPaymentForm
                                paypalEmail={formData.paypalEmail}
                                paypalName={formData.paypalName}
                                paypalPhone={formData.paypalPhone}
                                paypalNotes={formData.paypalNotes}
                                onChange={handleChange}
                            />
                        )}

                        <div className="flex justify-between mt-6">
                            <button onClick={() => changeStep(1)} className="border px-6 py-3 rounded-lg hover:bg-gray-100">
                                Back
                            </button>
                            <button onClick={() => changeStep(3)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review Order */}
                {step === 3 && (
                    <ReviewOrder
                        onBack={() => changeStep(2)}
                        onSubmit={handleSubmit}
                        onSelectItems={setSelectedItems}
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutWizard;