import { useEffect, useState } from 'react';
import Select from '../selects/Select';
import { useChatContext } from '../../contexts/ChatContext';
import { useLoaderContext } from '../../contexts/LoaderContext';
import { filterByValue } from '../../utils/filter';
import { LOADER_TYPE_OPTIONS, URL_FILE_TYPES } from '../../config/options';
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

export default function CreateIndexForm() {
    const { chatPayload } = useChatContext();
	const { loading, setLoading } = useAppContext();
	const {
		uploadFromUrl,
		listVectorIndexes,
		vectorstores,
		loadersPayload,
		setLoadersPayload,
		loaderForm,
		setLoaderForm,
		handleSubmit
	} = useLoaderContext();
	const [show, setShow] = useState(false);
	const [existing, setExisting] = useState(false);
    
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

	useEffect(() => {
		if (existing) {
			(async () => {
				await listVectorIndexes(chatPayload.provider);
			})();
		}
	}, [existing]);

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="indexOption"
                            id="newIndex"
                            value="new"
                            checked={!existing} // Checked if existing is false
                            onChange={() => setExisting(false)} // Set existing to false when this is selected
                        />
                        <label className="form-check-label" htmlFor="newIndex">New</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="indexOption"
                            id="existingIndex"
                            value="existing"
                            checked={existing} // Checked if existing is true
                            onChange={() => setExisting(true)} // Set existing to true when this is selected
                        />
                        <label className="form-check-label" htmlFor="existingIndex">Existing</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {!existing ? (
                        <div className="mb-3">
                            <label className="form-label">Index Name</label>
                            <input
                                onChange={(e) => setLoadersPayload({...loadersPayload, index_name: e.target.value})}
                                type="text"
                                className="form-control"
                                placeholder="Enter name of index name"
                            />
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="form-label">Select Index</label>
                            <Select
                                handleChange={(e: any) => setLoadersPayload({
                                    ...loadersPayload,
                                    index_name: e.value
                                })}
                                value={filterByValue(vectorstores, 'value', loadersPayload.index_name)[0]}
                                options={vectorstores}
                                styles={selectStyle}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="mb-3">
                        <label className="form-label">Loader Type</label>
                        <Select
                            options={LOADER_TYPE_OPTIONS}
                            styles={selectStyle}
                            value={
                                loaderForm.loader
                                ? filterByValue(LOADER_TYPE_OPTIONS, 'value', loaderForm.loader)[0]
                                : LOADER_TYPE_OPTIONS[0]
                            }
                            handleChange={(item: {label: string, value: string}) => setLoaderForm({
                                ...loaderForm,
                                loader: item.value
                            })}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="mb-3">
                        <FormSelector loader={loaderForm.loader} />
                    </div>
                </div>
            </div>
        </>
    )
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