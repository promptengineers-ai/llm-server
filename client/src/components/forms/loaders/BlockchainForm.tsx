import { useState } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLoaderContext } from "../../../contexts/LoaderContext";
import { capitalizeFirstLetter } from "../../../utils/format";

interface Props {
	formtype?: string;
	multiple?: boolean;
}

export default function BlockchainForm(props: Props) {
	const { loaderForm, setLoaderForm, setLoadersPayload, loadersPayload } = useLoaderContext();
	const { loading } = useAppContext();
	const [contractAddress, setContractAddress] = useState<string>();
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const handleInputSubmit = () => {
		if (props.multiple) {
			console.log({ type: props.formtype, contract_address: contractAddress });
			setLoadersPayload({
				...loadersPayload,
				loaders: [...loadersPayload.loaders, { type: props.formtype, contract_address: contractAddress }]
			});
			setIsDisabled(!isDisabled);
		}
	};

	return (
		<div className="mb-3">
			<label htmlFor="contractAddress" className="form-label">
				{capitalizeFirstLetter(props.formtype || '')} Contract Address
			</label>
			<div className="input-group">
				<input
					id="contractAddress"
					type="text"
					className="form-control"
					placeholder={
						props.formtype === 'ethereum'
						? '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
						: '0x448676ffCd0aDf2D85C1f0565e8dde6924A9A7D9'
					}
					onChange={(e) => {
						if (props.multiple) {
						setContractAddress(e.target.value);
						} else {
						setLoaderForm({
							...loaderForm,
							contract_address: e.target.value
						});
						}
					}}
					value={props.multiple ? contractAddress : loaderForm.contract_address}
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
				The {capitalizeFirstLetter(props.formtype || '')} contract address of the NFT Smart Contract.
			</small>
		</div>
	);
}
