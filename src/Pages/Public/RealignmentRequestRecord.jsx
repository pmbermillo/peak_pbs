import React, { useState, useEffect} from 'react'
import Table from '../../Component/Table'
import {format} from 'date-fns';
import { GetRealignmentRequest, ApproveRealignmentRequest, RejectRealignmentRequest, UpdateRealignment, DeleteRealignmentRequest} from '../../Api/Module/FormsApi';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, HandThumbUpIcon, ArrowPathIcon} from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import { useUser } from "../Auth/UserContext";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as XLSX from "xlsx";

const RealignmentRequestRecord = () => {
    const { user } = useUser();
    const MySwal = withReactContent(Swal);
    const currentYear = new Date().getFullYear();
    const [dataRequest, setDataRequest] = useState([]);
    const years = [];
    const [formData, setFormData] = useState({
        year: currentYear,
    });
    const [editingRowId, setEditingRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const columns = [
        {
            header: "Action",
            children: [
                { 
                    header: "", 
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
                                    (row.status != "Approved" && ["ADMIN"].includes(user?.permission))
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
                                    (row.status != "Approved" && ["ADMIN"].includes(user?.permission))
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
                                colorClass = "bg-green-100 text-green-800";
                                break;
                            case "Rejected - Reviewer":
                                colorClass = "bg-red-100 text-red-800";
                                break;
                            case "Rejected - Approval":
                                colorClass = "bg-red-100 text-red-800";
                                break;
                            case "Rejected - Second Approval":
                                colorClass = "bg-red-100 text-red-800";
                                break;
                            case "Rejected - Final Approval":
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
            ],
        },
        {
            header: "Source Code",
            children: [
                { header: "From", accessor: "source_code_from" },
                { header: "To", accessor: "source_code_to" },
            ]
        },
        {
            header: "Month",
            children: [
                {
                    header: "From",
                    accessor: "month_from",
                    renderCell: (value, row, accessor) => {

                        const months = {
                            jan: "January",
                            feb: "February",
                            mar: "March",
                            apr: "April",
                            may: "May",
                            jun: "June",
                            jul: "July",
                            aug: "August",
                            sep: "September",
                            oct: "October",
                            nov: "November",
                            dec: "December",
                        };

                        return (
                            <div>
                                {
                                    ["REQUESTOR","ADMIN", "APPROVER"].includes(user?.permission)
                                    ? (
                                        editingRowId === row.id ? (
                                            <select
                                                value={editFormData[accessor] ?? value ?? ""}
                                                onChange={(e) =>
                                                    setEditFormData((prev) => ({
                                                        ...prev,
                                                        [accessor]: e.target.value
                                                    }))
                                                }
                                                className="border px-2 py-1 rounded-md text-sm w-full"
                                            >
                                                {Object.entries(months).map(([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            months[value?.toLowerCase()] || value
                                        )
                                    )
                                    : (
                                        months[value?.toLowerCase()] || value
                                    )
                                }
                            </div>
                        );
                    }
                },
                {
                    header: "To",
                    accessor: "month_to",
                    renderCell: (value, row, accessor) => {

                        const months = {
                            jan: "January",
                            feb: "February",
                            mar: "March",
                            apr: "April",
                            may: "May",
                            jun: "June",
                            jul: "July",
                            aug: "August",
                            sep: "September",
                            oct: "October",
                            nov: "November",
                            dec: "December",
                        };

                        return (
                            <div>
                                {
                                    ["REQUESTOR","ADMIN", "APPROVER"].includes(user?.permission)
                                    ? (
                                        editingRowId === row.id ? (
                                            <select
                                                value={editFormData[accessor] ?? value ?? ""}
                                                onChange={(e) =>
                                                    setEditFormData((prev) => ({
                                                        ...prev,
                                                        [accessor]: e.target.value
                                                    }))
                                                }
                                                className="border px-2 py-1 rounded-md text-sm w-full"
                                            >
                                                {Object.entries(months).map(([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            months[value?.toLowerCase()] || value
                                        )
                                    )
                                    : (
                                        months[value?.toLowerCase()] || value
                                    )
                                }
                            </div>
                        );
                    }
                },
            ]
        },
        {
            header: "Details",
            children: [
                { header: "Purpose", accessor: "purpose",
                    renderCell: (value, row, accessor) => (
                        <div>
                        {                            
                        ["REQUESTOR","ADMIN", "APPROVER"].includes(user?.permission)
                            ? (
                                editingRowId === row.id ? (
                                <textarea
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
                { header: "Requested By", accessor: "created_by" },
                { header: "Date Requested", accessor: "created_at", renderCell: (value) => format(new Date(value), "yyyy-MM-dd")
                },
                { header: "Attachment", accessor: "attachment", 
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
                    },
                },
                { header: "Updated By", accessor: "updated_by",},
                { header: "Date Updated", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "-"}
            ]
        },
        {
            header: "Reviewer",
            children: [
                { header: "Reviewed By", accessor: "reviewed_by" },
                { header: "Date Reviewed", accessor: "reviewed_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "-" },
            ]
        },
        {
            header: "First Approval",
            children: [
                { header: "Approved By", accessor: "first_approver" },
                { header: "Date Approved", accessor: "first_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "-" },
            ]
        },
        {
            header: "Second Approval",
            children: [
                { header: "Approved By", accessor: "second_approver" },
                { header: "Date Approved", accessor: "second_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "-" },
            ]
        },
        {
            header: "Final Approval",
            children: [
                { header: "Approved By", accessor: "third_approver" },
                { header: "Date Approved", accessor: "third_approved_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd") : "-" },
            ]
        },
    ]

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
                        const response = await DeleteRealignmentRequest({id}); // your API call
                        toast.success(response.data.message);
                        await fetchRealignmentRequest(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete realignment request");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error(
                error.response?.data?.message ??
                'Failed to realignment request.'
            );
        }
    }

    const handleSave = async (id, updatedData) => {
        try {
            const response = await UpdateRealignment(updatedData);
            console.log(response);
            toast.success(response.data.message);
            await fetchRealignmentRequest(); // refresh table
            setEditingRowId(null);
        } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Failed to update the request.");
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
                        const response = await ApproveRealignmentRequest({ id });
                        if (response.data.status === "success") {
                            toast.success(response.data.message);
                            await fetchRealignmentRequest();
                        } else {
                            toast.error(response.data.message);
                        }
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to approve request");
                    }
                } else if (result.isDenied) {
                    try {
                        const response = await RejectRealignmentRequest({ id }); // 👈 your reject API
                        toast.success(response.data.message);
                        await fetchRealignmentRequest();
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

    const fetchRealignmentRequest = async () => {
        try {
            const response = await GetRealignmentRequest(formData);
            if (response && response.data) {
                setDataRequest(response.data[0]);
            }
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error fetching budget request:", error);
        }
    }

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dataRequest);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Realignment Requests");
        XLSX.writeFile(workbook, `Realignment_Requests_${formData.year}.xlsx`);
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
            fetchRealignmentRequest();
        }, []); 

    for (let year = 2000; year <= currentYear + 5; year++) {
        years.push(year);
    }

    return (
        <div>
            <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98]"
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
            {/* Refresh Data */}
            <button
                type="button"
                onClick={fetchRealignmentRequest}
                title="Refresh Data"
                aria-label="Refresh data"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-95"
            >
                <ArrowPathIcon className="h-5 w-5" />
            </button>
        </div>
            <br/>
            <Table title="Re-alignment Request" columns={columns} data={dataRequest} />
        </div>
    )
}

export default RealignmentRequestRecord