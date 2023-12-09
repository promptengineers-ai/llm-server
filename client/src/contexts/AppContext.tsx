import React, { useContext } from "react";
import { IContextProvider } from "../interfaces/Provider";

export const AppContext = React.createContext({});

export default function AppProvider({ children }: IContextProvider) {
	const [windowHeight, setWindowWidth] = React.useState<number>(1920);
	const [windowWidth, setWindowHeight] = React.useState<number>(1080);
	const [chartAspectHeight, setChartAspectHeight] = React.useState<number>(1.5);
	const [chartAspectWidth, setChartAspectWidth] = React.useState<number>(4);

	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [status, setStatus] = React.useState(0);
	const [alert, setAlert] = React.useState<{
		status: boolean;
		severity: string;
		message: string;
	}>({
		status: false,
		severity: "",
		message: ""
	});

	const title = "Open AI Code Generator";

	const clearAlert = () => {
		setAlert({
		status: false,
		severity: "",
		message: ""
		});
	};

	const cycleAlert = (alert: {
		status: boolean;
		severity: string;
		message: string;
	}) => {
		setAlert(alert);
		setTimeout(() => {
		clearAlert();
		}, 3000);
	};

	React.useEffect(() => {
		function findDimensions() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		setWindowWidth(windowWidth);
		setWindowHeight(windowHeight);
		if (windowWidth < 600) {
			setChartAspectHeight(1.3);
			setChartAspectWidth(3);
		}
		if (windowWidth > 600) {
			setChartAspectHeight(0.8);
			setChartAspectWidth(5);
		}
		}

		setTimeout(() => {
			window.addEventListener("resize", findDimensions);
		}, 1000);
		findDimensions();
		return () => window.removeEventListener("resize", findDimensions);
	}, []);

	return (
		<AppContext.Provider
			value={{
				title,
				windowHeight,
				windowWidth,
				chartAspectWidth,
				chartAspectHeight,
				alert,
				setAlert,
				cycleAlert,
				open,
				setOpen,
				loading,
				setLoading,
				status,
				setStatus
			}}
		>
			{children}
		</AppContext.Provider>
	);
	}

	export function useAppContext(): any {
		return useContext(AppContext);
	}