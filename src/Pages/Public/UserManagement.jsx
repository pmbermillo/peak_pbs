import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import { GetUser } from '../../Api/Module/SettingsApi';
import { PostUser } from '../../Api/Module/SettingsApi';
import { DeleteUser } from '../../Api/Module/SettingsApi';
import { GetBudgetSource } from '../../Api/Module/SettingsApi';
import { GetLocation } from '../../Api/Module/SettingsApi';
import {format} from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const UserManagement = () => {
    const MySwal = withReactContent(Swal);
    const [dataUser, setDataUser] = useState([]);
    const [dataBudgetSource, setDataBudgetSource] = useState([]);
    const [dataSite, setDataSite] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        permission: '',
        userId: '',
        budget_source: '',
        site: '',
    });

    const fetchLocation = async () => {
        try {
            const response = await GetLocation();
            if (response && response.data[0]) {
                setDataSite(response.data[0]);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchBudgetSource = async () => {
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

    const permissionOptions = [
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'REQUESTOR', label: 'REQUESTOR' },
        { value: 'REVIEWER', label: 'REVIEWER' },
        { value: 'APPROVER', label: 'APPROVER' },
        { value: 'SPECIALIST', label: 'SPECIALIST' },
    ];
    const [permission, setPermission] = useState(permissionOptions);   
    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Last Name", accessor: "lastname" },
        { header: "First Name", accessor: "firstname" },
        { header: "Email", accessor: "email" },
        { header: "Permission", accessor: "permission" },
        { header: "Site", accessor: "site"},
        { header: "Budget Source", accessor: "budget_source" },
        { header: "Created By", accessor: "created_by" },
        { header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { header: "Updated By", accessor: "updated_by" },
        { header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
        { 
            header: "Action", accessor: "action", 
            renderCell: (_, row) => (
                <div className="flex gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => {
                            setFormData({
                                employee_id: row.employee_id,
                                permission: row.permission,
                                userId: row.id,
                                budget_source: row.budget_source,
                                site: row.site,
                            });
                        }}
                         className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <PencilIcon className="h-4 w-4" />
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
        // { 
        //     header: "Score", 
        //     accessor: "score", 
        //     renderCell: (value) => (
        //     <span className={value > 80 ? "text-green-600 font-bold" : "text-red-500"}>
        //         {value}
        //     </span>
        //     )
        // },
    ];

    const fetchData = async () => {
        try {
            const response = await GetUser();
            if (response && response.data) {
                setDataUser(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchBudgetSource();
        fetchLocation();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await PostUser(formData);
            console.log('Form submitted successfully:', response);
            await fetchData();
            clearForm();
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to submit form.'
            );
        }
    }

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
                        const response = await DeleteUser({id}); // your API call
                        toast.success(response.data.message);
                        await fetchData(); // refresh table
                    } catch (error) {
                        toast.error(error.response?.data?.message ?? "Failed to delete user");
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(
                error.response?.data?.errors?.employee_id?.[0] ??
                error.response?.data?.error ??
                'Failed to delete user.'
            );
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const clearForm = () => {
        setFormData({
            employee_id: '',
            permission: '',
            userId: '',
            budget_source: '',
            site: '',
        });
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-4 space-y-4"
            >
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-bold text-gray-800">
                        Employee Form
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Enter employee details and permissions.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Employee ID */}
                    <div>
                        <label
                            htmlFor="employee_id"
                            className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                            Employee ID
                        </label>
                        <input
                            id="employee_id"
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            placeholder="Enter ID"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                        />
                    </div>

                    {/* Permission */}
                    <div>
                        <label
                            htmlFor="permission"
                            className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                            Permission
                        </label>
                        <select
                            id="permission"
                            name="permission"
                            value={formData.permission}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                        >
                            <option value="" disabled>Select permission</option>
                            {permissionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Department */}
                    <div>
                        <label
                            htmlFor="department"
                            className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                            Budget Source
                        </label>
                        <select
                            id="budget_source"
                            name="budget_source"
                            value={formData.budget_source}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                        >
                            <option value="" disabled>Select budget source</option>
                            {dataBudgetSource.map((source) => (
                                <option key={source.id} value={source.value}>
                                    {source.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team */}
                    <div>
                        <label
                            htmlFor="team"
                            className="block text-xs font-semibold text-gray-700 mb-1"
                        >
                            Site
                        </label>
                        <select
                            id="site"
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                        >
                            <option value="" disabled>Select site</option>
                            {dataSite.map((site) => (
                                <option key={site.id} value={site.location}>
                                    {site.location}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Clear
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                </div>
            </form>
            <Table title="Users" columns={columns} data={dataUser} />
        </div>
    )
}

export default UserManagement