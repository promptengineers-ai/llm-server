import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import CopyCodeButton from "../buttons/CopyCodeButton";

const MarkdownCard = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold my-4" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-base font-bold my-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className={`py-1`} {...props} />
                ),
                code: (props) => {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                        <div className="text-white dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium">
                            <div className="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md">
                                <span>{match[0].replace("language-", "")}</span>
                                <div className="flex items-center">
                                    <span className="" data-state="closed">
                                        <CopyCodeButton />
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-y-auto text-left">
                                <code
                                    className="rounded px-1 py-0.5 font-bold"
                                    {...props}
                                />
                            </div>
                        </div>
                    ) : (
                        <code
                            className="rounded px-1 py-0.5 font-bold"
                            {...props}
                        />
                    );
                },
                ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 my-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                a: ({ node, ...props }) => (
                    <a
                        target="_blank"
                        className="text-blue-500 underline"
                        {...props}
                    />
                ),
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto">
                        <table
                            className="min-w-full bg-white border border-gray-300"
                            {...props}
                        />
                    </div>
                ),
                thead: ({ node, ...props }) => (
                    <thead className="bg-gray-200" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                    <tbody className="bg-white" {...props} />
                ),
                tr: ({ node, ...props }) => (
                    <tr
                        className="whitespace-nowrap border-b border-gray-200"
                        {...props}
                    />
                ),
                th: ({ node, ...props }) => (
                    <th
                        className="px-6 py-2 text-xs text-gray-500 border-r border-gray-200"
                        {...props}
                    />
                ),
                td: ({ node, ...props }) => (
                    <td
                        className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200"
                        {...props}
                    />
                ),
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeRaw, rehypeHighlight]}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownCard;
