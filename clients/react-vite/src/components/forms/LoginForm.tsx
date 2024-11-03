import { useAuthContext } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext"; // Make sure to import the theme context
import { useAppState } from "@/hooks/state/useAppState";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const LoginForm = () => {
    const { theme } = useThemeContext();
    const { loading, setLoading } = useAppState();
    const { login } = useAuthContext();
    const [payload, setPayload] = useState({
        email: "admin@example.com",
        password: "test1234",
    });
    const [timeoutExceeded, setTimeoutExceeded] = useState(false);

    // Determine the class names based on the theme
    const themeClasses =
        theme === "dark"
            ? {
                  text: "text-white",
                  input: "bg-gray-800 border-gray-700 placeholder-gray-500",
                  button: "bg-indigo-700 hover:bg-indigo-600",
                  link: "text-indigo-400 hover:text-indigo-300",
                  shadow: "shadow-none",
              }
            : {
                  text: "text-gray-900",
                  input: "border-gray-300 placeholder-gray-400",
                  button: "bg-indigo-600 hover:bg-indigo-500",
                  link: "text-indigo-600 hover:text-indigo-500",
                  shadow: "shadow-sm",
              };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setPayload((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (!payload.email || !payload.password) {
                alert("Email and password are required");
                return;
            }

            setLoading(true);
            await login(payload.email, payload.password);
            console.log("Login Successful");
            // Navigate to dashboard or home page here
        } catch (error) {
            console.error("Login Failed:", error);
        } finally {
            setLoading(false);
            setTimeoutExceeded(false);
        }
    };
    // useEffect(() => {
    //     let timer: ReturnType<typeof setTimeout>;
    //     if (loading) {
    //         timer = setTimeout(() => {
    //             setTimeoutExceeded(true);
    //         }, 5000); // 5 seconds timeout
    //     }
    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, [loading]);

    return (
        <>
            <div
                className={`flex-1 flex flex-col justify-center px-6 py-12 lg:px-8`}
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-24 w-auto"
                        src="/icons/512.png"
                        alt="Your Company"
                    />
                    <h2
                        className={`mt-6 text-center text-3xl font-extrabold ${themeClasses.text}`}
                    >
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        className="space-y-6"
                        action="#"
                        method="POST"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className={`block text-sm font-medium leading-6 ${themeClasses.text}`}
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Enter your email address"
                                    className={`block w-full rounded-md py-1.5 px-3 ${themeClasses.text} ${themeClasses.input} ${themeClasses.shadow} focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`}
                                    value={payload.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className={`block text-sm font-medium leading-6 ${themeClasses.text}`}
                                >
                                    Password
                                </label>
                                {/* <div className="text-sm">
                                    <a
                                        href="#"
                                        className={`font-semibold ${themeClasses.link}`}
                                    >
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className={`block w-full rounded-md py-1.5 px-3 ${themeClasses.text} ${themeClasses.input} ${themeClasses.shadow} focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6`}
                                    value={payload.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white ${themeClasses.button} ${themeClasses.shadow} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500`}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <FaSpinner
                                            className="animate-spin"
                                            fontSize={18}
                                        />
                                        <span className="ml-2">
                                            Processing...
                                        </span>
                                    </div>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>
                    </form>
                    {loading && timeoutExceeded && (
                        <div className="mt-4 text-center text-xs text-red-600">
                            Serverless Enabled: please wait for cold boot to
                            finish
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoginForm;
