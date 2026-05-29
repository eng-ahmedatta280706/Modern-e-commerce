import React, { createContext, useContext, useState, useEffect , useMemo} from "react";
// import { localProducts } from "../data/products";
import { Product } from "../types/Product";

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

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
    
    const value = useMemo(() => ({
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
    }), [wishlist]);

    return (
        <WishlistContext.Provider
            value={value}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};