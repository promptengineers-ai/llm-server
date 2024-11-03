
const ViewImagesSection = ({onClick, image}: any) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
            style={{ zIndex: 1000 }}
            onClick={onClick}
        >
            <img
                src={image}
                alt="Enlarged content"
                className="max-w-full max-h-full"
                style={{ borderRadius: "10px" }}
            />
        </div>
    );
}

export default ViewImagesSection;