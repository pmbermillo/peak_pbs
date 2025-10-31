import React, { useState, useEffect} from 'react'
import Table from '../../Component/Table'
import {format} from 'date-fns';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, HandThumbUpIcon, ArrowPathIcon} from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useUser } from "../Auth/UserContext";
import { GetBudgetRequest, UpdateBudget, DeleteBudgetRequest, ApproveBudgetRequest, RejectBudgetRequest} from '../../Api/Module/FormsApi';

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
                            {/* Edit Button */}
                            {editingRowId === row.id ? (
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
                                        <CheckIcon className="h-5 w-5" />
                                    </button>
                                )}
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
                                        <PencilIcon className="h-5 w-5" />
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
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                                </>
                            )}
                            {row.status !== "Processed" && row.status !== "Approved" && ["ADMIN", "REVIEWER", "APPROVER"].includes(user?.permission) && (
                            <button
                                title="Approval"
                                onClick={() => handleApproval(row.id)}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                <HandThumbUpIcon className="h-5 w-5" />
                            </button>
                            )}
                        </div>            
                    )
                },
                { header: "ID", accessor: "unique_id" },
                { header: "Status", accessor: "status" },
                { header: "Client Account", accessor: "client_account" },
                { header: "Project", accessor: "project" },
                { header: "Category", accessor: "category" },
                { header: "Location", accessor: "location" },
                { header: "Budget Source", accessor: "budget_source" },
                { header: "Expense Account", accessor: "expense_account" },
                { header: "Date Needed", accessor: "date_needed" },
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
                { header: "Attachment", accessor: "attachment", renderCell: (value) => value ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a> : "—" },
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
            header: "Accounting Specialist", 
            children: [
                {
                    header: "Actual Amount",
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
            console.log(response);
            toast.success(response.data.message);
            await fetchBudgetRequest(); // refresh table
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
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
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
                    <button className="p-2" onClick={fetchBudgetRequest} title="Refresh Data">
                        <ArrowPathIcon className="h-5 w-5 text-gray-600 hover:text-blue-600 transition" />
                    </button>
                </div>
            </div><br/>
            <Table title="Budget Request" columns={columns} data={dataBudgetRequest} />
        </div>
    )
}

export default BudgetRequestRecord