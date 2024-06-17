import { useEffect } from "react";

export const useMyEffects = (state: any) => {
    useEffect(() => {
        // Define your effect logic here
        console.log("State updated:", state);

        return () => {
            // Cleanup logic if needed
        };
    }, [state]);
};
