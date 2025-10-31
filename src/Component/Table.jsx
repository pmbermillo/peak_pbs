import React, { useState, useMemo } from 'react'

const Table = ({ title, columns, data, pageSizeOptions = [5, 10, 20]  }) => {
    const [filters, setFilters] = useState({});
    const [globalSearch, setGlobalSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

    // Update filter value
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    // Filtered data
    const filteredData = useMemo(() => {

        // ⬅️ Added: recursive function to flatten any depth of nested columns
        const flattenColumns = (cols) =>
            cols.flatMap(col =>
                col.children ? flattenColumns(col.children) : col
            );

        // ⬅️ Changed: use recursive flattenColumns() instead of .flatMap()
        const flatColumns = flattenColumns(columns);

        return data.filter((row) => {
            // Global search
            if (globalSearch) {
                const matchesGlobal = flatColumns.some((col) =>
                    String(row[col.accessor] ?? "")
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase())
                );
                if (!matchesGlobal) return false;
            }

            // Per-column filter
            return flatColumns.every((col) => {
                if (!col || !col.accessor) return true; // skip invalid columns

                const filterValue = filters?.[col.accessor];
                if (!filterValue) return true;

                return String(row[col.accessor] ?? "")
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });
        });
    }, [data, filters, globalSearch, columns]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    return (
        <div className="p-4">
            {/* Title & Global Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <input
                type="text"
                placeholder="Search table..."
                value={globalSearch}
                onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setCurrentPage(1);
                }}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div className="overflow-y-auto max-h-[500px] shadow-md rounded-2xl">
                <table className="min-w-max border-collapse text-sm text-center relative">
                    <thead className="bg-gray-100">
                        {/* First row: month headers */}
                        <tr>
                            {columns.map((group, groupIndex) => {
                            const isSticky = groupIndex < 3; // optional: adjust logic for groups
                            const leftValue = groupIndex * 120 * (group.children ? group.children.length : 1);

                            return (
                                <th
                                key={group.header}
                                colSpan={(group.children ? group.children.length : 1)}
                                className={`px-4 py-3 font-semibold text-gray-700 border border-gray-300`}
                                // style={{
                                //     minWidth: `${group.children.length * 120}px`,
                                //     left: isSticky ? `${leftValue}px` : undefined,
                                // }}
                                >
                                {group.header}
                                </th>
                            );
                            })}
                        </tr>

                        {/* Second row: child headers + filter inputs */}
                        <tr>
                            {columns.flatMap((group, groupIndex) =>
                            group.children?.map((col, colIndex) => {
                                const isSticky = colIndex < 3 && groupIndex === 0; // adjust sticky logic
                                const leftValue = (colIndex + groupIndex * (group.children ? group.children.length : 1)) * 120;

                                return (
                                <th
                                    key={col.accessor}
                                    className={`px-4 py-3 font-semibold text-gray-700 border border-gray-300 ${
                                    isSticky ? "sticky left-0 bg-gray-100 z-10" : ""
                                    }`}
                                    style={{
                                    minWidth: "120px",
                                    left: isSticky ? `${leftValue}px` : undefined,
                                    }}
                                >
                                    <div className="flex flex-col">
                                    <span>{col.header}</span>
                                    <input
                                        type="text"
                                        placeholder={`Filter ${col.header}`}
                                        value={filters[col.accessor] || ""}
                                        onChange={(e) =>
                                        handleFilterChange(col.accessor, e.target.value)
                                        }
                                        className="mt-1 p-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    </div>
                                </th>
                                );
                            })
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {(paginatedData || []).length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition">
                                {(columns || []).flatMap((group, groupIndex) => {
                                const children = group.children || [group]; // flat columns become a single “child”
                                return children.map((col, colIndex) => {
                                    const isSticky = colIndex < 3 && groupIndex === 0;
                                    const leftValue =
                                    (colIndex + (groupIndex * (group.children?.length || 1))) * 120;

                                    return (
                                    <td
                                        key={col?.accessor || `cell-${rowIndex}-${colIndex}`}
                                        className={`px-4 py-3 text-gray-700 border border-gray-300 ${
                                        isSticky ? "sticky bg-white z-0" : ""
                                        }`}
                                        style={{
                                        minWidth: "120px",
                                        left: isSticky ? `${leftValue}px` : undefined,
                                        }}
                                    >
                                        {col?.renderCell
                                        ? col.renderCell(row[col?.accessor], row, col?.accessor)
                                        : row[col?.accessor] ?? "-"}
                                    </td>
                                    );
                                });
                                })}
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={(columns || []).reduce(
                                    (sum, group) => sum + ((group?.children?.length) || 1),
                                    0
                                    )}
                                    className="px-4 py-3 text-center text-gray-500"
                                >
                                    No matching results
                                </td>
                            </tr>
                        )}
                        </tbody>
                </table>
            </div>

             {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                {/* Page Size */}
                <div className="flex items-center gap-2 text-sm">
                <span>Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                    }}
                    className="border rounded-md p-1 text-sm"
                >
                    {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                    ))}
                </select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                    Next
                </button>
                </div>
            </div>
        </div>
    )
}

export default Table