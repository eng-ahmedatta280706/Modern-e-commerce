import React, { useState, useContext, useMemo } from "react";
import CardPaymentForm from "../../components/forms/CardPaymentForm";
import PaypalPaymentForm from "../../components/payment/PaypalPaymentForm";
import ReviewOrder from "../../components/payment/ReviewOrder";
import { CartContext } from "../../contexts/CartContext";
import Swal from "sweetalert2";
import { validateCardPayment, validateCheckoutStep1 } from "../../utils/validation";
import { orderService } from "../../services/orderService";
import CheckoutFormState from "../../types/CheckoutFormState";
import { useNavigate } from "react-router-dom";

interface CheckoutCoupon {
    code: string;
    type: "percentage" | "fixed" | "shipping";
    value?: number;
}

const CheckoutWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    // const [animating, setAnimating] = useState(false);
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [appliedCoupon, setAppliedCoupon] = useState<CheckoutCoupon | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const cartContext = useContext(CartContext);

    if (!cartContext) {
        throw new Error("CheckoutWizard must be used within a CartProvider");
    }

    const {
        cartItems,
        // subtotal,
        clearCart,
    } = cartContext;

    const SHIPPING_COSTS: Record<string, number> = {
        standard: 5,
        express: 15,
        pickup: 0,
    };

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

    const steps = ["Shipping", "Payment", "Review"];

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const changeStep = (newStep: number) => {
        setStep(newStep);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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

    // const handleSubmit = () => {
    //     if (selectedItems.length > 0) {
    //         selectedItems.forEach((id) => {
    //             const item = cartItems.find(
    //                 (i) => String(i.id) === id
    //             );

    //             if (item) {
    //                 removeFromCart(
    //                     item.id,
    //                     item.selectedColor
    //                 );
    //             }
    //         });

    //         Swal.fire({
    //             title: "Order Successful!",
    //             text: `You have paid for ${selectedItems.length} item(s).`,
    //             icon: "success",
    //             confirmButtonText: "OK",
    //         });

    //         setSelectedItems([]);
    //     } else {
    //         Swal.fire({
    //             title: "No Items Selected",
    //             text: "Please select at least one item.",
    //             icon: "warning",
    //             confirmButtonText: "OK",
    //         });
    //     }
    // };

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

    // const shippingCost = 5;
    // const taxes = subtotal * 0.1;
    // const total = subtotal + shippingCost + taxes;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-8">
                        Checkout
                    </h1>

                    {/* Stepper */}
                    <div className="flex items-center justify-center">
                        {steps.map((label, index) => (
                            <div
                                key={label}
                                className="flex items-center"
                            >
                                <div
                                    className={`
                                        w-10 h-10 rounded-full
                                        flex items-center justify-center
                                        font-semibold
                                        transition-all
                                        ${step >= index + 1
                                            ? "bg-black text-white"
                                            : "bg-gray-300 text-gray-600"}
                                    `}
                                >
                                    {index + 1}
                                </div>

                                <span className="mx-3 font-medium">
                                    {label}
                                </span>

                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            w-20 h-1 rounded
                                            ${step > index + 1
                                                ? "bg-black"
                                                : "bg-gray-300"}
                                        `}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Layout */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Content */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-bold mb-6">
                                    Shipping Information
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="border rounded-lg px-4 py-3"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="border rounded-lg px-4 py-3"
                                    />

                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="border rounded-lg px-4 py-3"
                                    />

                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <textarea
                                    name="address"
                                    placeholder="Street Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border rounded-lg px-4 py-3 w-full mt-4"
                                    rows={4}
                                />

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => changeStep(2)}
                                        className="bg-black text-white px-6 py-3 rounded-lg"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <>
                                <h2 className="text-2xl font-bold mb-6">
                                    Payment Method
                                </h2>

                                <div className="grid md:grid-cols-3 gap-4 mb-8">

                                    <button
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                paymentMethod: "card",
                                            })
                                        }
                                        className={`border rounded-xl p-4 text-left ${formData.paymentMethod === "card"
                                            ? "border-black"
                                            : ""
                                            }`}
                                    >
                                        Credit Card
                                    </button>

                                    <button
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                paymentMethod: "paypal",
                                            })
                                        }
                                        className={`border rounded-xl p-4 text-left ${formData.paymentMethod === "paypal"
                                            ? "border-black"
                                            : ""
                                            }`}
                                    >
                                        PayPal
                                    </button>

                                    <button
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                paymentMethod: "cod",
                                            })
                                        }
                                        className={`border rounded-xl p-4 text-left ${formData.paymentMethod === "cod"
                                            ? "border-black"
                                            : ""
                                            }`}
                                    >
                                        Cash On Delivery
                                    </button>
                                </div>

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
                                    <button
                                        onClick={() => changeStep(1)}
                                        className="border px-6 py-3 rounded-lg"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={() => changeStep(3)}
                                        className="bg-black text-white px-6 py-3 rounded-lg"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <ReviewOrder
                                onBack={() => changeStep(2)}
                                onSubmit={processOrder}
                                onSelectItems={setSelectedItems}
                                shippingMethod={shippingMethod}
                                onShippingMethodChange={setShippingMethod}
                                appliedCoupon={appliedCoupon}
                                onCouponChange={setAppliedCoupon}
                            />
                        )}
                    </div>

                    {/* Right Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
                        <h3 className="text-xl font-bold mb-6">
                            Order Summary
                        </h3>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.id}-${item.selectedColor}`}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.name} × {item.quantity}
                                    </span>

                                    <span>
                                        $
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutWizard;