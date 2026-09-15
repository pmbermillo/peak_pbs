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
        <div className="py-4 px-3">
            <form
                onSubmit={handleSubmit}
                className="max-w-5xl mx-auto bg-white border border-gray-200
                        rounded-xl shadow-sm overflow-hidden"
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Budget Request
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Create a new budget request
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                Available Balance
                            </span>

                            <span className="px-2.5 py-1 rounded-md bg-green-50
                                            text-green-600 text-sm font-bold">
                                ${Number(formData.availableBalance || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 py-3 border-b border-gray-100">
                    <div className="max-w-md">
                        {/* <label className="block text-[11px] font-semibold
                                        text-gray-500 mb-1">
                            Search Budget Source Code
                        </label> */}

                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2
                                        w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search budget source code..."
                                className="
                                    w-full h-9
                                    pl-9 pr-9
                                    bg-gray-50
                                    border border-gray-200
                                    rounded-lg
                                    text-xs text-gray-700
                                    placeholder:text-gray-400
                                    focus:bg-white
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-100
                                    focus:border-blue-400
                                    transition
                                "
                            />

                            {loading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                    <svg
                                        className="w-3 h-3 animate-spin text-blue-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="opacity-25"
                                        />
                                        <path
                                            d="M21 12a9 9 0 0 0-9-9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <span className="text-[10px] text-blue-400">
                                        Searching...
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-5">

                    <div className="grid grid-cols-1 md:grid-cols-2
                                    gap-x-5 gap-y-3.5">

                        {/* Budget Source Code */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Budget Source Code
                            </label>

                            <Select
                                options={budgetSourceCodeOptions}
                                value={
                                    formData.source_code
                                        ? budgetSourceCodeOptions.find(
                                            (o) => o.value === formData.source_code
                                        )
                                        : null
                                }
                                onChange={handleBudgetSourceCodeChange}
                                placeholder="Select source code"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Budget Source */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Budget Source
                            </label>

                            <select
                                name="budget_source"
                                value={formData.budget_source}
                                onChange={handleChange}
                                className="w-full h-9 border border-gray-300
                                        rounded-md px-2.5 text-sm bg-white
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>
                                    Select budget source
                                </option>

                                {budgetSourceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Location
                            </label>

                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full h-9 border border-gray-300
                                        rounded-md px-2.5 text-sm bg-white
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>
                                    Select location
                                </option>

                                {locationOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Client Account */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Client & Account
                            </label>

                            <Select
                                options={clientAccountOptions}
                                value={
                                    clientAccountOptions.find(
                                        (o) => o.value === formData.client_account
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        client_account: selected
                                            ? selected.value
                                            : ""
                                    })
                                }
                                placeholder="Select client account"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full h-9 border border-gray-300
                                        rounded-md px-2.5 text-sm bg-white
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>
                                    Select category
                                </option>

                                {categoryOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Project */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Project
                            </label>

                            <Select
                                options={projectOptions}
                                value={
                                    projectOptions.find(
                                        (o) => o.value === formData.project
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        project: selected
                                            ? selected.value
                                            : ""
                                    })
                                }
                                placeholder="Select project"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Classification */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Classification
                            </label>

                            <Select
                                options={classificationOptions}
                                value={
                                    classificationOptions.find(
                                        (o) => o.value === formData.classification
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        classification: selected
                                            ? selected.value
                                            : ""
                                    })
                                }
                                placeholder="Select classification"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Expense Account */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Expense Account
                            </label>

                            <Select
                                options={expenseAccountOptions}
                                value={
                                    expenseAccountOptions.find(
                                        (o) => o.value === formData.expense_account
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        expense_account: selected
                                            ? selected.value
                                            : ""
                                    })
                                }
                                placeholder="Select expense account"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Date Needed */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Date Needed
                            </label>

                            <input
                                type="date"
                                name="date_needed"
                                value={formData.date_needed}
                                onChange={handleChange}
                                className="w-full h-9 border border-gray-300
                                        rounded-md px-2.5 text-sm
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Mode of Payment */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Mode of Payment
                            </label>

                            <Select
                                options={modeOfPaymentOptions}
                                value={
                                    modeOfPaymentOptions.find(
                                        (o) => o.value === formData.payment
                                    ) || null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        payment: selected
                                            ? selected.value
                                            : ""
                                    })
                                }
                                placeholder="Select payment method"
                                isClearable
                                isSearchable
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: "36px",
                                        height: "36px",
                                        fontSize: "13px",
                                        borderRadius: "6px",
                                        borderColor: "#d1d5db",
                                        boxShadow: "none",
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 8px",
                                    }),
                                    indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "36px",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Amount
                            </label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2
                                                -translate-y-1/2 text-xs
                                                text-gray-400">
                                    $
                                </span>

                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full h-9 border border-gray-300
                                            rounded-md pl-7 pr-3 text-sm
                                            focus:outline-none focus:ring-2
                                            focus:ring-blue-100
                                            focus:border-blue-500"
                                    required
                                />
                            </div>

                            {formData.converted && (
                                <div className="mt-1 text-[11px] text-gray-500">
                                    Converted:
                                    <span className="ml-1 font-semibold text-gray-700">
                                        ${formData.converted}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Currency
                            </label>

                            <div className="h-9 flex items-center gap-4 px-3
                                            bg-gray-50 border border-gray-200
                                            rounded-md">

                                <label className="flex items-center gap-1.5
                                                text-xs text-gray-600
                                                cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCurrencies === "Peso"}
                                        onChange={() =>
                                            handleCheckboxChange("Peso")
                                        }
                                        className="w-3.5 h-3.5 rounded"
                                    />
                                    Peso
                                </label>

                                <label className="flex items-center gap-1.5
                                                text-xs text-gray-600
                                                cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedCurrencies === "USDollar"
                                        }
                                        onChange={() =>
                                            handleCheckboxChange("USDollar")
                                        }
                                        className="w-3.5 h-3.5 rounded"
                                    />
                                    USD
                                </label>

                                <label className="flex items-center gap-1.5
                                                text-xs text-gray-600
                                                cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedCurrencies === "BZDollar"
                                        }
                                        onChange={() =>
                                            handleCheckboxChange("BZDollar")
                                        }
                                        className="w-3.5 h-3.5 rounded"
                                    />
                                    BZD
                                </label>
                            </div>
                        </div>

                        {/* Attachment */}
                        <div>
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Attachment
                            </label>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current.click()
                                    }
                                    className="h-9 px-3 inline-flex items-center
                                            gap-2 border border-gray-300
                                            rounded-md text-xs font-medium
                                            text-gray-600 bg-white
                                            hover:bg-gray-50 transition"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.657-5.657L5.757 9.757a6 6 0 108.485 8.486L20.485 12"
                                        />
                                    </svg>
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
                                    <span
                                        className="text-[11px] text-green-600
                                                truncate max-w-[200px]"
                                        title={fileName}
                                    >
                                        {fileName}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold
                                            text-gray-600 mb-1">
                                Purpose / Details
                            </label>

                            <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                placeholder="Enter purpose or additional details..."
                                rows="2"
                                required
                                className="w-full border border-gray-300 rounded-md
                                        px-3 py-2 text-sm resize-none
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100
                                flex items-center justify-end gap-3">

                    {submitLoading && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg
                                className="w-4 h-4 animate-spin"
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
                            Submitting...
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="h-9 px-5 rounded-md bg-blue-600
                                text-white text-xs font-semibold
                                shadow-sm hover:bg-blue-700
                                transition disabled:opacity-50
                                disabled:cursor-not-allowed"
                    >
                        {submitLoading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BudgetFormRequest