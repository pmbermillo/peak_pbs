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

const Estimate = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const columns = [
		{ 
            header: "Details", 
            children: [
                ...(["ADMIN", "REVIEWER", "SPECIALIST"].includes(user?.permission) ? [
                { header: "Action", accessor: "action",
                    renderCell: (_, row) => (
                        <div className="flex gap-2">
                            {/* Edit Button */}
                            {editingRowId === row.id ? (
                                <>
                                {/* Save Button */}
                                <button
                                    title="Save"
                                    onClick={() => {
                                    handleSave(row.id, editFormData);
                                    }}
                                    className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                    <CheckIcon className="h-5 w-5" />
                                </button>

                                {/* Cancel Button */}
                                <button
                                    onClick={() => setEditingRowId(null)}
                                    title="Cancel"
                                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                                </>
                            ) : (
                                <>
                                {/* Edit Button */}
                                <button
                                    title="Edit"
                                    onClick={() => {
                                    setEditingRowId(row.id);
                                    setEditFormData(row); // preload row values
                                    }}
                                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>

                                {/* Delete Button */}
                                <button
                                    title="Delete"
                                    onClick={() => handleDelete(row.id)}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                </>
                            )}
                        </div>
                    )
                }] : []),
                { header: "Location", accessor: "location" },
                { header: "Budget Source", accessor: "budget_source" },
                { header: "Category", accessor: "category" },
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
                { header: "Created By", accessor: "created_by" },
                { header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
                { header: "Updated By", accessor: "updated_by" },
                { header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
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
            <div className="flex items-center gap-4">
                <div className="flex flex-col ">
                    <label htmlFor="year" className="text-sm font-semibold text-gray-700">
                    Select Year
                    </label>
                    <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    >
                    <option value="">-- Select Year --</option>
                    {years.map((yr) => (
                        <option key={yr} value={yr}>
                        {yr}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <button className="p-2" onClick={fetchData} title="Refresh Data">
                        <ArrowPathIcon className="h-5 w-5 text-gray-600 hover:text-blue-600 transition" />
                    </button>
                </div>
                <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-2 ml-auto">
                    <h2 className="text-xl font-semibold text-white text-center mb-6">
                        Upload File
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-300 
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-600 file:text-white
                                        hover:file:bg-blue-700 cursor-pointer"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleUpload}
                                title="Upload"
                                disabled={!file || uploading}
                                className={`w-full py-1 rounded-lg font-semibold transition
                                            flex items-center justify-center
                                            ${uploading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                >
                                {uploading ? (
                                    <ArrowPathIcon className="h-8 w-8 text-gray-200 animate-spin" />
                                ) : (
                                    <ArrowUpTrayIcon className="h-8 w-8 text-white" />
                                )}
                            </button>

                            {/* Progress bar */}
                            {uploading || progress > 0 ? (
                            <div>
                                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-3 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                                </div>
                                <p className="text-sm text-gray-300 mt-1 text-center">
                                {progress}%
                                </p>
                            </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div><br/>
            <Table title="Budget Estimate" columns={columns} data={dataBudget}/>
        </div>
    )
}

export default Estimate