import React, { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
}

export default function WebPageForm(props: Props) {
	const { loaderForm, setLoaderForm, loadersPayload, setLoadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [urls, setUrls] = useState<string[]>([]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if (props.multiple) {
			console.log({ type: 'web_base', urls: urls });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'web_base', urls: urls }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label className="form-label">Web Page URL</label>
			<div className="input-group">
				<input
					className="form-control"
					type="url"
					required
					disabled={loading || isDisabled}
					placeholder="https://my-website-info.com"
					onChange={(e) => {
						if (props.multiple) {
						setUrls([e.target.value]);
						} else {
						setLoaderForm({ ...loaderForm, urls: [e.target.value] });
						}
					}}
					value={loaderForm.urls[0] || ""}
				/>
				{props.multiple && (
					<button
						className="btn btn-outline-secondary"
						type="button"
						disabled={isDisabled}
						onClick={handleInputSubmit}
					>
						{isDisabled ? "Locked" : "Submit"}
					</button>
				)}
			</div>
			<small className="form-text text-muted">
				The URL for Single Web Page
			</small>
		</div>
	);
}
