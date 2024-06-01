import { MdKeyboardArrowDown } from "react-icons/md";

const ScrollToBottomButton = ({ onClick }: any) => {
    
    return (
        <div className="flex items-center justify-center">
            <button
                onClick={onClick}
                className="fixed bottom-24 p-2 rounded-full bg-gray-200 shadow-lg z-30"
                aria-label="Scroll to bottom"
            >
                <MdKeyboardArrowDown size="20" />
            </button>
        </div>
    );
};

export default ScrollToBottomButton;
