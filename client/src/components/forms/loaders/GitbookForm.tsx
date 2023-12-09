import { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
}

export default function GitbookLoaderForm(props: Props) {
	const { loaderForm, setLoaderForm, setLoadersPayload, loadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [urls, setUrls] = useState<string[]>([]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if(props.multiple) {
			console.log({ type: 'gitbook', urls: urls });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'gitbook', urls: urls }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label htmlFor="gitbookUrl" className="form-label">Gitbook URL</label>
			<div className="input-group">
				<input
					id="gitbookUrl"
					type="url"
					className="form-control"
					placeholder="https://docs.gitbook.com"
					onChange={(e) => {
						if (props.multiple) {
						setUrls([e.target.value])
						} else {
						setLoaderForm({
							...loaderForm,
							urls: [e.target.value]
						})
						}
					}}
					value={props.multiple ? urls[0] : loaderForm.urls[0]}
					disabled={loading || isDisabled}
					required
				/>
				{props.multiple && (
					<button
						className="btn btn-outline-secondary"
						type="button"
						disabled={isDisabled}
						onClick={handleInputSubmit}
					>
						{isDisabled ? <i className="bi bi-lock-fill"></i> : <i className="bi bi-check-lg"></i>}
					</button>
				)}
			</div>
			<small className="form-text text-muted">
				The URL to the intended Gitbook docs for the service.
			</small>
		</div>
	);
}
