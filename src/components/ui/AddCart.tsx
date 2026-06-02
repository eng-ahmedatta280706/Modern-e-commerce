import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types/Product';


interface AddCartProps {
    product: Product;
    color: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AddCart: React.FC<AddCartProps> = ({ product, color, onClick }) => {
    const { addToCart } = useCart();
    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, color);
    };

    return (
        <button
            type="button"
            onClick={onClick || handleAddToCart}
            className="addCart-btn flex items-center text-white rounded-full transition-colors">
            <ShoppingCart size={16} className='ShoppingCart' />
            <span className="text-sm">Add to Cart</span>
        </button>
    );
};

export default AddCart;