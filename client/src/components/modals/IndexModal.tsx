import { useEffect, useState } from 'react';
import { useLoaderContext } from '../../contexts/LoaderContext';
import { URL_FILE_TYPES } from '../../config/options';
import FileForm from '../forms/loaders/FileForm';
import CopyPasteForm from '../forms/loaders/CopyPasteForm';
import YoutubeForm from '../forms/loaders/YoutubeForm';
import SitemapForm from '../forms/loaders/SitemapForm';
import WebPageForm from '../forms/loaders/WebPageForm';
import WebsiteForm from '../forms/loaders/WebsiteForm';
import MultiUrlForm from '../forms/loaders/MultiUrlForm';
import GitbookForm from '../forms/loaders/GitbookForm';
import BlockchainForm from '../forms/loaders/BlockchainForm';
import { useAppContext } from '../../contexts/AppContext';
import CreateIndexForm from '../forms/CreateIndexForm';

const selectStyle = {
	control: (base: any) => ({
		...base,
		// Add any specific styling you want for the control (select box) here
	}),
	container: (base: any) => ({
		...base,
		width: '100%',
	}),
	menu: (base: any) => ({
		...base,
		width: 'calc(100% - 20px)', // Width adjusted for margins
	})
};

export default function IndexModal(props: { builder?: boolean }) {
	const { loading, setLoading, status } = useAppContext();
	const [activeTab, setActiveTab] = useState('create');
	const { fileInputRef, setFiles, handleFileSubmit } = useLoaderContext();
	const {
		uploadFromUrl,
		loaderForm,
		handleSubmit
	} = useLoaderContext();
	const [show, setShow] = useState(false);
	
	const handleOutsideClick = (e: MouseEvent) => {
        const modalContent = document.querySelector('.modal-content');
        if (show && modalContent && !modalContent.contains(e.target as Node)) {
            setShow(false);
        }
    };

	async function submitForm() {
		setLoading(true);
		// If not uploading a file directly add here.
		if (URL_FILE_TYPES.includes(loaderForm.loader)) {
			await uploadFromUrl();
			setLoading(false);
			setShow(!show);
			return;
		} else {
			setLoading(false);
			setShow(!show);
			return;
		}
	}

	// useEffect(() => {
    //     document.addEventListener('click', handleOutsideClick);

    //     return () => {
    //         // Clean up the event listener
    //         document.removeEventListener('click', handleOutsideClick);
    //     };
    // }, [show]);

	return (
		<>
			{props.builder ? (
				<a 
					onClick={(e) => {
						e.stopPropagation();
						setShow(!show);
					}}
					href="#"
				>
					<i className="bi bi-folder"></i>
					<span>Retrieval</span>
				</a>
			) : (
				<button
					type="button"
					className="btn btn-success btn-sm"
					onClick={(e) => {
						e.stopPropagation();
						setShow(!show);
					}}
				>
					<i className="bi bi-upload"></i>
				</button>
			)}
			<div
				className={"modal fade" + (show ? " modal-backdrop-show show" : "")}
				tabIndex={-1}
				role="dialog"
				style={{ display: show ? 'block' : 'none' }}
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<ul className="nav nav-tabs">
									<li className="nav-item">
										<a
											className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
											href="#"
											onClick={() => setActiveTab('create')}
										>
											Create Index
										</a>
									</li>
									<li className="nav-item">
										<a
											className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
											href="#"
											onClick={() => setActiveTab('upload')}
										>
											Upload Files
										</a>
									</li>
								</ul>
							</div>
							<div className="modal-body">
								{activeTab === 'create' && (
                                	<CreateIndexForm />
								)}
								{activeTab === 'upload' && (
									<div className="row">
										<div className="col">
											<label className="form-label">Upload Files</label>
											<div className="input-group input-group-sm">
												<input
													ref={fileInputRef} // Attach the ref to the input
													type="file"
													className="form-control form-control-sm"
													aria-describedby="Upload Files"
													aria-label="Upload"
													multiple={true}
													onChange={(event: any) => {
														setFiles([...event.target.files]);
													}}
												/>
												{status ? (
													<button
														className="btn btn-success"
														type="button"
													>
														<i className="bi bi-check-circle-fill"></i>
													</button>
												) : (
													<button
														className="btn btn-primary"
														type="button"
														onClick={() => {
															handleFileSubmit();
														}}
													>
														{!loading ? (
															<i className="bi bi-file-check"></i>
														) : (
															<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
														)}
													</button>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
							{activeTab === 'create' && (
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
										onClick={() => setShow(!show)}
									>
										Close
									</button>
									<button
										type="submit"
										className="btn btn-primary"
										onClick={submitForm}
										disabled={loading}
									>
										Create Index
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export function FormSelector(props: { loader: string, multiple?: boolean }) {
    if (props.loader === 'files') {
        return <FileForm />;
    }

	if (props.loader === 'copy') {
        return <CopyPasteForm multiple={props.multiple} />
    }

	if (props.loader === 'yt') {
        return <YoutubeForm multiple={props.multiple} />
    }

	if (props.loader === 'sitemap') {
        return <SitemapForm multiple={props.multiple} />
    }

	if (props.loader === 'web_base') {
        return <WebPageForm multiple={props.multiple} />
    }

	if (props.loader === 'website') {
        return <WebsiteForm multiple={props.multiple} />
    }

	if (props.loader === 'urls') {
        return <MultiUrlForm multiple={props.multiple} />
    }

	if (props.loader === 'gitbook') {
        return <GitbookForm multiple={props.multiple} />
    }

	if (props.loader === 'ethereum') {
        return <BlockchainForm formtype='ethereum' multiple={props.multiple} />
    }

    if (props.loader === 'polygon') {
        return <BlockchainForm formtype='polygon' multiple={props.multiple} />
    }

	return null;
}