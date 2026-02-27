import React, {useState, useEffect} from 'react'
import Table from '../../Component/Table'
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { TrashIcon } from "@heroicons/react/24/solid";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AddPayment, GetPayment, DeletePayment } from '../../Api/Module/SettingsApi';

const PaymentManagement = () => {
    const MySwal = withReactContent(Swal);
    const [dataPayment, setDataPayment] = useState([]);
    const [formData, setFormData] = useState({
        payment: '',
    });

    const columns = [
		{ header: "Mode Of Payment", accessor: "payment" },
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await GetPayment();    
            if (response && response.data[0]) {
                setDataPayment(response.data[0]);
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching payment data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AddPayment(formData);
            console.log(response);
            toast.success('Form submitted successfully!');
            clearForm();
            await fetchData();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                error.response?.data?.errors?.payment?.[0] ??
                error.response?.data?.error ??
                'Failed to submit form.'
            );
        }
    }

    const clearForm = () => {
		setFormData({
			payment: '',
		});
	}

    const handleDelete = async (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await DeletePayment({ id });
                    console.log(response);
                    toast.success('Payment deleted successfully!');
                    await fetchData();
                } catch (error) {
                    console.error('Error deleting payment:', error);
                    toast.error(
                        error.response?.data?.error ??
                        'Failed to delete payment.'
                    );
                }
            }
        });
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
                >
                <h2 className="text-sm font-bold text-gray-800 text-center">
                    Mode of Payment Form
                </h2>

                {/* Row with two fields */}
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mode of Payment 
                        </label>
                        <input
                            type="text"
                            name="payment"
                            onChange={(e) => setFormData({...formData, payment: e.target.value})}
                            value={formData.payment}
                            placeholder="Enter Mode of Payment"
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
            <Table title="Payment" columns={columns} data={dataPayment} />
        </div>
  )
}

export default PaymentManagement