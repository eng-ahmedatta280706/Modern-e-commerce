import React from "react";

interface DeliveryOptionsProps {
    shippingMethod: string;
    onChange: (method: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ shippingMethod, onChange }) => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Options</h3>
            <select
                value={shippingMethod}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
            >
                <option value="standard">Standard Shipping (3-5 days) - $5</option>
                <option value="express">Express Shipping (1-2 days) - $15</option>
                <option value="pickup">Store Pickup (Free)</option>
            </select>
        </div>
    );
};

export default DeliveryOptions;