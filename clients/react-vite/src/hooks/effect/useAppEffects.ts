import { useEffect } from "react";

export const useHandleOutsideClickEffect = (isDrawerOpen: boolean, closeDrawer: () => void) => {
    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            const drawer = document.getElementById("drawer");
            if (drawer && !drawer.contains(event.target)) {
                closeDrawer();
            }
        };

        if (isDrawerOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDrawerOpen]);
};
