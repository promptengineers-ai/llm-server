import React, { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";

interface Props {
	multiple?: boolean;
}

export default function CopyPasteForm(props: Props) {
	const { loading } = useAppContext();
	const { loaderForm, setLoaderForm, setLoadersPayload, loadersPayload } = useLoaderContext();
	const [text, setText] = useState<string>('');
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if (props.multiple) {
			console.log({ type: 'copy', text: text });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: 'copy', text: text }]
			});
			setIsDisabled(!isDisabled);
			// Handle your submission logic here for the individual field
		}
	};

	return (
		<div className="mb-2">
			<label className="form-label">From Clipboard</label>
			<div className="input-group">
				<textarea
					className="form-control"
					disabled={loading || isDisabled}
					placeholder="Lorem ipsum..."
					onChange={(e) => {
						if (props.multiple) {
						setText(e.target.value);
						} else {
						setLoaderForm({
							...loaderForm,
							text: e.target.value
						});
						}
					}}
					value={props.multiple ? text : loaderForm.text}
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
				Paste text here to add to context.
			</small>
		</div>
	);
}
