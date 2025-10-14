import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {format} from 'date-fns';
import withReactContent from 'sweetalert2-react-content';
import { TrashIcon } from "@heroicons/react/24/solid";
import { AddProject, GetProject, DeleteProject } from '../../Api/Module/SettingsApi';

const ProjectManagement = () => {
    const MySwal = withReactContent(Swal);
	const [dataProject, setDataProject] = useState([]);
	const [formData, setFormData] = useState({
		project: '',
	});
	const columns = [
		{ header: "Project Name", accessor: "project" },
		{ header: "Created By", accessor: "created_by" },
		{ header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
		{ header: "Updated By", accessor: "updated_by" },
		{ header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
		{ header: "Action", accessor: "action",
			renderCell: (_, row) => (
				<div className="flex gap-2">
					{/* Edit Button */}
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

	const fetchData = async () => {
		try {
			const response = await GetProject();
			if (response && response.data[0]) {
				setDataProject(response.data[0]);
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
			const response = await AddProject(formData);
			console.log(response);
			toast.success('Form submitted successfully!');
			clearForm();
			await fetchData();
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error(
				error.response?.data?.errors?.project?.[0] ??
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
						const response = await DeleteProject({id}); // your API call
						toast.success(response.data.message);
						await fetchData(); // refresh table
					} catch (error) {
						toast.error(error.response?.data?.message ?? "Failed to delete category");
					}
				}
			});
		} catch (error) {
			console.error('Error deleting user:', error);
			toast.error(
				error.response?.data?.errors?.locaiton?.[0] ??
				error.response?.data?.error ??
				'Failed to delete project.'
			);
		}
	}	

	const clearForm = () => {
		setFormData({
			project: '',
		});
	}

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
                >
                <h2 className="text-sm font-bold text-gray-800 text-center">
                    Project Form
                </h2>

                {/* Row with two fields */}
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project 
                        </label>
                        <input
                            type="text"
                            name="project"
                            onChange={(e) => setFormData({...formData, project: e.target.value})}
                            value={formData.project}
                            placeholder="Enter Project Name"
                            className="w-full border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                </div>
                {/* Submit button */}
                <button
                    type="submit"
                    className="w-half bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Add
                </button>
                <button
                    type="button"
                    onClick={() => {
                        clearForm();
                    }}
                    className="w-half bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition ml-2"
                >
                    Clear
                </button>
                </form>
                <Table title="Project" columns={columns} data={dataProject} />
        </div>
    )
}

export default ProjectManagement