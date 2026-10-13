import React, { useState, useEffect} from 'react'
import Table from '../../Component/Table'
import {format} from 'date-fns';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, HandThumbUpIcon, ArrowPathIcon} from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";
import { GetBudgetRequest, UpdateBudget, DeleteBudgetRequest, ApproveBudgetRequest, RejectBudgetRequest} from '../../Api/Module/FormsApi';
import * as XLSX from "xlsx";

const BudgetRequestRecord = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const [dataBudgetRequest, setDataBudgetRequest] = useState([]);
    const currentYear = new Date().getFullYear();
	const years = [];
    const [formData, setFormData] = useState({
		year: currentYear,
	});
    const [editingRowId, setEditingRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const columns = [
        { 
            header: "Details", 
            children: [
                { 
                    header: "Action", 
                    accessor: "action", 
                    renderCell: (_, row) => (
                        <div className="flex gap-2">
                            {row.status !== "Processed" && row.status !== "Approved" && ["ADMIN", "REVIEWER", "APPROVER"].includes(user?.permission) && (
                            <button
                                title="Approval"
                                onClick={() => handleApproval(row.id)}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                <HandThumbUpIcon className="h-4 w-4" />
                            </button>
                            )}
                            {/* Edit Button */}
                            {editingRowId === row.id ?  
                            (
                                <>
                                {/* Save Button */}
                                {(
                                    (row.status === "Pending - Reviewer" && ["REQUESTOR", "APPROVER"].includes(user?.permission)) ||
                                    (row.status === "Approved" && ["SPECIALIST"].includes(user?.permission)) ||
                                    (["ADMIN"].includes(user?.permission))
                                ) && (
                                    <button
                                        title="Save"
                                        onClick={() => {
                                        handleSave(row.id, editFormData);
                                        }}
                                        className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                    </button>
                                )}
                                {/* Cancel Button */}
                                <button
                                    onClick={() => setEditingRowId(null)}
                                    title="Cancel"
                                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                                </>
                            ) : (
                                <>
                                {(
                                    (row.status === "Pending - Reviewer" && ["REQUESTOR", "APPROVER"].includes(user?.permission)) ||
                                    (row.status === "Approved" && ["SPECIALIST"].includes(user?.permission)) ||
                                    (["ADMIN"].includes(user?.permission))
                                ) && (
                                    <button
                                        title="Edit"
                                        onClick={() => {
                                        setEditingRowId(row.id);
                                        setEditFormData(row); // preload row values
                                        }}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                )}
                                {(
                                    (row.status == "Pending - Reviewer" && ["REQUESTOR", "APPROVER"].includes(user?.permission)) ||
                                    (["ADMIN"].includes(user?.permission))
                                ) && (
                                    <button
                                        title="Delete"
                                        onClick={() => handleDelete(row.id)}
                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}
                                </>
                            )}
                            
                        </div>            
                    )
                },
                { header: "Unique ID", accessor: "unique_id" },
                { header: "Source Code", accessor: "source_code" },
                { header: "Status", accessor: "status",
                    renderCell: (value) => {
                        let colorClass = "bg-gray-100 text-gray-800";
                        switch (value) {
                            case "Pending - Reviewer":
                                colorClass = "bg-yellow-100 text-yellow-800";
                                break;
                            case "Pending - Approver":
                                colorClass = "bg-orange-100 text-orange-800";
                                break;
                            case "Pending - Second Approver":
                                colorClass = "bg-orange-100 text-orange-800";
                                break;
                            case "Pending - Final Approver":
                                colorClass = "bg-orange-100 text-orange-800";
                                break;
                            case "Approved":
                                colorClass = "bg-blue-100 text-blue-800";
                                break;
                            case "Processed":
                                colorClass = "bg-green-100 text-green-800";
                                break;
                            case "Rejected":
                                colorClass = "bg-red-100 text-red-800";
                                break;
                        }
                        return (
                            <span className={`inline-block px-2 py-1 text-s font-semibold rounded-full ${colorClass}`}>
                                {value}
                            </span>
                        );
                    }

                },
                { header: "Client Account", accessor: "client_account" },
                { header: "Project", accessor: "project" },
                { header: "Category", accessor: "category" },
                { header: "Classification", accessor: "classification" },
                { header: "Location", accessor: "location" },
                { header: "Budget Source", accessor: "budget_source" },
                { header: "Expense Account", accessor: "expense_account" },
                { header: "Date Needed", accessor: "date_needed" },
                { header: "Mode of Payment", accessor: "payment" },
                { header: "Amount", accessor: "amount",
                    renderCell: (value, row, accessor) => (
                        <div>
                        {
                            ["REQUESTOR","ADMIN", "APPROVER"].includes(user?.permission)
                            ? (
                                editingRowId === row.id ? (
                                <input
                                    type="text"
                                    value={editFormData[accessor] ?? value ?? ""}
                                    onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        [accessor]: e.target.value
                                    }))
                                    }
                                    className="border px-2 py-1 rounded-md text-sm w-full"
                                />
                                ) : (
                                value
                                )
                            )
                            : value
                        }
                        </div>
                    )
                },
                { header: "Purpose", accessor: "purpose",
                    renderCell: (value, row, accessor) => (
                        <div>
                        {
                            ["REQUESTOR","ADMIN", "APPROVER"].includes(user?.permission)
                            ? (
                                editingRowId === row.id ? (
                                <input
                                    type="text"
                                    value={editFormData[accessor] ?? value ?? ""}
                                    onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        [accessor]: e.target.value
                                    }))
                                    }
                                    className="border px-2 py-1 rounded-md text-sm w-full"
                                />
                                ) : (
                                value
                                )
                            )
                            : value
                        }
                        </div>
                    )
                },
                {
                    header: "Attachment",
                    accessor: "attachment",
                    renderCell: (value) => {
                        if (!value) return "—";
                        
                        const fileUrl = `http://127.0.0.1:8000/image/uploads/${value}`;

                        return (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            View
                        </a>
                        );
                    }
                },
                { header: "Requested By", accessor: "created_by" },
                { header: "Date Requested", accessor: "created_at", renderCell: (value) => format(new Date(value), "yyyy-MM-dd HH:mm") },
                { header: "Date Updated", accessor: "updated_at", renderCell: (value) => format(new Date(value), "yyyy-MM-dd HH:mm")},
            ] 
        },  
        { 
            header: "Reviewer", 
            children: [
                { header: "Reviewed By", accessor: "reviewed_by", renderCell: (value) => value ?? "" },
                { header: "Date Reviewed", accessor: "reviewed_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "" },
            ] 
        },
        { 
            header: "First Approver", 
            children: [
                { header: "Approved By", accessor: "first_approver", renderCell: (value) => value ?? "" },
                { header: "Date Approved", accessor: "first_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "" },
            ] 
        }, 
        { 
            header: "Second Approver", 
            children: [
                { header: "Approved By", accessor: "second_approver", renderCell: (value) => value ?? "" },
                { header: "Date Approved", accessor: "second_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "" },
            ] 
        },  
        { 
            header: "Final Approver", 
            children: [
                { header: "Approved By", accessor: "third_approver", renderCell: (value) => value ?? "" },
                { header: "Date Approved", accessor: "third_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "" },
            ] 
        },  
        { 
            header: "Accounting Specialist", 
            children: [
                {
                    header: "Actual Amount ($)",
                    accessor: "actual_amount",
                    renderCell: (value, row, accessor) => (
                        <div className={value != null ? "bg-green-100 px-2 py-1 rounded text-center" : "bg-red-100 px-2 py-1 rounded text-center"}>
                        {
                            ["SPECIALIST","ADMIN"].includes(user?.permission)
                            ? (
                                editingRowId === row.id ? (
                                <input
                                    type="text"
                                    value={editFormData[accessor] ?? value ?? ""}
                                    onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        [accessor]: e.target.value
                                    }))
                                    }
                                    className="border px-2 py-1 rounded-md text-sm w-full"
                                />
                                ) : (
                                value
                                )
                            )
                            : value
                        }
                        </div>
                    )
                },
                { 
                    header: "QBO Reference", 
                    accessor: "qbo_reference", 
                    renderCell: (value, row, accessor) => (
                        <div className={value != null ? "bg-green-100 px-2 py-1 rounded text-center" : "bg-red-100 px-2 py-1 rounded text-center"}>
                            {
                                ["SPECIALIST","ADMIN"].includes(user?.permission)
                                ? (
                                    editingRowId === row.id ? (
                                    <input
                                        type="text"
                                        value={editFormData[accessor] ?? value ?? ""}
                                        onChange={(e) =>
                                        setEditFormData((prev) => ({
                                            ...prev,
                                            [accessor]: e.target.value
                                        }))
                                        }
                                        className="border px-2 py-1 rounded-md text-sm w-full"
                                    />
                                    ) : (
                                    value
                                    )
                                )
                                : value
                            }
                        </div>
                    )
                },
                {   header: "Updated At", 
                    accessor: "confirmed_at", 
                    renderCell: (value, row, accessor) => (
                    <div className={value != null ? "bg-green-100 px-2 py-1 rounded text-center" : "bg-red-100 px-2 py-1 rounded text-center"}>
                        {
                            ["SPECIALIST","ADMIN"].includes(user?.permission)
                            ? (
                                editingRowId === row.id ? (
                                <input
                                    type="date"
                                    value={
                                    (
                                        editFormData[accessor] ??
                                        (value ? value.replace(" ", "T") : "") // convert "2025-01-24 10:33:00" → "2025-01-24T10:33"
                                    )
                                    }
                                    onChange={(e) =>
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        [accessor]: e.target.value
                                    }))
                                    }
                                    className="border px-2 py-1 rounded-md text-sm w-full"
                                />
                                ) : (
                                value ?? ""
                                )
                            )
                            : value ?? ""
                        }
                    </div>
                )},
                { header: "Updated By", accessor: "updated_by", renderCell: (value) => (
                    <div className={value != null ? "bg-green-100 px-2 py-1 rounded text-center" : "bg-red-100 px-2 py-1 rounded text-center"}>
                    {value ?? ""}
                    </div>
                )},
            ] 
        },        
    ];

    const handleSave = async (id, updatedRow) => {
        try {
            const response = await UpdateBudget(updatedRow);
            if(response.data[0].actual_amount > response.data[0].amount) 
            {
                try {
                    MySwal.fire({
                        title: "Please ensure that the re-alignment has been processed. The actual amount entered is higher than the approved budget.",
                        // text: "This action cannot be undone!",
                        icon: "warning",
                        // showCancelButton: true,
                        confirmButtonColor: "#28a745",
                        // cancelButtonColor: "#d33",
                        confirmButtonText: "OK",
                        // cancelButtonText: "No, cancel",
                    })
                } 
                catch (error) {
                    console.error('Error showing confirmation dialog:', error);
                    toast.error('Failed to show confirmation dialog.');
                }
            }
            console.log(response);
            toast.success(response.data.message);
            await fetchBudgetRequest(); // refresh table
            setEditingRowId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to update budget request.'
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
                        const response = await DeleteBudgetRequest({id}); // your API call
                        toast.success(response.data.message);
                        await fetchBudgetRequest(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete budget request");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to budget request.'
            );
        }
    }

    const handleApproval = (id) => {
        try {
            MySwal.fire({
                title: "Are you sure you want to approve or reject this item?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: true, // 👈 adds the Reject button
                confirmButtonText: "Approve",
                denyButtonText: "Reject",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#28a745", // green for approve
                denyButtonColor: "#d33",       // red for reject
                cancelButtonColor: "#6c757d",  // gray for cancel
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await ApproveBudgetRequest({ id });
                        if (response.data.status === "success") {
                            toast.success(response.data.message);
                            await fetchBudgetRequest();
                        } else {
                            toast.error(response.data.message);
                        }
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to approve request");
                    }
                } else if (result.isDenied) {
                    try {
                        const response = await RejectBudgetRequest({ id }); // 👈 your reject API
                        toast.success(response.data.message);
                        await fetchBudgetRequest();
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to reject request");
                    }
                }
            });
        } catch (error) {
            console.error('Error item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to approve the request.'
            );
        }
    }

    const fetchBudgetRequest = async () => {
        try {
            const response = await GetBudgetRequest(formData);
            if (response && response.data) {
                setDataBudgetRequest(response.data[0]);
            }
            toast.success("Budget Request data fetched successfully.");
        } catch (error) {
            console.error("Error fetching budget request:", error);
        }
    }

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dataBudgetRequest);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Budget Requests");
        XLSX.writeFile(workbook, `Budget_Requests_${formData.year}.xlsx`);
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;

		setFormData((prev) => {
			const updated = {
			...prev,
			[name]: files ? files[0] : value,
			};
            return updated;
		});
    }

    useEffect(() => {
        fetchBudgetRequest();
    }, []); 

    for (let year = 2000; year <= currentYear + 5; year++) {
        years.push(year);
    }

    return (
        <div>
            <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {/* Year Selection */}
                <div className="flex min-w-[180px] flex-col gap-1.5">
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
                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="">Select Year</option>

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
                    onClick={fetchBudgetRequest}
                    title="Refresh Data"
                    aria-label="Refresh data"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-95"
                >
                    <ArrowPathIcon className="h-5 w-5 transition-transform duration-300 hover:rotate-180" />
                </button>
            </div>
            <br/>
            <Table title="Budget Request" columns={columns} data={dataBudgetRequest} />
        </div>
    )
}

export default BudgetRequestRecord