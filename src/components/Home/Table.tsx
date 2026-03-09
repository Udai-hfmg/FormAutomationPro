import React from "react";

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
    // accept either "column" (as requested) or the more common "columns"
    column?: Column<T>[];
    columns?: Column<T>[];
    rowKey?: keyof T | RowKeyFn<T>;
    className?: string;
    style?: React.CSSProperties;
}

export default function Table<T extends Record<string, any>>({
    data,
    column,
    columns,
    rowKey,
    className,
    style,
}: TableProps<T>) {
    const cols = column ?? columns ?? [];

    const getRowKey = (row: T, index: number) => {
        if (typeof rowKey === "function") return rowKey(row, index);
        if (typeof rowKey === "string" && rowKey in row) return String(row[rowKey]);
        if ("id" in row) return String((row as any).id);
        return String(index);
    };

    return (
        <table className={className} style={{ width: "100%", borderCollapse: "collapse", ...style }}>
            <thead style={{ background: "#f6f7f8" }}>
                <tr>
                    {cols.map((col, ci) => (
                        <th
                            key={String(col.key) + ci}
                            className="p-5 bg-[#c9e2fc]"
                        >
                            {col.title ?? String(col.key)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, ri) => (
                    <tr key={getRowKey(row, ri)}>
                        {cols.map((col, ci) => {
                            const raw = (col.key as keyof T) in row ? (row as any)[col.key as keyof T] : undefined;
                            const content = col.render ? col.render(raw, row, ri) : (raw ?? "");
                            return (
                                <td
                                    key={String(col.key) + ci}
                                    className="p-5 px-8 border-t border-gray-300"
                                >
                                    {content}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}