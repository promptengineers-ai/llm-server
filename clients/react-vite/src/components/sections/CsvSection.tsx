
const CsvSection = ({ onClick, content }: any) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
            onClick={onClick}
        >
            <div className="bg-white rounded-lg max-w-full h-5/6 overflow-auto">
                <table className="table-auto w-full border-collapse border border-gray-400 text-sm">
                    <thead>
                        <tr>
                            {content[0].map((header: string, index: number) => (
                                <th
                                    key={index}
                                    className="border border-gray-300 px-1 py-0.5"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {content.slice(1).map((row: any, rowIndex: number) => (
                            <tr key={rowIndex}>
                                {row.map((cell: any, cellIndex: number) => (
                                    <td
                                        key={cellIndex}
                                        className="border border-gray-300 px-1 py-0.5"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CsvSection;
