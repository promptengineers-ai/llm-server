import { useState } from 'react';
import Select, { components } from 'react-select';

interface Props {
    cleared?: boolean;
    disabled?: boolean;
    loading?: boolean;
    options: {label: string, value: string}[];
    onMenuOpen?: any;
    value?: {label: string, value: string};
    handleChange?: any;
    styles?: any;
    className?: string;
    multiple?: boolean;
	deleteCallback?: any;
}

export default ({
    cleared,
    disabled,
    loading,
    options,
    onMenuOpen,
    value,
    handleChange,
    styles,
    multiple,
	deleteCallback,
}: Props) => {

	const selectStyle = {
		control: (base: any) => ({
			...base,
			// Add any specific styling you want for the control (select box) here
		}),
		container: (base: any) => ({
			...base,
			width: '100%',
			marginLeft: '10px', // Adjust the left margin as needed
			marginRight: '10px'  // Adjust the right margin as needed
		}),
		menu: (base: any) => ({
			...base,
			width: 'calc(100% - 20px)', // Width adjusted for margins
		})
	};

	// State to track the selected option for deletion
    const [selectedForDeletion, setSelectedForDeletion] = useState(null);

    const handleDeleteClick = (option: any) => {
        setSelectedForDeletion(option);
        // Code to open the modal goes here
    }

    const CustomOption = (props: any) => {
        return (
            <components.Option {...props}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {props.children}
					<i 
						className="bi bi-x-circle-fill"
						style={{  cursor: 'pointer', color: '#dc3545' }}
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteClick(props.data);
						}}
					></i>
                </div>
            </components.Option>
        );
    };

	return (
		<>
			<Select
				components={deleteCallback ? { Option: CustomOption } : undefined}
				isMulti={multiple}
				onChange={handleChange}
				value={value}
				onMenuOpen={onMenuOpen}
				classNamePrefix="select"
				isDisabled={disabled}
				isLoading={loading}
				isClearable={cleared}
				isSearchable={true}
				options={options}
				styles={styles ? styles : selectStyle}
			/>
			{selectedForDeletion && deleteCallback && <DeleteModal option={selectedForDeletion} deleteCallback={deleteCallback} onClose={() => setSelectedForDeletion(null)} />}
		</>
	);

};


const DeleteModal = ({ option, onClose, deleteCallback }: any) => {
	const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteCallback(option);
        	onClose(); // Close the modal after deletion
		} catch(error: unknown) {
			// Handle error here
			console.error(error);
			alert((error as any).response.data.detail);
		}
		setLoading(false);
    }

    return (
        <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
			<div className="modal-backdrop-show fade show"></div>

            {/* Modal content */}
			<div className="modal-dialog modal-dialog-centered" role="document" style={{ zIndex: 1050 }}>

				<div className="modal-content">
					<div className="modal-body p-4 text-center">
						<h5>Delete {option.label}</h5>
						<p className="mb-0">
							You cannot undo this action. Are you sure you want to delete this option?
						</p>
					</div>
					<div className="modal-footer flex-nowrap p-0">
						<button onClick={onClose} type="button" className="btn text-primary fs-6 col-6 m-0 border-end">
							No, cancel
						</button>
						<button
							type="button"
							disabled={loading}
							className="btn text-light fs-6 col-6 m-0"
							data-bs-dismiss="modal"
							onClick={handleDelete}
						>
							{loading ? (
								<div className="d-flex justify-content-center">
									<div className="spinner-border text-blue" role="status"></div>
								</div>
							) : <strong>Yes, delete</strong>}
						</button>
					</div>
				</div>
			</div>
		</div>
    );
};