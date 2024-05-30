import theme from "@/config/theme";

const HomeSection = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-fixed">
            <div className="w-full pb-2 flex justify-center">
                <img src={theme.button.icon.src} alt="Icon" width="100px" />
            </div>
            <h1 className="text-3xl font-semibold text-center text-primary-200 dark:text-gray-600 mt-4 mb-64 sm:mb-16">
                {theme.chatWindow.welcomeMessage}
            </h1>
        </div>
    );
};

export default HomeSection;
