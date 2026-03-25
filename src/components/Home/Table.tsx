import React, { useState } from "react";

type Column<T> = {
    key: keyof T | string;
    title?: React.ReactNode;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    width?: number | string;
    align?: "left" | "center" | "right";
};

type RowKeyFn<T> = (row: T, index: number) => string;

interface TableProps<T> {
    data: T[];
    column?: Column<T>[];
    columns?: Column<T>[];
    rowKey?: keyof T | RowKeyFn<T>;
    className?: string;
    style?: React.CSSProperties;
    pageSize?: number;
}

export default function Table<T extends Record<string, any>>({
    data,
    column,
    columns,
    rowKey,
    className,
    style,
    pageSize = 7,
}: TableProps<T>) {
    const cols = column ?? columns ?? [];
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getRowKey = (row: T, index: number) => {
        if (typeof rowKey === "function") return rowKey(row, index);
        if (typeof rowKey === "string" && rowKey in row) return String(row[rowKey]);
        if ("id" in row) return String((row as any).id);
        return String(index);
    };

    return (
        <div>
            <table
                className={className}
                style={{ width: "100%", borderCollapse: "collapse", ...style, tableLayout: "fixed" }}
            >
                <thead style={{ background: "#f6f7f8" }}>
                    <tr>
                        {cols.map((col, ci) => (
                            <th 
                                key={String(col.key) + ci} 
                                className="p-5 bg-[#c9e2fc]"
                                style={{ width: col.width, textAlign: col.align || "left" }}
                            >
                                {col.title ?? String(col.key)}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.map((row, ri) => (
                        <tr key={getRowKey(row, ri)}>
                            {cols.map((col, ci) => {
                                const raw =
                                    (col.key as keyof T) in row
                                        ? (row as any)[col.key as keyof T]
                                        : undefined;

                                const content = col.render
                                    ? col.render(raw, row, ri)
                                    : raw ?? "";

                                return (
                                    <td
                                        key={String(col.key) + ci}
                                        className="p-5 px-8 border-t border-gray-300"
                                        style={{ width: col.width, textAlign: col.align || "left" }}
                                    >
                                        {content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 px-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${
                                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() =>
                        setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
