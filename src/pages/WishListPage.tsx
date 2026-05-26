import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext.tsx";
import ProductCard from "../components/ui/ProductCard";

const WishlistPage: React.FC = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Heart size={64} className="mx-auto text-gray-300 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Browse our products and add your favorites to the wishlist.
                </p>
                <Link
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold">My Wishlist</h1>
                <span className="text-gray-600 text-lg">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </span>
            </div>

            {/* Wishlist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                {wishlist.map((product) => (
                    <div key={product.id} className="relative group">
                        <ProductCard product={product} isWishlist={true} />

                        {/* Remove button */}
                        <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                            title="Remove from wishlist"
                        >
                            <Trash2 size={22} className="text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;