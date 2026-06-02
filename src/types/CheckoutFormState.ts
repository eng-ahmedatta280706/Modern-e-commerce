type CheckoutFormState = {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    paymentMethod: "card" | "paypal" | "cod";
    cardNumber: string;
    cardExpiry: string;
    cardCVC: string;
    paypalEmail: string;
    paypalName: string;
    paypalPhone: string;
    paypalNotes: string;
};

export default CheckoutFormState;