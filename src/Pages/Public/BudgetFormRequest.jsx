import React, {useEffect, useState} from 'react'
import { GetBudgetSourceOption, GetClientAccountOption, GetLocationOption, GetCategoryOption, GetProjectOption, GetExpenseAccountOption, GetCurrency, AddBudgetRequest, GetBudgetSourceCodeOption, GetBudgetSourceCode, GetClassificationOption } from '../../Api/Module/FormsApi';
import { GetModeOfPaymentOption } from '../../Api/Module/FormsApi';
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
        source_code: "",
        classification: "",
        payment: "",
        availableBalance: 0
    });
    const [budgetSourceOptions, setBudgetSourceOptions] = useState([]);
    const [clientAccountOptions, setClientAccountOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [expenseAccountOptions, setExpenseAccountOptions] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [budgetSourceCodeOptions, setBudgetSourceCodeOptions] = useState([]);
    const [classificationOptions, setClassificationOptions] = useState([]);
    const [modeOfPaymentOptions, setModeOfPaymentOptions] = useState([]);

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

    const fetchClassifications = async () => {
        try {
            // Assuming there's an API to fetch classifications 
            const response = await GetClassificationOption();
            if (response && response.data) {
                setClassificationOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching classifications:", error);
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

    const fetchModeofPayment = async () => {
        try {
            // Assuming there's an API to fetch mode of payment
            const response = await GetModeOfPaymentOption();
            if (response && response.data) {
                setModeOfPaymentOptions(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching mode of payment:", error);
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

    const fetchBudgetSourceCode = async () => {
        try {
            const response = await GetBudgetSourceCodeOption();
            if (response && response.data) {
                setBudgetSourceCodeOptions(response.data[0]);
                console.log(response);
                if (budgetSourceCodeOptions.length > 0) {
                    const firstCode = budgetSourceCodeOptions[0].value;
                    setFormData(prev => ({
                        ...prev,
                        source_code: firstCode
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching budget source code:", error);
        }
    }

    const controller = new AbortController();

    const handleBudgetSourceCodeChange = async (selected) => 
    {
        controller.abort();

        const newController = new AbortController();

        if (!selected) {
            // clear fields when select is cleared
            setFormData({
                ...formData,
                source_code: "",
                budget_source: "",
                location: "",
                category: "",
                project: "",
                classification: "",
                expense_account: "",
                availableBalance: 0
            });
            return;
        }

        setFormData((prev) => ({
            ...prev,
            source_code: selected.value,
        }));

        // fetch related budget details
        const response = await GetBudgetSourceCode({ source_code: selected.value }, { signal: newController.signal });

        const data = response.data[0][0];
        console.log(data);

        // populate other fields
        setFormData((prev) => ({
            ...prev,
            budget_source: data.budget_source,
            location: data.location,
            category: data.category,
            project: data.project,
            classification: data.classification,
            expense_account: data.expense_account,
            availableBalance: data.available_balance
        }));
    };


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
        fetchBudgetSourceCode();
        fetchClassifications();
        fetchModeofPayment();
    }, []); 

    return (
        <div>
        <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-2xl space-y-2"
        >
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-wide">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Budget Request Form
            </span>
            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded"></div><br/>
            <div className='text-lg'>Available Balance: <span className='font-bold text-green-600'>${formData.availableBalance}</span></div>
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-semibold">Budget Source Code</label>
                <Select 
                    options={budgetSourceCodeOptions}
                    value={budgetSourceCodeOptions.find((o) => o.value == formData.source_code)}
                    onChange={handleBudgetSourceCodeChange}
                    placeholder="Select or type budget source code"
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}   // ⬅️ renders outside
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                    }}
                    className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            {/* <select
                name="budget_source_code"
                value={formData.budget_source_code}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            >
                <option value="" disabled>-- Select Budget Source Code --</option>
                {budgetSourceCodeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select> */}
            </div>

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
                <Select 
                    options={projectOptions}
                    value={projectOptions.find((o) => o.value === formData.project)}
                    onChange={(selected) =>
                        setFormData({ ...formData, project: selected.value })
                    }
                    placeholder="Select or type project"
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}   // ⬅️ renders outside
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                    }}
                    className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Classification</label>
                <Select
                    options={classificationOptions}
                    value={classificationOptions.find((o) => o.value === formData.classification)}
                    onChange={(selected) =>
                        setFormData({ ...formData, classification: selected.value })
                    }
                    className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Select or type classification"
                />
            </div>

            {/* Expense Account */}
            <div>
            <label className="block mb-1 font-semibold">Expense Account</label>
            <Select 
                options={expenseAccountOptions}
                value={expenseAccountOptions.find((o) => o.value === formData.expense_account)}
                onChange={(selected) =>
                    setFormData({ ...formData, expense_account: selected.value })
                }
                placeholder="Select or type expense account"
                isClearable
                isSearchable
                menuPortalTarget={document.body}   // ⬅️ renders outside
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                }}
                className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {/* <select
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
            </select> */}
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

            <div>
                <label className="block mb-1 font-semibold">Mode of Payment</label>
                <Select
                    className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    options={modeOfPaymentOptions}
                    value={modeOfPaymentOptions.find((o) => o.value === formData.payment)}
                    onChange={(selected) =>
                        setFormData({ ...formData, payment: selected.value })
                    }
                    placeholder="Select or type mode of payment"
                />
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