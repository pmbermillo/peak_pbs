import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import Select from 'react-select';
import {format} from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';
import { PostBudgetSource } from '../../Api/Module/SettingsApi';
import { GetBudgetSource } from '../../Api/Module/SettingsApi';
import { DeleteBudgetSource } from '../../Api/Module/SettingsApi';
import { GetLeaders } from '../../Api/Module/SettingsApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BudgetSourceManagement = () => {
    const MySwal = withReactContent(Swal);
    const [dataBudgetSource, setDataBudgetSource] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        budget_source: "",
        budget_holder: "",
        first_approver: "",
        second_approver: "",
    });
    const [approverOptions, setApproverOptions] = useState([]);

    const columns = [
        // { header: "Code", accessor: "unique_code" },
        { header: "Budget Source", accessor: "budget_source" },
        { header: "Budget Holder", accessor: "budget_holder" },
        { header: "First Approver", accessor: "first_approver" },
        { header: "Second Approver", accessor: "second_approver" },
        { header: "Created By", accessor: "created_by" },
        { header: "Updated By", accessor: "updated_by" },
        { header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { 
            header: "Action", accessor: "action", 
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => {
                            setFormData({
                                // unique_code: row.unique_code,
                                budget_source: row.budget_source,
                                budget_holder: row.budget_holder,
                                first_approver: row.first_approver,
                                second_approver: row.second_approver,
                                id: row.id,
                            });
                            setIsEditing(true);
                        }}
                         className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(row.id)} // 🔥 call a delete handler
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            )
        },    
    ];    

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
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
                        const response = await DeleteBudgetSource({id}); // your API call
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
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to budget source.'
            );
        }
    }

    const fetchData = async () => {
        try {
            const response = await GetBudgetSource();
            if (response && response.data) {
                setDataBudgetSource(response.data[0]);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching budget source:', error);
        }
    };

    const fetchLeaders = async () => {
        try {
            const response = await GetLeaders();
            if (response && response.data) {
                setApproverOptions(response.data[0]);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching approver data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchLeaders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PostBudgetSource(formData);
            console.log(response);
            toast.success(response.data.message);
            await fetchData();
            clearForm();
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to submit form.'
            );
        }
    };

    const clearForm = () => {
        setFormData({
            id: "",
            budget_source: "",
            budget_holder: "",
            first_approver: "",
            second_approver: "",
        });
    }
    
    return (
        <div>
            <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6"
            >
            <h2 className="text-sm font-bold text-gray-800 text-center">Budget Form</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget Holder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Budget Holder
                    </label>
                    <Select
                        options={approverOptions}
                        value={approverOptions.find((o) => o.value === formData.budget_holder)}
                        onChange={(selected) =>
                            setFormData({ ...formData, budget_holder: selected.value })
                        }
                        placeholder="Select or type approver"
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}   // ⬅️ renders outside
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                        }}
                        className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* First Approver */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        First Approver *
                    </label>
                    <Select
                        options={approverOptions}
                        value={approverOptions.find((o) => o.value === formData.first_approver)}
                        onChange={(selected) =>
                            setFormData({ ...formData, first_approver: selected.value })
                        }
                        placeholder="Select or type approver"
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}   // ⬅️ renders outside
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                        }}
                        className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Second Approver */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Second Approver
                    </label>
                    <Select
                        options={approverOptions}
                        value={approverOptions.find((o) => o.value === formData.second_approver)}
                        onChange={(selected) =>
                            setFormData({ ...formData, second_approver: selected.value })
                        }
                        placeholder="Select or type approver"
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}   // ⬅️ renders outside
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                        }}
                        className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                {/* Budget Source */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Budget Source *
                    </label>
                    <input
                        type="text"
                        name="budget_source"
                        value={formData.budget_source}
                        placeholder="Enter New Budget Source"
                        onChange={handleChange}
                        disabled={isEditing}
                        required
                        className="w-full border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                        >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            clearForm();
                            setIsEditing(false);
                        }}
                        className="ml-4 w-full md:w-auto bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
            </form>
            <Table title="Budget Source" columns={columns} data={dataBudgetSource} />
        </div>
    )
}

export default BudgetSourceManagement