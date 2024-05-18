import { Dispatch, SetStateAction, useState } from "react";

const OPTIONS = ["GPT-3.5", "GPT-4"];

function selectOption(
    selected: string,
    setChosenModel: Dispatch<SetStateAction<string>>
) {
    if ("GPT-3.5" === selected) {
        return (
            <ul className="flex w-full list-none gap-1 sm:w-auto">
                <li className="group/toggle w-full">
                    <button
                        type="button"
                        id="radix-:r6a:"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        className="w-full cursor-pointer"
                    >
                        <div className="group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-black/10 bg-primary-50 text-gray-900 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] hover:!opacity-100 dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100">
                            <span className="max-[370px]:hidden relative text-icon-green">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="icon-sm transition-colors text-brand-purple"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </span>
                            <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5 text-primary-100">
                                {selected}
                            </span>
                        </div>
                    </button>
                </li>
                <li
                    className="group/toggle w-full"
                    data-testid="text-davinci-002-render-sha"
                    onClick={() => setChosenModel("GPT-4")}
                >
                    <button
                        type="button"
                        id="radix-:r68:"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        className="w-full cursor-pointer"
                    >
                        <div className="group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-transparent text-gray-500 hover:text-gray-300 hover:dark:text-gray-100">
                            <span className="max-[370px]:hidden relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="icon-sm transition-colors group-hover/button:text-brand-green"
                                    width="16"
                                    height="16"
                                >
                                    <g fill="currentColor">
                                        <path d="M13.164.98a.7.7 0 0 0-1.328 0l-.478 1.435a.7.7 0 0 1-.443.443l-1.436.478a.7.7 0 0 0 0 1.328l1.436.479a.7.7 0 0 1 .443.442l.478 1.436a.7.7 0 0 0 1.328 0l.478-1.436a.7.7 0 0 1 .443-.443l1.436-.478a.7.7 0 0 0 0-1.328l-1.436-.478a.7.7 0 0 1-.443-.443L13.164.979Z"></path>
                                        <path d="M8.845 2.554C8.368 2.848 8 3.295 8 4c0 1.5 1.667 1.833 2.5 2 .167.833.5 2.5 2 2.5.968 0 1.45-.694 1.715-1.41a6.5 6.5 0 1 1-5.37-4.536Zm.922 10.99a4.882 4.882 0 0 0 3.04-3.732h-1.925a9.532 9.532 0 0 1-1.115 3.733ZM6.75 9.813A7.902 7.902 0 0 0 8 13.338a7.902 7.902 0 0 0 1.25-3.525h-2.5Zm-3.558 0a4.882 4.882 0 0 0 3.04 3.733 9.531 9.531 0 0 1-1.114-3.732H3.192ZM8 4.662a7.902 7.902 0 0 0-1.25 3.526h2.5A7.902 7.902 0 0 0 8 4.662ZM3.192 8.188h1.926a9.531 9.531 0 0 1 1.115-3.733 4.882 4.882 0 0 0-3.04 3.732Z"></path>
                                    </g>
                                </svg>
                            </span>
                            <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5">
                                GPT-4
                            </span>
                        </div>
                    </button>
                </li>
            </ul>
        );
    } else {
        return (
            <ul className="flex w-full list-none gap-1 sm:w-auto">
                <li
                    className="group/toggle w-full"
                    data-testid="text-davinci-002-render-sha"
                >
                    <button
                        type="button"
                        id="radix-:r68:"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        className="w-full cursor-pointer"
                        onClick={() => setChosenModel("GPT-3.5")}
                    >
                        <div className="group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-transparent text-gray-500 hover:text-gray-300 hover:dark:text-gray-100">
                            <span className="max-[370px]:hidden relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="icon-sm transition-colors group-hover/button:text-brand-green"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </span>
                            <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5">
                                GPT-3.5
                            </span>
                        </div>
                    </button>
                </li>
                <li className="group/toggle w-full" data-testid="gpt-4">
                    <button
                        type="button"
                        id="radix-:r6a:"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        className="w-full cursor-pointer"
                    >
                        <div className="group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-black/10 bg-primary-50 text-gray-900 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] hover:!opacity-100 dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100">
                            <span className="max-[370px]:hidden relative text-icon-purple">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="icon-sm transition-colors text-brand-purple"
                                    width="16"
                                    height="16"
                                >
                                    <g fill="currentColor">
                                        <path d="M13.164.98a.7.7 0 0 0-1.328 0l-.478 1.435a.7.7 0 0 1-.443.443l-1.436.478a.7.7 0 0 0 0 1.328l1.436.479a.7.7 0 0 1 .443.442l.478 1.436a.7.7 0 0 0 1.328 0l.478-1.436a.7.7 0 0 1 .443-.443l1.436-.478a.7.7 0 0 0 0-1.328l-1.436-.478a.7.7 0 0 1-.443-.443L13.164.979Z"></path>
                                        <path d="M8.845 2.554C8.368 2.848 8 3.295 8 4c0 1.5 1.667 1.833 2.5 2 .167.833.5 2.5 2 2.5.968 0 1.45-.694 1.715-1.41a6.5 6.5 0 1 1-5.37-4.536Zm.922 10.99a4.882 4.882 0 0 0 3.04-3.732h-1.925a9.532 9.532 0 0 1-1.115 3.733ZM6.75 9.813A7.902 7.902 0 0 0 8 13.338a7.902 7.902 0 0 0 1.25-3.525h-2.5Zm-3.558 0a4.882 4.882 0 0 0 3.04 3.733 9.531 9.531 0 0 1-1.114-3.732H3.192ZM8 4.662a7.902 7.902 0 0 0-1.25 3.526h2.5A7.902 7.902 0 0 0 8 4.662ZM3.192 8.188h1.926a9.531 9.531 0 0 1 1.115-3.733 4.882 4.882 0 0 0-3.04 3.732Z"></path>
                                    </g>
                                </svg>
                            </span>
                            <span className="truncate text-sm font-medium md:pr-1.5 pr-1.5 text-primary-100">
                                GPT-4
                            </span>
                        </div>
                    </button>
                </li>
            </ul>
        );
    }
}

export default function ChooseModelSection() {
    const [chosenModel, setChosenModel] = useState(OPTIONS[0] || "");

    return (
        <div className="px-2 w-full flex flex-col py-2 md:py-6 stick top-0">
            <div className="relative flex flex-col items-stretch justify-center gap-2 sm:items-center">
                <div className="relative flex rounded-xl bg-primary-800 p-1 text-gray-900 dark:bg-gray-900">
                    <ul className="flex w-full list-none gap-1 sm:w-auto">
                        {selectOption(chosenModel, setChosenModel)}
                    </ul>
                </div>
            </div>
        </div>
    );
}
