import React from "react";

interface PaypalPaymentFormProps {
    paypalEmail: string;
    paypalName: string;
    paypalPhone: string;
    paypalNotes: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PaypalPaymentForm: React.FC<PaypalPaymentFormProps> = ({
    paypalEmail,
    paypalName,
    paypalPhone,
    paypalNotes,
    onChange,
}) => {
    return (
        <div className="space-y-4 mb-6">
            <input
                type="email"
                name="paypalEmail"
                placeholder="PayPal Email"
                value={paypalEmail}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                required
            />
            <input
                type="text"
                name="paypalName"
                placeholder="Account Holder Name"
                value={paypalName}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                required
            />
            <input
                type="tel"
                name="paypalPhone"
                placeholder="Phone Number (optional)"
                value={paypalPhone}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
            />
            <textarea
                name="paypalNotes"
                placeholder="Additional notes or instructions"
                value={paypalNotes}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
            />
        </div>
    );
};

export default PaypalPaymentForm;