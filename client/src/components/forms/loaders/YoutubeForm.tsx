import React, { useState } from 'react';
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
}

export default function YoutubeForm(props: Props) {
	const { loaderForm, setLoaderForm, setLoadersPayload, loadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [ytId, setYtId] = useState<string>('');
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if (props.multiple) {
			console.log({ type: 'yt', ytId: ytId });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'yt', ytId: ytId }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label htmlFor="youtubeVideoId" className="form-label">Youtube Video ID</label>
			{/* <small className="form-text text-muted mb-2">
				Only enter the VIDEO_ID that appears on the end of the url
			</small> */}
			<div className="input-group">
				<input
					id="youtubeVideoId"
					type="text"
					className="form-control"
					placeholder="CeZroxbdLXY"
					disabled={loading || isDisabled}
					onChange={(e) => {
						if (props.multiple) {
						setYtId(e.target.value);
						} else {
						setLoaderForm({ ...loaderForm, ytId: e.target.value });
						}
					}}
					value={props.multiple ? ytId : loaderForm.ytId}
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
				https://www.youtube.com/watch?v=<code>CeZroxbdLXY</code>
			</small>
		</div>
	);
}
