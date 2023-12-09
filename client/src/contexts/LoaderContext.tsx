import { useRef, useContext, createContext, useState, useEffect } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { LoaderForm } from "../types/loader";
import { DocLoader, PromptEngine } from "../utils/api";
import { useAuthContext } from "./AuthContext";
import { useAppContext } from "./AppContext";
import { API_URL, ON_PREM } from "../config";

const docLoader = new DocLoader();
const promptEngine = new PromptEngine();

export const LoaderContext = createContext({});
export function useLoaderContext(): any {
	return useContext(LoaderContext);
}

export default function LoaderProvider({ children }: IContextProvider) {
	const defaultLoaderForm = {
		loader: 'files',
		text: '',
		ytId: '',
		bucketName: '',
		fileName: '',
		urls: [],
		files: [],
		contract_address: '',
	}
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	// Contexts
	const { setLoading, status, setStatus } = useAppContext();
	const { botAccessToken } = useAuthContext();
	// State
	const [loadersPayload, setLoadersPayload] = useState(() => {
		const savedProvider = sessionStorage.getItem('provider');
		return {
			index_name: '',
			provider: savedProvider ?? (ON_PREM ? 'redis' : 'pinecone'),
			files: [],
			loaders: [],
		}
	});
	const [loaderForm, setLoaderForm] = useState<LoaderForm>(defaultLoaderForm);
	const [file, setFile] = useState(null);
	const [formData, setFormData] = useState({});
	const [vectorstores, setVectstores] = useState<{label: string, value: string}[]>([]);
	const [files, setFiles] = useState<any[]>([]);
	const [loaderComponents, setLoaderComponents] = useState([]);
	const [indexSelection, setIndexSelection] = useState('new');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
		}
	};

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setLoaderForm((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	function clearLoaderForm() {
		const savedProvider = sessionStorage.getItem('provider');
		setLoaderForm(defaultLoaderForm)
		setLoadersPayload({
			index_name: '',
			provider: savedProvider ?? ON_PREM ? 'redis' : 'pinecone',
			files: [],
			loaders: [],
		})
		setFormData({});
		setFiles([]);
	}

	async function uploadFromUrl() {
		if (!loadersPayload.index_name) return alert('Please enter or select an index name.');
		let loader = {}
		if (loaderForm.loader === 'copy') {
			loader = {type: loaderForm.loader, text: loaderForm.text}
		} else if (loaderForm.loader === 'yt') {
			loader = {type: loaderForm.loader, ytId: loaderForm.ytId}
		} else if (loaderForm.loader === 'ethereum' || loaderForm.loader === 'polygon') {
			loader = {type: loaderForm.loader, contract_address: loaderForm.contract_address}
		} else {
			loader = {type: loaderForm.loader, urls: [loaderForm.urls[0]]}
		}
		let dataPayload = {
			...loadersPayload,
			loaders: [loader],
		}
		try {
			const res = await docLoader.url(botAccessToken, dataPayload);
			if (res.status === 200 || res.status === 201) {
				alert(`Vectorstore [${res.data.vectorstore}] created!`)
				clearLoaderForm();
			}
			return res
		} catch (error: any) {
            // Handle error here
            console.error(error);
            alert(error.response.data.detail)
		}
	}

	async function uploadFromMulti() {
		if (!loadersPayload.index_name) return alert('Please enter or select an index name.');
		try {
			const res = await docLoader.multi(botAccessToken, loadersPayload);
			if (res.status === 201) {
				alert(`File [${res.data.data.name}] created!`)
				clearLoaderForm();
			}
			return res
		} catch (error) {
		// Handle error here
		console.error(error);
		//   alert(error.response.data.detail)
		}
	}

	async function listVectorIndexes(provider?: string) {
		try {
			const res = await docLoader.listVectorIndexes(botAccessToken, provider);
			const vectorstores: {label: string, value: string}[] = []
			res.data.vectorstores.forEach((vectorstore: string) => {
				vectorstores.push({ value: vectorstore, label: vectorstore })
			})
			// Sort by label property in alphabetical order
			vectorstores.sort((a, b) => a.label.localeCompare(b.label));
			setVectstores(vectorstores)
			console.log(vectorstores)
			return res
		} catch (error) {
			// Handle error here
			console.error(error);
		}
	}

	async function listFiles() {
		try {
			const res = await docLoader.listFiles(botAccessToken);
			const files: any[] = []
			res.data.files.forEach((file: string) => {
				files.push({ value: file, label: file })
			})
			setFiles(files)
			console.log({files})
			return res
		} catch (error) {
			// Handle error here
			console.error(error);
			// alert(error.response.data.detail);
		}
	}

	async function deleteVectorstore(payload: { vectorstore: string, provider: string }) {
		try {
			const res = await promptEngine.deleteVectorstore(botAccessToken, payload);
			if (res.status === 204) {
				await listVectorIndexes(payload.provider); // TODO: Remove from vectorstores state
			}
			return res
		} catch (error) {
			// Handle error here
			console.error(error);
			alert((error as any).response.data.detail);
		}
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!loadersPayload.index_name) return alert('Please enter or select an index name.');
		setLoading(true);


		const data = new FormData();
		data.append('loader', loaderForm.loader);
		data.append('index_name', loadersPayload.index_name);

		if (files.length > 1) {
			for (let i = 0; i < files.length; i++) {
				data.append('files', files[i], files[i].name);
			}
		}

		// Append form fields
		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value as string | Blob);
		});

		try {
			const response = await docLoader.file(botAccessToken, data);

			alert(`Vectorstore [${response.data.vectorstore}] created!`)
			clearLoaderForm();
			// Handle response here
			console.log(response);
		} catch (error) {
			// Handle error here
			console.error(error);
			alert((error as any).response.data.detail);
		}
		setLoading(false);
	};

	const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };

	const handleFileSubmit = async () => {
		setLoading(true);
        if (!files || files.length === 0) {
            alert('No files to upload');
            return;
        }

        try {
            const formData = new FormData();
            files.forEach((file: File) => formData.append('files', file, file.name));

            const response = await fetch(`${API_URL}/api/v1/files`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${botAccessToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Files uploaded successfully', responseData);

            // Reset the file input after successful upload
            resetFileInput();
            setFiles([]);
			setInterval(() => {
				setStatus(0);
			}, 3000)
        } catch (error) {
			setStatus(2);
            console.error('Error uploading files', error);
			alert(`Error uploading files: ${error}`);
        }
		setLoading(false);
		setStatus(1);
    };

	useEffect(() => {
		// Save type to sessionStorage whenever it changes
		sessionStorage.setItem('provider', (loadersPayload.provider as any));
	}, [loadersPayload.provider]);

	return (
		<LoaderContext.Provider
			value={{
				loaderForm,
				setLoaderForm,
				files,
				setFiles,
				file,
				setFile,
				listFiles,
				formData,
				setFormData,
				uploadFromUrl,
				vectorstores,
				setVectstores,
				loadersPayload,
				setLoadersPayload,
				loaderComponents,
				setLoaderComponents,
				uploadFromMulti,
				indexSelection,
				listVectorIndexes,
				setIndexSelection,
				handleFileChange,
				handleInputChange,
				handleSubmit,
				deleteVectorstore,
				handleFileSubmit,
				fileInputRef
			}}
		>
			{children}
		</LoaderContext.Provider>
	);
}

