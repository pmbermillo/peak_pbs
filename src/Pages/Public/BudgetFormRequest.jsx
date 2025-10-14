import React, {useEffect, useState} from 'react'
import { GetBudgetSourceOption, GetClientAccountOption, GetLocationOption, GetCategoryOption, GetProjectOption, GetExpenseAccountOption, GetCurrency, AddBudgetRequest } from '../../Api/Module/FormsApi';
import Select from 'react-select';
import { add } from 'date-fns';
import { toast } from 'react-toastify';

const BudgetFormRequest = () => {
    const [formData, setFormData] = useState({
        budget_source: "",
        location: "",
        date_needed: "",
        expense_account: "",
        purpose: "",
        project: "",
        category: "",
        client_account: "",
        amount: "",
        attachment: null,
        converted: "",
    });
    const [budgetSourceOptions, setBudgetSourceOptions] = useState([]);
    const [clientAccountOptions, setClientAccountOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [expenseAccountOptions, setExpenseAccountOptions] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);

    const handleCheckboxChange = (value) => {
        setSelectedCurrencies(value); // Only one can be active
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ 
        ...formData, 
        [name]: files && files.length > 0 ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            const response = await AddBudgetRequest(data);
            console.log(response);
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const fetchBudgetSources = async () => {
        try {
            const response = await GetBudgetSourceOption();
            if (response && response.data) {
                setBudgetSourceOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching budget sources:", error);
        }
    }

    const fetchClientAccounts = async () => {
        try {
            const response = await GetClientAccountOption();
            console.log(response);
            if (response && response.data) {
                setClientAccountOptions(response.data[0]);
            }   
        } catch (error) {
            console.error("Error fetching client accounts:", error);
        }
    }

    const fetchLocations = async () => {
        try {
            const response = await GetLocationOption();
            if (response && response.data) {
                setLocationOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await GetCategoryOption();
            if (response && response.data) {
                setCategoryOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    const fetchProjects = async () => {
        try {
            const response = await GetProjectOption();
            if (response && response.data) {
                setProjectOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const fetchExpenseAccounts = async () => {
        try {
            const response = await GetExpenseAccountOption();
            if (response && response.data) {
                setExpenseAccountOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching expense accounts:", error);
        }
    }

    const fetchCurrency = async () => {
        try {
            const response = await GetCurrency({
                currency: selectedCurrencies,
                amount: formData.amount
            });
           console.log(response)
            if (response && response.data) {
                setFormData(prev => ({
                    ...prev,
                    converted: response.data[0]
                }));
            }
        } catch (error) {
            console.error("Error fetching currency:", error);
        }
    }

    useEffect(() => {
        if (selectedCurrencies && formData.amount) {
            fetchCurrency();
        }
    }, [selectedCurrencies, formData.amount]);

    // Run only once on mount
    useEffect(() => {
        fetchBudgetSources();
        fetchClientAccounts();
        fetchLocations();
        fetchCategories();
        fetchProjects();
        fetchExpenseAccounts();
    }, []); 

    return (
        <div>
        <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-2xl space-y-4"
        >
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-wide">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Budget Request Form
            </span>
            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded"></div>
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost Center */}
            <div>
            <label className="block mb-1 font-semibold">Budget Source</label>
            <select
                name="budget_source"
                value={formData.budget_source}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Budget Source --</option>
                {budgetSourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            </div>

            {/* Location */}
            <div>
            <label className="block mb-1 font-semibold">Location</label>
            <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Location --</option>
                {locationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            </div>

            {/* Client and Account */}
            <div>
                <label className="block mb-1 font-semibold">Client and Account</label>
                <Select
                    options={clientAccountOptions}
                    value={clientAccountOptions.find((o) => o.value === formData.client_account)}
                    onChange={(selected) =>
                        setFormData({ ...formData, client_account: selected.value })
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

            {/* Category */}
            <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Category --</option>
                {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            </div>

            {/* Project */}
            <div>
            <label className="block mb-1 font-semibold">Project</label>
            <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Project --</option>
                {projectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            </div>

            {/* Expense Account */}
            <div>
            <label className="block mb-1 font-semibold">Expense Account</label>
            <select
                name="expense_account"
                value={formData.expense_account}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Expense Account --</option>
                {expenseAccountOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            </div>

            {/* Date Needed */}
            <div>
            <label className="block mb-1 font-semibold">Date Needed</label>
            <input
                type="date"
                name="date_needed"
                value={formData.date_needed}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Select Currency</label>
                <div className="flex justify-center items-center gap-6">
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedCurrencies === "Peso"}
                        onChange={() => handleCheckboxChange("Peso")}
                    />
                    Peso
                    </label>

                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedCurrencies === "USDollar"}
                        onChange={() => handleCheckboxChange("USDollar")}
                    />
                    US Dollar
                    </label>
                    <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedCurrencies === "BZDollar"}
                        onChange={() => handleCheckboxChange("BZDollar")}
                    />
                    Belize Dollar
                    </label>
                </div>
            </div>

            {/* Purpose / Details (span 2 columns) */}
            <div >
                <label className="block mb-1 font-semibold">Purpose / Details</label>
                <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Enter purpose or details"
                    className="w-full border p-2 rounded"
                    rows="3"
                    required
                />
            </div>

            {/* Amount */}
            <div>
                <label className="block mb-1 font-semibold">Enter Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full border p-2 rounded"
                    required
                />
                <div className="mt-2">
                    <strong>Conversion:</strong>{" "}
                    {formData.converted || "Please select a currency and enter amount"}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Attachments (if any)</label>
                <input
                    type="file"
                    name="attachment"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                    Optional — upload supporting files
                </p>
            </div>
        </div>

        {/* Submit */}
        <div className="text-center">
            <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
            Submit Request
            </button>
        </div>
        </form>
        </div>
    )
}

export default BudgetFormRequest