import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Check } from "lucide-react";

interface ButtonConfig {
    label: string;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
}

interface MenuItem {
    label: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}

interface CustomModalProps {
    title?: string;
    items: MenuItem[];
    buttons?: ButtonConfig[];
    dividerAfterIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
    exit: { opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } },
};

const CustomModal: React.FC<CustomModalProps> = ({ title, items, buttons = [], dividerAfterIndex, isOpen, onClose }) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Lock background scroll while the modal is open, restore it on close/unmount.
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs z-50 p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5 flex flex-col max-h-[85vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && (
                            <h2 className="text-lg font-bold mb-3 shrink-0">{title}</h2>
                        )}

                        <ul className="space-y-1 overflow-y-auto pr-1 -mr-1 flex-1">
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <motion.li
                                        whileTap={{ scale: item.disabled ? 1 : 0.98 }}
                                        onClick={() => !item.disabled && item.onClick?.()}
                                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition text-base ${item.disabled
                                            ? "opacity-60 cursor-not-allowed"
                                            : item.active
                                                ? "bg-brand-50 text-brand-700 font-semibold"
                                                : "hover:bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        <span className="truncate">{item.label}</span>
                                        {item.active && (
                                            <Check size={20} className="text-brand-600 shrink-0" />
                                        )}
                                    </motion.li>

                                    {dividerAfterIndex === index && (
                                        <hr className="my-2 border-gray-200" />
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>

                        <div className="mt-4 shrink-0 space-y-2">
                            {buttons.map((btn, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: btn.disabled ? 1 : 1.02 }}
                                    whileTap={{ scale: btn.disabled ? 1 : 0.97 }}
                                    onClick={() => !btn.disabled && btn.onClick?.()}
                                    disabled={btn.disabled}
                                    className={`w-full py-2.5 rounded-lg text-white font-medium transition ${btn.disabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : btn.color || "bg-brand-600 hover:bg-brand-700"
                                        }`}
                                >
                                    {btn.label}
                                </motion.button>
                            ))}

                            {buttons.length === 0 && (
                                <button
                                    onClick={onClose}
                                    className="w-full py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CustomModal;
