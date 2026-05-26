import React, { useState, useContext, useRef, useEffect, ReactNode } from "react";
import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";
import { Link, Navigate } from "react-router-dom";

const defaultUser = {
    id: "guest",
    name: "Guest User",
    username: "guest123",
    email: "guest@example.com",
    profilePic: "https://i.postimg.cc/MZ31Q10k/avatar.jpg",
    ordersCount: 0,
};

const ProfileMenu: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const cartContext = useContext(CartContext);
    const userContext = useContext(UserContext);

    if (!cartContext) throw new Error("ProfileMenu must be used within CartProvider");

    const user = defaultUser;
    if (userContext) {
        if (userContext.user) {
            Object.assign(user, userContext.user);
        } else {
            console.warn("No user data found in UserContext, using default guest user.");
        }
    } else {
        console.warn("UserContext not available, using default guest user.");
        // return <Navigate to="/" replace />;
    }
    const deleteUser = userContext?.deleteUser || (() => console.log("deleteUser not available"));
    const { cartItems = [], subtotal = 0, clearCart = () => { } } = cartContext;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout",
            // allowOutsideClick: true,
            allowEscapeKey: true,
            backdrop: false,
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
                Swal.fire({
                    title: "Logged Out",
                    text: "You have been logged out successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                    backdrop: false,
                }).then(() => {
                    deleteUser();
                });
            }
        });
    };

    return (
        <div className="relative" ref={menuRef}>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {children}
            </div>

            <div
                className={`absolute -right-20 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transition 
                    ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border"
                    />
                    <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                </div>

                <ul className="space-y-2 text-sm">
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                        <Link to="/account" title="Your Account">Settings</Link>
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Passwords & Autofill</li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Sync: On</li>
                </ul>

                <hr className="my-3" />

                <div className="text-sm mb-3">
                    <p className="font-semibold">🛒 Cart Summary</p>
                    <p>{cartItems.length} items – ${subtotal.toFixed(2)}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                    🔒 Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileMenu;