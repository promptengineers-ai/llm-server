import React, { DetailedHTMLProps, HTMLAttributes } from "react";

// This will handle any extra props that might be passed to the code element by ReactMarkdown
interface ExtraProps {
    inline?: boolean;
    node?: any; // Adjust this based on the actual type used by ReactMarkdown for nodes
}

// We extend the basic HTML attributes for a <code> element
type CodeComponentProps = DetailedHTMLProps<
    HTMLAttributes<HTMLElement>,
    HTMLElement
> &
    ExtraProps;

const CodeComponent: React.FC<CodeComponentProps> = ({
    inline,
    className,
    node,
    ...props
}) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline ? (
        <pre className="my-2 p-4 bg-gray-200 rounded-md">
            <code className={`${className || ""} p-2`} {...props} />
        </pre>
    ) : (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
    );
};

export default CodeComponent;
