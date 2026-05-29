import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    className="w-10 h-10 rounded-full cursor-pointer"
                    src="/docs/images/people/profile-picture-5.jpg"
                    alt="User dropdown"
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 mt-2 z-10 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                    <div className="px-4 py-3 border-b border-default-medium text-sm text-heading">
                        <div className="font-medium">
                            Bonnie Green
                        </div>
                        <div className="truncate">
                            name@flowbite.com
                        </div>
                    </div>

                    <ul className="p-2 text-sm text-body font-medium">
                        <li>
                            <Link to="/profile"
                                className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link to="/profile"
                                className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                            >
                                Settings
                            </Link>
                        </li>

                        <li>
                            <Link to="/profile"
                                className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                            >
                                Earnings
                            </Link>
                        </li>

                        <li>
                            <Link to="/logout"
                                className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                            >
                                Sign out
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;