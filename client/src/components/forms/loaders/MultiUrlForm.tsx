import React, { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
}

export default function MultiUrlForm(props: Props) {
	const { loaderForm, setLoaderForm, loadersPayload, setLoadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [myUrls, setMyUrls] = useState([loaderForm.urls[0]]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const addUrlInput = () => {
		setMyUrls([...myUrls, ""]);
	};

	const removeUrlInput = (index: number) => {
		const newUrls = myUrls.filter((_, i) => i !== index);
		setMyUrls(newUrls);
		setLoaderForm({ ...loaderForm, urls: newUrls });
	};

	const updateUrl = (index: number, value: string) => {
		const newUrls = myUrls.map((url, i) => (i === index ? value : url));
		setMyUrls(newUrls);
		setLoaderForm({ ...loaderForm, urls: newUrls });
	};

	const handleInputSubmit = () => {
		if (props.multiple) {
			let filteredArray = myUrls.filter(element => element !== '');
			console.log({ type: 'urls', urls: filteredArray });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'urls', urls: filteredArray }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label className="form-label">Site URL</label>
			{myUrls.map((url, index) => (
				<div className="d-flex mb-2" key={index}>
					<input
						className="form-control"
						type="url"
						placeholder="https://my-blog.com"
						onChange={(e) => updateUrl(index, e.target.value)}
						value={url}
						disabled={loading || index < myUrls.length - 1}
					/>
					<button
						className="btn btn-outline-secondary ms-1"
						onClick={() => removeUrlInput(index)}
						disabled={loading || index === myUrls.length - 1 || isDisabled}
						aria-label="Remove URL"
					>
						-
					</button>
					{index === myUrls.length - 1 && (
						<>
							<button
								className="btn btn-outline-secondary ms-1"
								onClick={addUrlInput}
								disabled={loading || isDisabled}
								aria-label="Add URL"
							>
								+
							</button>
							{props.multiple && (
								<button
									className="btn btn-outline-secondary ms-1"
									onClick={handleInputSubmit}
									disabled={loading || isDisabled}
									aria-label={isDisabled ? "Locked" : "Submit"}
								>
									{isDisabled ? <i className="bi bi-lock-fill"></i> : <i className="bi bi-check-lg"></i>}
								</button>
							)}
						</>
					)}
				</div>
			))}
			<small className="form-text text-muted">
				Add all of the links for the context you'd like to load.
			</small>
		</div>
	);
}
