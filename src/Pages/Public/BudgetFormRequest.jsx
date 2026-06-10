import React, {useEffect, useState} from 'react'
import { GetBudgetSourceOption, GetClientAccountOption, GetLocationOption, GetCategoryOption, GetProjectOption, GetExpenseAccountOption, GetCurrency, AddBudgetRequest, GetBudgetSourceCodeOption, GetBudgetSourceCode, GetClassificationOption } from '../../Api/Module/FormsApi';
import { GetModeOfPaymentOption } from '../../Api/Module/FormsApi';
import Select from 'react-select';
import { add } from 'date-fns';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useRef } from 'react';

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
        source_code: null,
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
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleCheckboxChange = (value) => {
        setSelectedCurrencies(value); // Only one can be active
    };
    const [fileName, setFileName] = useState("");
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const file = files && files.length > 0 ? files[0] : null;
        setFormData({
            ...formData,
            [name]: file ?? value,
        });
        
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        setSubmitLoading(true);
        try {
            const response = await AddBudgetRequest(data);
            console.log(response);
            toast.success(response.data.message);
            await clearForm();
        } catch (error) {
            console.error("Error submitting form:", error);
            if(error.response.data.status == "error" && error.response?.data?.message == "Insufficient available balance.")
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Insufficient Available Balance',
                    text: 'Please review your budget items and request a realignment or identify another source code to proceed with this request.',
                    footer: `<span class="text-sm">Available Balance: $${formData.availableBalance}</span>`
                });
                return;
            }
            toast.error(error.response?.data?.message || "Error submitting form");
        } finally {
            setSubmitLoading(false);
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

    const fetchBudgetSourceCode = async (searchTerm) => {
        setLoading(true);
        try {
            const response = await GetBudgetSourceCodeOption({
                search: searchTerm
            });
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
        }finally {

            setLoading(false);
        }
    }

    const controller = new AbortController();
    const fileInputRef = useRef(null);

    const handleBudgetSourceCodeChange = async (selected) => 
    {
        controller.abort();

        const newController = new AbortController();

        if (!selected) {
            // clear fields when select is cleared
            setFormData({
                ...formData,
                source_code: selected ? selected.value : null,
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

    const clearForm = () => {
        setFormData({
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
            source_code: null,
            classification: "",
            payment: null,
            availableBalance: 0,
        });
        setSelectedCurrencies([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileName("");
        console.log(formData);
    };

    useEffect(() => {
        if (selectedCurrencies && formData.amount) {
            fetchCurrency();
        }
    }, [selectedCurrencies, formData.amount]);

    useEffect(() => {
        console.log(search);
        if (search === "") {
            setLoading(false);
            fetchBudgetSourceCode("");
            return;
        }
        setLoading(true);
        // ⏳ WITH SEARCH → wait 3 seconds
        const delayDebounce = setTimeout(async () => {
            try {
                await fetchBudgetSourceCode(search);
            } finally {
                setLoading(false);
            }
        }, 3000);

        // cleanup (cancel previous timer if user keeps typing)
        return () => clearTimeout(delayDebounce);

    }, [search]);

    // Run only once on mount
    useEffect(() => {
        fetchBudgetSources();
        fetchClientAccounts();
        fetchLocations();
        fetchCategories();
        fetchProjects();
        fetchExpenseAccounts();
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
        <h3 className="text-xl font-extrabold text-center text-gray-900 tracking-wide">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Budget Request Form
            </span>

            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded"></div>

            <br />

            {/* NEW FLEX CONTAINER */}
            <div className="flex justify-between items-center mt-2 px-2 text-base">
                {/* LEFT */}
                <div className="text-left">
                Search: <input type="text" className="border rounded px-2 py-1 ml-1 font-normal" value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                </div>

                {/* RIGHT */}
                <div className="text-right text-lg">
                Available Balance:{" "}
                <span className="font-bold text-green-600">
                    ${formData.availableBalance}
                </span>
                </div>
            </div>
        </h3>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-semibold">Budget Source Code</label>
                <Select 
                    options={budgetSourceCodeOptions}
                    value={
                        formData.source_code
                            ? budgetSourceCodeOptions.find((o) => o.value === formData.source_code)
                            : null // ✅ force clear
                    }
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
                {loading && (
                    <div className="text-sm text-gray-500 mt-1">
                        Searching budget source codes...
                    </div>
                )}
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
                    <strong>Conversion:</strong>{" $"}
                    {formData.converted || ""}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Attachments (if any)</label>
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Upload File
                </button>

                <input
                    type="file"
                    name="attachment"
                    ref={fileInputRef}
                    onChange={handleChange}
                    className="hidden"
                />

                {fileName && (
                    <p className="text-sm text-green-600 mt-2">
                        {fileName}
                    </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                    Optional — upload supporting files
                </p>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Mode of Payment</label>
                <Select
                    className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    options={modeOfPaymentOptions}
                    value={
                        modeOfPaymentOptions.find((o) => o.value === formData.payment) || null
                    }
                    onChange={(selected) =>
                        setFormData({ ...formData, payment: selected.value })
                    }
                    placeholder="Select or type mode of payment"
                />
            </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-center gap-3">

            <button
                type="submit"
                disabled={submitLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
                Submit Request
            </button>

            {submitLoading && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                    <svg
                        className="w-4 h-4 animate-spin text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>

                    Loading...
                </div>
            )}

        </div>
        </form>
        </div>
    )
}

export default BudgetFormRequest