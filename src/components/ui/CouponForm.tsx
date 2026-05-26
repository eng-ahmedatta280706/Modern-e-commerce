import React, { useState } from "react";

interface Coupon {
    code: string;
    type: "percentage" | "fixed" | "shipping";
    value?: number;
}

interface CouponFormProps {
    onApply: (coupon: Coupon | null) => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ onApply }) => {
    const [couponCode, setCouponCode] = useState("");
    const [message, setMessage] = useState("");

    const applyCoupon = () => {
        let coupon: Coupon | null = null;

        if (couponCode === "SAVE10") {
            coupon = { code: "SAVE10", type: "percentage", value: 10 };
        } else if (couponCode === "DISCOUNT50") {
            coupon = { code: "DISCOUNT50", type: "fixed", value: 50 };
        } else if (couponCode === "FREESHIP") {
            coupon = { code: "FREESHIP", type: "shipping" };
        }

        if (coupon) {
            setMessage("✅ Coupon applied successfully!");
            onApply(coupon);
        } else {
            setMessage("❌ Invalid coupon code");
            onApply(null);
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Coupon Code</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded-lg px-4 py-2"
                />
                <button
                    onClick={applyCoupon}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Apply
                </button>
            </div>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};

export default CouponForm;