import { useChatContext } from "@/contexts/ChatContext";

const ImageList = ({ images }: {images: any[]}) => {
    const { setSelectedImage } = useChatContext();

    if (images.length === 0) return null;
    
    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "10px",
            }}
        >
            {images.map((image: any, index: any) => (
                <img
                    onClick={() => setSelectedImage(image)}
                    key={index}
                    src={image}
                    alt={image || "Conversation image"}
                    className="my-2"
                    style={{
                        cursor: "pointer",
                        maxWidth: "350px",
                        maxHeight: "450px",
                        borderRadius: "5px",
                    }}
                />
            ))}
        </div>
    );
}

export default ImageList