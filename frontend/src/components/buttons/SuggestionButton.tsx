import { useChatContext } from "@/contexts/ChatContext";


export default function SuggestionButton({ title, description }: { title: string; description: string;}) {
    const { setUserInput } = useChatContext();
    return (
        <span
            style={{
                transform: "none",
            }}
            onClick={(e) => {
                e.preventDefault();
                setUserInput(description);
            }}
        >
            <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal border-solid border-2 border-secondary-outline-dark">
                <div className="flex w-full gap-2 items-center justify-center">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col overflow-hidden py-1 px-2 text-secondary-100">
                            <div className="truncate font-semibold text-black">
                                {title}
                            </div>
                            <div className="truncate text-gray-400 text-xs">
                                {description}
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200">
                            <span className="" data-state="closed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="icon-sm pr-1"
                                >
                                    <path
                                        d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </button>
        </span>
    );
}