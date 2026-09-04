import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CardPaymentForm from "../../components/forms/CardPaymentForm";
import PaypalPaymentForm from "../../components/payment/PaypalPaymentForm";
import ReviewOrder from "../../components/payment/ReviewOrder";
import { CartContext } from "../../contexts/CartContext";
import { orderService } from "../../services/orderService";
import { validateCardPayment, validateCheckoutStep1 } from "../../utils/validation";
import CheckoutFormState from "../../types/CheckoutFormState";

// type CheckoutFormState = {
//     name: string;
//     email: string;
//     address: string;
//     city: string;
//     country: string;
//     paymentMethod: "card" | "paypal" | "cod";
//     cardNumber: string;
//     cardExpiry: string;
//     cardCVC: string;
//     paypalEmail: string;
//     paypalName: string;
//     paypalPhone: string;
//     paypalNotes: string;
// };

interface CheckoutCoupon {
    code: string;
    type: "percentage" | "fixed" | "shipping";
    value?: number;
}

const SHIPPING_COSTS: Record<string, number> = {
    standard: 5,
    express: 15,
    pickup: 0,
};

const CheckoutWizard: React.FC = () => {
    const navigate = useNavigate();
    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error("CheckoutWizard must be used within a CartProvider");
    }

    const { cartItems, clearCart } = cartContext;

    const [step, setStep] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [appliedCoupon, setAppliedCoupon] = useState<CheckoutCoupon | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const [formData, setFormData] = useState<CheckoutFormState>({
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

    const selectedCartItems = useMemo(
        () => cartItems.filter((item) => selectedItems.includes(String(item.id))),
        [cartItems, selectedItems]
    );

    const subtotal = useMemo(
        () => selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [selectedCartItems]
    );

    const shippingCost = SHIPPING_COSTS[shippingMethod] ?? SHIPPING_COSTS.standard;
    const tax = Number((subtotal * 0.1).toFixed(2));

    const discount = useMemo(() => {
        if (!appliedCoupon || selectedCartItems.length === 0) return 0;
        const discountBase = subtotal;

        if (appliedCoupon.type === 'shipping') {
            return shippingCost;
        }

        if (appliedCoupon.type === 'percentage') {
            return Number(((discountBase * (appliedCoupon.value ?? 0)) / 100).toFixed(2));
        }

        return Math.min(discountBase, appliedCoupon.value ?? 0);
    }, [appliedCoupon, selectedCartItems.length, shippingCost, subtotal]);

    const total = Math.max(0, Number((subtotal + shippingCost + tax - discount).toFixed(2)));

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
    };

    const changeStep = (newStep: number) => {
        setAnimating(true);
        window.setTimeout(() => {
            setStep(newStep);
            setAnimating(false);
        }, 250);
    };

    const validateStep1 = () => {
        const validationErrors = validateCheckoutStep1(formData);
        return validationErrors.map((error) => error.message);
    };

    const validateStep2 = () => {
        const stepErrors: string[] = [];

        if (formData.paymentMethod === 'card') {
            stepErrors.push(...validateCardPayment(formData).map((error) => error.message));
        }

        if (formData.paymentMethod === 'paypal') {
            if (!formData.paypalEmail.trim()) stepErrors.push('PayPal email is required.');
            if (!formData.paypalName.trim()) stepErrors.push('PayPal account holder name is required.');
        }

        return stepErrors;
    };

    const processOrder = async () => {
        setErrors([]);
        setMessage(null);

        if (selectedCartItems.length === 0) {
            setErrors(['Please select at least one item to order.']);
            return;
        }

        const payloadErrors = [...validateStep1(), ...validateStep2()];
        if (payloadErrors.length) {
            setErrors(payloadErrors);
            return;
        }

        setSubmitting(true);
        try {
            if (formData.paymentMethod === 'card') {
                await orderService.createOrder({
                    items: selectedCartItems,
                    shippingMethod: shippingMethod as 'standard' | 'express' | 'pickup',
                    paymentMethod: formData.paymentMethod,
                    couponCode: appliedCoupon?.code,
                    shippingAddress: {
                        name: formData.name,
                        email: formData.email,
                        address: formData.address,
                        city: formData.city,
                        country: formData.country,
                    },
                });

                await Swal.fire({
                    title: 'Payment processed',
                    text: 'Your card payment has been processed successfully.',
                    icon: 'success',
                    confirmButtonText: 'Continue shopping',
                });
            } else {
                await orderService.createOrder({
                    items: selectedCartItems,
                    shippingMethod: shippingMethod as 'standard' | 'express' | 'pickup',
                    paymentMethod: formData.paymentMethod,
                    couponCode: appliedCoupon?.code,
                    shippingAddress: {
                        name: formData.name,
                        email: formData.email,
                        address: formData.address,
                        city: formData.city,
                        country: formData.country,
                    },
                });
            }

            clearCart();
            setSelectedItems([]);
            setAppliedCoupon(null);
            setMessage('Order placed successfully. Redirecting to your orders...');
            navigate('/orders', { replace: true });
        } catch (err: any) {
            console.error('Checkout failed:', err);
            setErrors([err?.response?.data?.message ?? 'Could not place your order. Please try again.']);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
            <div className={`max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg ${animating ? 'opacity-60 scale-[0.99]' : 'opacity-100'}`}>
                {errors.length > 0 && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 space-y-1">
                        {errors.map((error) => <p key={error}>{error}</p>)}
                    </div>
                )}

                {message && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

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
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => changeStep(2)} className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700">
                                Next
                            </button>
                        </div>
                    </div>
                )}

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

                        {formData.paymentMethod === 'card' && (
                            <CardPaymentForm
                                cardNumber={formData.cardNumber}
                                cardExpiry={formData.cardExpiry}
                                cardCVC={formData.cardCVC}
                                onChange={handleChange}
                            />
                        )}

                        {formData.paymentMethod === 'paypal' && (
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
                            <button onClick={() => changeStep(3)} className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700">
                                Review
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <ReviewOrder
                            onBack={() => changeStep(2)}
                            onSubmit={processOrder}
                            onSelectItems={setSelectedItems}
                            shippingMethod={shippingMethod}
                            onShippingMethodChange={setShippingMethod}
                            appliedCoupon={appliedCoupon}
                            onCouponChange={setAppliedCoupon}
                        />

                        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
                            <div className="flex items-center justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
                            <div className="flex items-center justify-between"><span>Shipping</span><span>{shippingCost.toFixed(2)}</span></div>
                            <div className="flex items-center justify-between"><span>Tax</span><span>{tax.toFixed(2)}</span></div>
                            {discount > 0 && <div className="flex items-center justify-between text-green-600"><span>Discount</span><span>-{discount.toFixed(2)}</span></div>}
                            <div className="flex items-center justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900"><span>Total</span><span>{total.toFixed(2)}</span></div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={processOrder}
                                disabled={submitting}
                                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${submitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {submitting ? 'Processing payment...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutWizard;
