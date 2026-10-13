import React, { useState, useEffect, useMemo } from "react";
import { UploadFile } from '../../Api/Module/DashboardApi';
import { GetBudget } from '../../Api/Module/DashboardApi';
import { UpdateBudget } from '../../Api/Module/DashboardApi';
import { DeleteBudget } from '../../Api/Module/DashboardApi';
import {format} from 'date-fns';
import Table from '../../Component/Table'
import {
	ArrowPathIcon, ArrowUpTrayIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon
	} from "@heroicons/react/24/outline"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { useUser } from "../Auth/UserContext";
import ExcelUploadModal from "../../Component/ExcelUploadModal";
import * as XLSX from "xlsx";

const Estimate = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);
    const columns = [
		{ 
            header: "Details", 
            children: [
                ...(["ADMIN", "REVIEWER", "SPECIALIST"].includes(user?.permission) ? [
                {
                    header: "Action",
                    accessor: "action",
                    renderCell: (_, row) => {
                        const isAdmin = user?.permission === "ADMIN";
                        const isAllowedRole = ["ADMIN", "REVIEWER", "SPECIALIST"].includes(
                        user?.permission
                        );
                        const isDisabled = row.status === "Disabled";

                        return (
                        <div className="flex gap-2">
                            {editingRowId === row.id ? (
                            <>
                                {/* Save Button */}
                                <button
                                title="Save"
                                onClick={() => handleSave(row.id, editFormData)}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                <CheckIcon className="h-5 w-5" />
                                </button>

                                {/* Cancel Button */}
                                <button
                                title="Cancel"
                                onClick={() => setEditingRowId(null)}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                <XMarkIcon className="h-5 w-5" />
                                </button>
                            </>
                            ) : (
                            <>
                                {/* Edit / Delete buttons */}
                                {isAllowedRole && (!isDisabled || isAdmin) && (
                                <>
                                    {/* Edit Button */}
                                    <button
                                    title="Edit"
                                    onClick={() => {
                                        setEditingRowId(row.id);
                                        setEditFormData(row);
                                    }}
                                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                    <PencilIcon className="h-4 w-4" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                    title="Delete"
                                    onClick={() => handleDelete(row.id)}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                    <TrashIcon className="h-4 w-4" />
                                    </button>
                                </>
                                )}
                            </>
                            )}
                        </div>
                        );
                    },
                }] : []),
                { header: "Budget Source Code", accessor: "source_code" },
                { header: "Location", accessor: "location" },
                { header: "Budget Source", accessor: "budget_source" },
                { header: "Category", accessor: "category" },
                { header: "Classification", accessor: "classification" },
                { header: "Project", accessor: "project" },
                { header: "Account", accessor: "expense_account" },
                { header: "Description", accessor: "purpose" },
                { header: "Budget Type", accessor: "budget_type" },
                { header: "Cost per Head", accessor: "cost_perhead" },
                { header: "Prioritization", accessor: "prioritization" },
            ] 
        },    
        {
            header: "January",
            children: [
                { header: "Locked In", accessor: "jan"},
                { header: "Adjustment", accessor: "jan_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "jan_calibrated" },
                { header: "Utilized", accessor: "jan_utilized" },
                { header: "Available", accessor: "jan_available" },
            ],
        },
        {
            header: "February",
            children: [
                { header: "Locked In", accessor: "feb" },
                { header: "Adjustment", accessor: "feb_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "feb_calibrated" },
                { header: "Utilized", accessor: "feb_utilized" },
                { header: "Available", accessor: "feb_available" },
            ],
        },
        {
            header: "March",
            children: [
                { header: "Locked In", accessor: "mar" },
                { header: "Adjustment", accessor: "mar_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "mar_calibrated" },
                { header: "Utilized", accessor: "mar_utilized" },
                { header: "Available", accessor: "mar_available" },
            ],
        },
        {
            header: "April",
            children: [
                { header: "Locked In", accessor: "apr" },
                { header: "Adjustment", accessor: "apr_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "apr_calibrated" },
                { header: "Utilized", accessor: "apr_utilized" },
                { header: "Available", accessor: "apr_available" },
            ],
        },
        {
            header: "May",
            children: [
                { header: "Locked In", accessor: "may" },
                { header: "Adjustment", accessor: "may_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "may_calibrated" },
                { header: "Utilized", accessor: "may_utilized" },
                { header: "Available", accessor: "may_available" },
            ],
        },
        {
            header: "June",
            children: [
                { header: "Locked In", accessor: "jun" },
                { header: "Adjustment", accessor: "jun_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "jun_calibrated" },
                { header: "Utilized", accessor: "jun_utilized" },
                { header: "Available", accessor: "jun_available" },
            ],
        },
        {
            header: "July",
            children: [
                { header: "Locked In", accessor: "jul" },
                { header: "Adjustment", accessor: "jul_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "jul_calibrated" },
                { header: "Utilized", accessor: "jul_utilized" },
                { header: "Available", accessor: "jul_available" },
            ],
        },
        {
            header: "August",
            children: [
                { header: "Locked In", accessor: "aug" },
                { header: "Adjustment", accessor: "aug_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "aug_calibrated" },
                { header: "Utilized", accessor: "aug_utilized" },
                { header: "Available", accessor: "aug_available" },
            ],
        },
        {
            header: "September",
            children: [
                { header: "Locked In", accessor: "sep"},
                { header: "Adjustment", accessor: "sep_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "sep_calibrated" },
                { header: "Utilized", accessor: "sep_utilized" },
                { header: "Available", accessor: "sep_available" },
            ],
        },
        {
            header: "October",
            children: [
                { header: "Locked In", accessor: "oct" },
                { header: "Adjustment", accessor: "oct_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "oct_calibrated" },
                { header: "Utilized", accessor: "oct_utilized" },
                { header: "Available", accessor: "oct_available" },
            ],
        },
        {
            header: "November",
            children: [
                { header: "Locked In", accessor: "nov" },
                { header: "Adjustment", accessor: "nov_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "nov_calibrated" },
                { header: "Utilized", accessor: "nov_utilized" },
                { header: "Available", accessor: "nov_available" },
            ],
        },
        {
            header: "December",
            children: [
                { header: "Locked In", accessor: "dec" },
                { header: "Adjustment", accessor: "dec_adjustment",
                    renderCell: (value, row, accessor) =>
                    editingRowId === row.id ? (
                        <input
                        type="text"
                        value={editFormData[accessor] ?? value ?? ""} // ✅ fallback to current value if editFormData is empty
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        />
                    ) : (
                        value
                    )
                },
                { header: "Calibrated", accessor: "dec_calibrated" },
                { header: "Utilized", accessor: "dec_utilized" },
                { header: "Available", accessor: "dec_available" },
            ],
        },
        { 
            header: "Other details", 
            children: [
                { header: "Total", accessor: "total" },
                { header: "Created By", accessor: "created_by" },
                { header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
                { header: "Updated By", accessor: "updated_by" },
                { header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
                { header: "Status", accessor: "status",
                    renderCell: (value, row, accessor) => 
                    editingRowId === row.id ? (
                        <select
                        value={editFormData[accessor] ?? value ?? ""}
                        onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, [accessor]: e.target.value }))
                        }
                        className="border px-2 py-1 rounded-md text-sm w-full"
                        >
                            <option value="Enabled">Enabled</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    ) : (
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            value === "Enabled" ? "bg-green-200 text-green-800" :
                            value === "Disabled" ? "bg-red-200 text-red-800" :
                            "bg-gray-200 text-gray-800"
                        }`}>
                            {value}
                        </span>
                    )
                },
            ] 
        },   
	];
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dataBudget, setDataBudget] = useState([]);
    const currentYear = new Date().getFullYear();
	const years = [];
	const [formData, setFormData] = useState({
		year: currentYear,
	})

    for (let i = currentYear+3; i >= currentYear - 50; i--) {
		years.push(i);
	}

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            setProgress(0);
            const response = await UploadFile(formData);
            console.log(response);
            setProgress(100);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }

    };

    const fetchData = async () => {
        try {
            const response = await GetBudget(formData);
            if (response && response.data[0]) {
                setDataBudget(response.data[0]);
            }
            toast.success("Budget data fetched successfully.");
            console.log(response);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const exportExcel = async () => {
        try {
            const response = await GetBudget(formData);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(response.data[0]);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Budget Data");
            XLSX.writeFile(workbook, "budget_data.xlsx");
        } catch (error) {
            console.error("Error exporting Excel:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ 
        ...formData, 
        [name]: files ? files[0] : value 
        });

        fetchData();
    };

    const handleSave = async (id, updatedRow) => {
        try {
            const response = await UpdateBudget(updatedRow);
            console.log(response);
            toast.success(response.data.message);
            await fetchData(); // refresh table
            setEditingRowId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to budget.'
            );
        }
    };

    const handleDelete = (id) => {
        try {
            MySwal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await DeleteBudget({id}); // your API call
                        toast.success(response.data.message);
                        await fetchData(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete budget source");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to budget source.'
            );
        }
    }

    useEffect(() => {
        if (formData) {
            fetchData();
        }
    }, [formData]);

    return (
        <div>
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">

                {/* Left: Year Filter and Actions */}
                <div className="flex flex-wrap items-end gap-3">

                    {/* Year Selection */}
                    <div className="flex min-w-[170px] flex-col gap-1.5">
                        <label
                            htmlFor="year"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Select Year
                        </label>

                        <div className="relative">
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm transition duration-200 hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                            >
                                <option value="">-- Select Year --</option>

                                {years.map((yr) => (
                                    <option key={yr} value={yr}>
                                        {yr}
                                    </option>
                                ))}
                            </select>

                            <svg
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19 9-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Download Excel */}
                    <button
                        type="button"
                        onClick={exportExcel}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16V4m0 12 4-4m-4 4-4-4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
                            />
                        </svg>
                        Download Excel
                    </button>

                    {/* Refresh */}
                    <button
                        type="button"
                        onClick={fetchData}
                        title="Refresh Data"
                        aria-label="Refresh data"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-95"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Right: Upload File */}
                <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98]"
                >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    Upload File
                </button>
            </div>

            {/* Upload Modal */}
            <ExcelUploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                uploadFile={UploadFile}
                title="Upload Budget File"
            />
            <br/>
            <Table title="Budget Estimate" columns={columns} data={dataBudget}/>
        </div>
    )
}

export default Estimate