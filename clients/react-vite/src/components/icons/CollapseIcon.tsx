const CollapseIcon = ({ size }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || "24"}
        height={size || "24"}
        fill="none"
        viewBox="0 0 24 24"
        className="icon-md text-token-text-tertiary hover:text-token-text-primary cursor-pointer"
    >
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M13 4a1 1 0 1 1 2 0v3.586l4.293-4.293a1 1 0 1 1 1.414 1.414L16.414 9H20a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1zM3 14a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-3.586l-4.293 4.293a1 1 0 0 1-1.414-1.414L7.586 15H4a1 1 0 0 1-1-1"
            clipRule="evenodd"
        ></path>
    </svg>
);

export default CollapseIcon;
