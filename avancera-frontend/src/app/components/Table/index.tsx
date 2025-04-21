"use client"

import React, { useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { deleteTaskReducer, allTaskReducer } from "@/app/store/actions/task.action";

type AppTableProps<T extends Record<string, any>> = {
    tableHeader: string[];
    tableData: T[];
    edit?: boolean;
    func?: (id: number) => void;
};

function AppTable<T extends Record<string, any>>({
    tableHeader,
    tableData,
}: AppTableProps<T>) {
    const [localData, setLocalData] = useState(tableData);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    
    const [filterText, setFilterText] = useState("");
    const [filterColumn, setFilterColumn] = useState("all");
    
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    React.useEffect(() => {
        setLocalData(tableData);
    }, [tableData]);

    const editData = (id: number) => {
        router.push(`/tasks/${id}/edit`);
    }

    const DetailPage = (id: number) => {
        router.push(`/tasks/${id}`);
    }

    const handleDelete = useCallback(async (id: number) => {
        try {
            await dispatch(deleteTaskReducer(id));
            setLocalData(prevData => prevData.filter(item => item.id !== id));
            dispatch(allTaskReducer());
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }, [dispatch]);

    const filteredData = useMemo(() => {
        return localData.filter(row => {
            if (filterText === "") return true;
            
            if (filterColumn === "all") {
                return Object.values(row).some(value => 
                    String(value).toLowerCase().includes(filterText.toLowerCase())
                );
            } else {
                const columnValue = row[filterColumn];
                return columnValue && String(columnValue).toLowerCase().includes(filterText.toLowerCase());
            }
        });
    }, [localData, filterText, filterColumn]);

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;
        
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            
            if (aValue === bValue) return 0;
            
            const comparison = aValue < bValue ? -1 : 1;
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const getStatusChipClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const visibleHeaders = tableHeader.filter(header => 
        header.toLowerCase() !== 'id'
    );

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <div className="p-4 bg-white border-b flex flex-wrap gap-4 items-center">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <select
                        className="px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterColumn}
                        onChange={(e) => setFilterColumn(e.target.value)}
                    >
                        <option value="all">All Columns</option>
                        {visibleHeaders.map((header, index) => (
                            <option key={index} value={header.toLowerCase()}>
                                {header}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="ml-auto text-sm text-gray-500">
                    Showing {paginatedData.length} of {sortedData.length} tasks
                </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        {visibleHeaders.map((header, index) => (
                            <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                key={index}
                                onClick={() => handleSort(header.toLowerCase())}
                            >
                                <div className="flex items-center">
                                    {header}
                                    {sortColumn === header.toLowerCase() && (
                                        <span className="ml-1">
                                            {sortDirection === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                            </td>
                            
                            {Object.entries(row).map(([key, value], index) => {
                                if (key === 'id') return null;
                                
                                if (key.toLowerCase() === 'status') {
                                    return (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm" key={index}>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(String(value))}`}>
                                                {String(value)}
                                            </span>
                                        </td>
                                    );
                                }
                                
                                return (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" key={index}>
                                        {String(value)}
                                    </td>
                                );
                            })}
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => DetailPage(row.id)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors duration-150"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => editData(row.id)}
                                        className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md transition-colors duration-150"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(row.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * rowsPerPage, sortedData.length)}
                                </span>{' '}
                                of <span className="font-medium">{sortedData.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">First</span>
                                    <span>«</span>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <span>‹</span>
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === pageNum
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <span>›</span>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Last</span>
                                    <span>»</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppTable;
