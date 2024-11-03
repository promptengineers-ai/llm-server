import { useChatContext } from "@/contexts/ChatContext";
import DocumentIcon from "../icons/DocumentIcon";
import { useAppContext } from "@/contexts/AppContext";
import CollapseIcon from "../icons/CollapseIcon";
import ExpandIcon from "../icons/ExpandIcon";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SourceCard = ({ source, noContent, index }: { source: any, noContent: boolean, index: number }) => {
    const {isMobile} = useAppContext();
    const {expand, setExpand, handleDocumentClick,} = useChatContext();

    return (
        <div
            key={source.id}
            className="relative overflow-hidden rounded-xl border border-token-border-dark bg-white"
        >
            <div className="p-2 w-52">
                <div className="flex flex-row items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                        <DocumentIcon />
                    </div>
                    <div className="overflow-hidden">
                        <div className="truncate font-medium">
                            {source.name}
                        </div>
                        <div className="truncate text-token-text-tertiary">
                            {source.type.split("/")[1].toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-1 right-2 flex gap-1">
                {!isMobile() &&
                    !noContent &&
                    (expand ? (
                        <div onClick={() => setExpand(!expand)}>
                            <CollapseIcon size="18" />
                        </div>
                    ) : (
                        <div onClick={() => setExpand(!expand)}>
                            <ExpandIcon size="18" />
                        </div>
                    ))}
                {noContent ? (
                    <FaRegEye
                        size="18"
                        className="cursor-pointer"
                        onClick={() => handleDocumentClick(index, source)}
                    />
                ) : (
                    <FaRegEyeSlash
                        size="18"
                        className="cursor-pointer"
                        onClick={() => {
                            handleDocumentClick(index, source);
                            setExpand(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default SourceCard;