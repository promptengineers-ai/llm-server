

const DocumentSection = ({ onClick, document, expand = false }: any) => {

    
    return (
        <iframe
            src={document}
            // sandbox=""
            title="Selected Document"
            className={
                expand ? "w-full h-full" : "w-full h-5/6 md:w-3/4 md:h-3/4"
            }
            style={{
                background: "#fff", // Ensure white background for text files
                border: "none",
                borderRadius: "10px",
            }}
        ></iframe>
    );
};

export default DocumentSection;
