
const defaultStyle = {
    background: "#fff",
    border: "none",
    borderRadius: "10px",
}

const DocumentSection = ({
    document,
    expand = false,
    style,
}: any) => {
    return (
        <iframe
            src={document}
            // sandbox=""
            title="Selected Document"
            className={
                expand ? "w-full h-full" : "w-full h-5/6 md:w-3/4 md:h-3/4"
            }
            style={style ? style : defaultStyle}
        ></iframe>
    );
};

export default DocumentSection;
