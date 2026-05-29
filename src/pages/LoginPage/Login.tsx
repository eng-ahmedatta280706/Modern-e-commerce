import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const LoginRegisterPage: React.FC = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("LoginRegisterPage must be used within AuthProvider");

    const { loginUser, registerUser } = auth;

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await registerUser({ name, email, password });
            } else {
                await loginUser(email, password);
            }
            window.location.href = "/";
        } catch (err) {
            setError("Something went wrong, please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isRegister ? "Register" : "Login"}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {isRegister ? "Register" : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    {isRegister ? (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setIsRegister(false)}
                                className="text-blue-600 hover:underline"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <button
                                onClick={() => setIsRegister(true)}
                                className="text-blue-600 hover:underline"
                            >
                                Register
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default LoginRegisterPage;