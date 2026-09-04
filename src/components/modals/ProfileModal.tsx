import React, { useState, useContext, useRef, useEffect, ReactNode } from "react";
import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import notificationsIcon from "../../images/mail-svgrepo-com.svg";

const defaultUser = {
    id: "guest",
    name: "Guest User",
    username: "guest123",
    email: "guest@example.com",
    profilePic: "https://i.postimg.cc/MZ31Q10k/avatar.jpg",
    ordersCount: 0,
    notificationsCount: 10,
};

const ProfileMenu: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const cartContext = useContext(CartContext);
    const userContext = useContext(UserContext);

    if (!cartContext) throw new Error("ProfileMenu must be used within CartProvider");

    const user = defaultUser;
    // if (userContext) {
    //     if (userContext.user) {
    //         Object.assign(user, defaultUser, userContext.user);
    //     } else {
    //         console.warn("No user data found in UserContext, using default guest user.");
    //     }
    // } else {
    //     console.warn("UserContext not available, using default guest user.");
    //     // return <Navigate to="/login" replace />;
    // }
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
                style={{ width: "min(20rem, calc(100vw - 1.5rem))" }}
                className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50 transition
                    ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border object-cover"
                    />

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                            {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            @{user.username}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="relative overflow-visible flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white hover:bg-brand-strong focus:outline-hidden focus:ring-brand-medium transition-colors">
                        <img src={notificationsIcon} alt="Notifications" className="w-8 h-8 mb-1" />

                        <span className="sr-only">
                            Notifications
                        </span>

                        {user.notificationsCount > 0 && user.notificationsCount <= 99 && (
                            <span
                                className="absolute top-[-5px] -right-2 flex items-center justify-center w-[20px] h-[20px] text-[9px] font-bold text-white bg-red-500 rounded-full border-2 border-white "
                            >
                                {user.notificationsCount}
                            </span>
                        )}
                        {user.notificationsCount > 99 && (
                            <span
                                className="absolute top-[-5px] -right-2 flex items-center justify-center w-[22px] h-[20px] text-[9px] font-bold text-white bg-red-500 rounded-full border-2 border-white text-center ps-1"
                            >
                                99+
                            </span>
                        )}
                    </button>
                </div>

                <hr className="my-3" />
                <ul className="space-y-2 text-sm">
                    <li className="hover:bg-gray-100 p-2 rounded-sm cursor-pointer">
                        <Link to="/account" onClick={() => setOpen(false)} className="flex items-center gap-2">
                            <Settings size={16} />
                            Profile Settings
                        </Link>
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded-sm cursor-pointer" onClick={() => setOpen(false)}>
                        <Link to="/orders" className="flex items-center gap-2">
                            <span>📦</span>
                            My Orders ({user.ordersCount > 99 ? "99+" : user.ordersCount})
                        </Link>
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded-sm cursor-pointer" onClick={() => setOpen(false)}>
                        <Link to="/wishlist" className="flex items-center gap-2">
                            <span>❤️</span>
                            Wishlist
                        </Link>
                    </li>
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
