

const DocumentSection = ({ onClick, document }: any) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
            onClick={onClick}
        >
            <iframe
                src={document}
                // sandbox=""
                title="Selected Document"
                className="w-full h-5/6 md:w-3/4 md:h-3/4"
                style={{
                    background: "#fff", // Ensure white background for text files
                    border: "none",
                    borderRadius: "10px",
                }}
            ></iframe>
        </div>
    );
};

export default DocumentSection;
