import SourceCard from "@/components/cards/SourceCard";

const SourceList = ({
    sources,
    noContent,
    messageIndex,
}: {
    sources: any[];
    noContent: boolean;
    messageIndex: number;
}) => {
    if (sources.length === 0) return null;

    return (
        <div
            key={messageIndex}
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: "10px",
            }}
            className="my-2"
        >
            {sources.map((source: any, index: number) => (
                <SourceCard
                    key={index}
                    source={source}
                    noContent={noContent}
                    index={messageIndex}
                />
            ))}
        </div>
    );
};

export default SourceList;
