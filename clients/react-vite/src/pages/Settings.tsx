import { useNavigate } from "react-router-dom";
import { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";


const SettingsPage: FC = () => {
    const navigate = useNavigate();

    return (
        <main
            className="flex min-h-screen flex-col"
            style={{ position: "relative" }}
        >
            <button
                className="flex"
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
            >
                <IoIosArrowBack className="text-2xl" /> <span className="font-semibold">Go Back</span>
            </button>
            <div
                className={`flex-1 flex flex-col justify-center px-6 py-12 lg:px-8`}
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    Settings Page
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;
