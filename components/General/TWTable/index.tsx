import React from 'react';

export const Table: React.FC = ({ children }) => {
    return (
        <div className="flex flex-col overflow-hidden">
            <div className="overflow-x-scroll">
                <div className="py-2 align-middle inline-block min-w-full">
                    <div className="shadow border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">{children}</table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TableHeader: React.FC = ({ children }) => {
    return (
        <thead className="bg-gray-50">
            <tr>
                {React.Children.map(children, (child, index) => (
                    <th
                        key={`header_${index}`}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                        {child}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

interface TableRowProps {
    rowNumber: number;
}

export const TableRow: React.FC<TableRowProps> = ({ rowNumber, children }) => {
    return (
        <tbody>
            <tr className={rowNumber % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {React.Children.map(children, (child, index) => (
                    <td
                        key={`cell_${rowNumber}_${index}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                        {child}
                    </td>
                ))}
            </tr>
        </tbody>
    );
};
