import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import { GetCategory } from '../../Api/Module/SettingsApi';
import { PostCategory } from '../../Api/Module/SettingsApi';
import { DeleteCategory } from '../../Api/Module/SettingsApi';
import {format} from 'date-fns';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CategoryManagement = () => {
	const MySwal = withReactContent(Swal);
	const [dataCategory, setDataCategory] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		category: '',
		description: '',
		id: '',
	});

	const columns = [
		{ header: "Category Name", accessor: "category" },
		{ header: "Description", accessor: "description" },
		{ header: "Created By", accessor: "created_by" },
		{ header: "Created At", accessor: "created_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
		{ header: "Updated By", accessor: "updated_by" },
		{ header: "Updated At", accessor: "updated_at", renderCell: (value) => value ? format(new Date(value), "yyyy-MM-dd HH:mm"):"" },
		{ header: "Action", accessor: "action",
			renderCell: (_, row) => (
				<div className="flex gap-2">
					{/* Edit Button */}
					<button
						onClick={() => {
							setFormData({
								category: row.category,
								description: row.description,
								id: row.id,
							});
							setIsEditing(true);
						}}
						className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
					>
						<PencilIcon className="h-5 w-5" />
					</button>
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
			const response = await GetCategory();
			if (response && response.data[0]) {
				setDataCategory(response.data[0]);
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
			const response = await PostCategory(formData);
			console.log('Form submitted successfully:', response);
			await fetchData();
			clearForm();
			toast.success(response.data.message);
			setIsEditing(false);
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error(
				error.response?.data?.errors?.category?.[0] ??
				error.response?.data?.error ??
				'Failed to submit form.'
			);
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
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
						const response = await DeleteCategory({id}); // your API call
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
				error.response?.data?.errors?.category?.[0] ??
				error.response?.data?.error ??
				'Failed to delete category.'
			);
		}
	}

	const clearForm = () => {
		setFormData({
			category: '',
			description: '',
			id: '',
		});
	}

	return (
		<div >
			<form
			onSubmit={handleSubmit}
			className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
			>
			<h2 className="text-sm font-bold text-gray-800 text-center">
				Category Form
			</h2>

			{/* Row with two fields */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Category 
					</label>
					<input
						type="text"
						name="category"
						value={formData.category}
						onChange={handleChange}
						placeholder="Enter Category Name"
						className="w-full border rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						required
						disabled={isEditing}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Enter Description"
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
				Save
			</button>
			<button
				type="button"
				onClick={() => {
					clearForm();
					setIsEditing(false);
				}}
				className="w-half bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition ml-2"
			>
				Clear
			</button>
			</form>
			<Table title="Category" columns={columns} data={dataCategory} />
		</div>
	)
}

export default CategoryManagement