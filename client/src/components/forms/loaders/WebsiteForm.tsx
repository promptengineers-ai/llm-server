import React, { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
	index?: number;
}

export default function WebsiteForm(props: Props) {
	const { loaderForm, setLoaderForm, loadersPayload, setLoadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [urls, setUrls] = useState<string[]>([]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if (props.multiple) {
			console.log({ type: 'website', urls: urls });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'website', urls: urls }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label className="form-label">Website URL</label>
			<div className="input-group">
				<input
					className="form-control"
					type="url"
					required
					disabled={loading || isDisabled}
					placeholder="https://www.promptingguide.ai"
					onChange={(e) => {
						if (props.multiple) {
						setUrls([e.target.value]);
						} else {
						setLoaderForm({ ...loaderForm, urls: [e.target.value] });
						}
					}}
					value={props.multiple ? urls[0] : loaderForm.urls[0] || ""}
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
				Will scrape all of the available pages on the website.
			</small>
		</div>
	);
}
