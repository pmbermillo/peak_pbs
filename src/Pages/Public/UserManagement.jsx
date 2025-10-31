import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import { GetUser } from '../../Api/Module/SettingsApi';
import { PostUser } from '../../Api/Module/SettingsApi';
import { DeleteUser } from '../../Api/Module/SettingsApi';
import {format} from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const UserManagement = () => {
    const MySwal = withReactContent(Swal);
    const [dataUser, setDataUser] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        permission: '',
        userId: '',
    });
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
                            });
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
        });
    }

    return (
        <div>
            <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
            >
            <h2 className="text-sm font-bold text-gray-800 text-center">
                Employee Form
            </h2>

            {/* Row with two fields */}
            <div className="grid grid-cols-2 gap-4">
                {/* Employee ID */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                </label>
                <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="Enter Employee ID"
                    className="w-full border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
                </div>

                {/* Permission */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permission
                </label>
                <select
                    name="permission"
                    value={formData.permission}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                >
                    <option value="" disabled>Select Permission</option>
                    {permissionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            {/* Submit button */}
            <button
                type="submit"
                className="w-half bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
                Save
            </button>
            <button
                type="button"
                onClick={clearForm}
                className="w-half bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition ml-2"
            >
                Clear
            </button>
            </form>
            <Table title="Users" columns={columns} data={dataUser} />
        </div>
    )
}

export default UserManagement