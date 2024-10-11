"use client";

import { useAppContext } from "@/contexts/AppContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const SettingsPopover = () => {
    const router = useRouter();
    const { logout, retrieveUser } = useAuthContext();
    const { setIsCustomizeOpen } = useAppContext();

    return (
        <div
            className="popover absolute bg-gray-100 bottom-full left-0 z-20 mb-1 w-full overflow-hidden rounded-lg border border-token-border-light bg-token-main-surface-primary p-1.5 shadow-lg outline-none opacity-100 translate-y-0 text-black"
            aria-labelledby="headlessui-menu-button-:rmc:"
            id="headlessui-menu-items-:rmg:"
            role="menu"
            data-headlessui-state="open"
        >
            <nav role="none">
                <div
                    className="pl-3 pr-2 py-2 text-sm text-token-text-secondary"
                    role="none"
                >
                    {retrieveUser().email}
                </div>
                <div
                    className="h-px bg-token-border-light my-1.5 bg-gray-400"
                    role="none"
                ></div>
                {/* <a
                    className="hover:bg-gray-200 flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-item-:rmh:"
                    role="menuitem"
                    data-headlessui-state=""
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md"
                    >
                        <path
                            d="M11.4284 2.39822C11.7719 2.15891 12.2281 2.15891 12.5716 2.39822L15.0347 4.11412C15.1532 4.19667 15.2882 4.25257 15.4303 4.27799L18.3853 4.80632C18.7974 4.88 19.12 5.2026 19.1937 5.61471L19.722 8.56969C19.7474 8.71185 19.8033 8.84682 19.8859 8.96531L21.6018 11.4284C21.8411 11.7719 21.8411 12.2281 21.6018 12.5716L19.8859 15.0347C19.8033 15.1532 19.7474 15.2882 19.722 15.4303L19.1937 18.3853C19.12 18.7974 18.7974 19.12 18.3853 19.1937L15.4303 19.722C15.2881 19.7474 15.1532 19.8033 15.0347 19.8859L12.5716 21.6018C12.2281 21.8411 11.7719 21.8411 11.4284 21.6018L8.96531 19.8859C8.84682 19.8033 8.71185 19.7474 8.56969 19.722L5.61471 19.1937C5.2026 19.12 4.88 18.7974 4.80632 18.3853L4.27799 15.4303C4.25257 15.2881 4.19667 15.1532 4.11412 15.0347L2.39822 12.5716C2.15891 12.2281 2.15891 11.7719 2.39822 11.4284L4.11412 8.96531C4.19667 8.84682 4.25257 8.71185 4.27799 8.56969L4.80632 5.61471C4.88 5.2026 5.2026 4.88 5.61471 4.80632L8.56969 4.27799C8.71185 4.25257 8.84682 4.19667 8.96531 4.11412L11.4284 2.39822Z"
                            stroke="currentColor"
                            strokeWidth="2"
                        ></path>
                        <path
                            d="M11.5876 8.10179C11.7862 7.81201 12.2138 7.81201 12.4124 8.10179L13.4865 9.66899C13.5515 9.76386 13.6473 9.83341 13.7576 9.86593L15.58 10.4031C15.9169 10.5025 16.0491 10.9092 15.8349 11.1876L14.6763 12.6934C14.6061 12.7846 14.5696 12.8971 14.5727 13.0121L14.625 14.9113C14.6346 15.2625 14.2886 15.5138 13.9576 15.3961L12.1675 14.7596C12.0592 14.721 11.9408 14.721 11.8325 14.7596L10.0424 15.3961C9.71135 15.5138 9.36537 15.2625 9.37502 14.9113L9.42726 13.0121C9.43042 12.8971 9.39385 12.7846 9.32372 12.6934L8.16514 11.1876C7.9509 10.9092 8.08306 10.5025 8.42003 10.4031L10.2424 9.86593C10.3527 9.83341 10.4485 9.76386 10.5135 9.66899L11.5876 8.10179Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    My plan
                </a> */}
                <a
                    // href="/gpts/mine"
                    className="hover:bg-gray-200 flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-item-:rmi:"
                    role="menuitem"
                    data-headlessui-state=""
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M4.5 21C4.5 17.7804 6.82883 15.0685 10 14.2516"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        ></path>
                        <circle
                            cx="15.625"
                            cy="15.625"
                            r="1.625"
                            fill="currentColor"
                        ></circle>
                        <circle
                            cx="20.125"
                            cy="15.625"
                            r="1.625"
                            fill="currentColor"
                        ></circle>
                        <circle
                            cx="20.125"
                            cy="20.125"
                            r="1.625"
                            fill="currentColor"
                        ></circle>
                        <circle
                            cx="15.625"
                            cy="20.125"
                            r="1.625"
                            fill="currentColor"
                        ></circle>
                    </svg>
                    My Assistants
                </a>
                <a
                    className="hover:bg-gray-200 flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-item-:rmj:"
                    role="menuitem"
                    data-headlessui-state=""
                    onMouseDown={() => setIsCustomizeOpen(true)}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md"
                    >
                        <path
                            d="M10.663 6.3872C10.8152 6.29068 11 6.40984 11 6.59007V8C11 8.55229 11.4477 9 12 9C12.5523 9 13 8.55229 13 8V6.59007C13 6.40984 13.1848 6.29068 13.337 6.3872C14.036 6.83047 14.5 7.61105 14.5 8.5C14.5 9.53284 13.8737 10.4194 12.9801 10.8006C12.9932 10.865 13 10.9317 13 11V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V11C11 10.9317 11.0068 10.865 11.0199 10.8006C10.1263 10.4194 9.5 9.53284 9.5 8.5C9.5 7.61105 9.96397 6.83047 10.663 6.3872Z"
                            fill="currentColor"
                        ></path>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 5V19C4 20.6569 5.34315 22 7 22H19C19.3346 22 19.6471 21.8326 19.8325 21.5541C20.0179 21.2755 20.0517 20.9227 19.9225 20.614C19.4458 19.4747 19.4458 18.5253 19.9225 17.386C19.9737 17.2637 20 17.1325 20 17V3C20 2.44772 19.5523 2 19 2H7C5.34315 2 4 3.34315 4 5ZM6 5C6 4.44772 6.44772 4 7 4H18V16H7C6.64936 16 6.31278 16.0602 6 16.1707V5ZM7 18H17.657C17.5343 18.6699 17.5343 19.3301 17.657 20H7C6.44772 20 6 19.5523 6 19C6 18.4477 6.44772 18 7 18Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    Customize Chat
                </a>
                <a
                    className="hover:bg-gray-200 flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-item-:rmk:"
                    role="menuitem"
                    data-headlessui-state=""
                    onClick={(event) => {
                        event.preventDefault();
                        router.push("/settings");
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md"
                    >
                        <path
                            d="M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        ></path>
                        <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                            stroke="currentColor"
                            strokeWidth="2"
                        ></circle>
                    </svg>
                    Settings
                </a>
                <div
                    className="h-px bg-token-border-light my-1.5 bg-gray-400"
                    role="none"
                ></div>
                <a
                    className="hover:bg-gray-200 flex gap-2 rounded p-2.5 text-sm cursor-pointer focus:ring-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group items-center hover:bg-token-sidebar-surface-secondary"
                    id="headlessui-menu-item-:rml:"
                    role="menuitem"
                    data-headlessui-state=""
                    onClick={logout}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md"
                    >
                        <path
                            d="M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        ></path>
                        <path
                            d="M20 12H11M20 12L16 16M20 12L16 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                    Log out
                </a>
            </nav>
        </div>
    );
};

export default SettingsPopover;
