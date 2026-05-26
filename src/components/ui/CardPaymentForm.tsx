import React from "react";

interface CardPaymentFormProps {
    cardNumber: string;
    cardExpiry: string;
    cardCVC: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
    cardNumber,
    cardExpiry,
    cardCVC,
    onChange,
}) => {
    return (
        <div className="space-y-4 mb-6">
            <input
                type="text"
                name="cardNumber"
                placeholder="Card Number (16 digits)"
                value={cardNumber}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                pattern="\d{16}"
                required
            />
            <input
                type="text"
                name="cardExpiry"
                placeholder="Expiry Date (MM/YY)"
                value={cardExpiry}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                required
            />
            <input
                type="text"
                name="cardCVC"
                placeholder="CVC (3 digits)"
                value={cardCVC}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-2"
                pattern="\d{3}"
                required
            />
        </div>
    );
};

export default CardPaymentForm;