import React, { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ButtonConfig {
    label: string;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
}

interface MenuItem {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

interface CustomModalProps {
    title?: string;
    items: MenuItem[];
    buttons?: ButtonConfig[];
    dividerAfterIndex?: number;
    isOpen: boolean; onClose: () => void;
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

const CustomModal: React.FC<CustomModalProps> = ({ title, items, buttons = [], dividerAfterIndex, isOpen, onClose, }) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) { document.body.style.overflow = "auto"; }
        else { document.body.style.overflow = "auto"; }
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div className="bg-white w-96 rounded-2xl shadow-xl p-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}>
                        {title && (
                            <h2 className="text-lg font-bold mb-3">{title}</h2>
                        )}

                        <ul className="space-y-2 text-sm overflow-auto max-h-60">
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <motion.li
                                        whileHover={{ scale: item.disabled ? 1 : 1.02 }}
                                        whileTap={{ scale: item.disabled ? 1 : 0.97 }}
                                        onClick={() => !item.disabled && item.onClick?.()}
                                        className={`p-2 rounded cursor-pointer transition max-w-80 text-lg font-bold ${item.disabled
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                            }`}
                                    >
                                        {item.label}
                                    </motion.li>

                                    {dividerAfterIndex === index && (
                                        <hr className="my-2" />
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>

                        {buttons.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {buttons.map((btn, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: btn.disabled ? 1 : 1.03 }}
                                        whileTap={{ scale: btn.disabled ? 1 : 0.95 }}
                                        onClick={() => !btn.disabled && btn.onClick?.()}
                                        disabled={btn.disabled}
                                        className={`w-full py-2 rounded-lg text-white transition ${btn.disabled
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : btn.color || "bg-blue-600"
                                            }`}
                                    >
                                        {btn.label}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="mt-3 text-xs text-gray-500 w-full hover:underline">
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
};

export default CustomModal;