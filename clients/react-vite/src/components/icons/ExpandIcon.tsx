const ExpandIcon = ({ size }: any) => (
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
            d="M13 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L17.586 5H14a1 1 0 0 1-1-1m-9 9a1 1 0 0 1 1 1v3.586l3.793-3.793a1 1 0 0 1 1.414 1.414L6.414 19H10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1"
            clipRule="evenodd"
        ></path>
    </svg>
);

export default ExpandIcon;
