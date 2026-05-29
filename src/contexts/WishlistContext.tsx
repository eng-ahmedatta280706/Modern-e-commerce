import React, { createContext, useState, useEffect } from "react";
// import { localProducts } from "../data/products";
import { Product } from "../types/Product";

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>(() => {
        const stored = localStorage.getItem("wishlist");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find((p) => p.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((p) => p.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlist.some((p) => p.id === id);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };
    
    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
    };

    return (
        <WishlistContext.Provider
            value={value}
        >
            {children}
        </WishlistContext.Provider>
    );
};
