import React from 'react'
import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { GetBudgetSourceCodeOption, GetBudgetSourceCode, AddRealignmentRequest, GetCurrency, GetAvailableBalByMonthAPI } from '../../Api/Module/FormsApi';
import Select from 'react-select';
import Swal from 'sweetalert2';

const realignmentFormRequest = () => {
    const months = [
        { value: 'jan', label: 'January' },
        { value: 'feb', label: 'February' },
        { value: 'mar', label: 'March' },
        { value: 'apr', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'jun', label: 'June' },
        { value: 'jul', label: 'July' },
        { value: 'aug', label: 'August' },
        { value: 'sep', label: 'September' },
        { value: 'oct', label: 'October' },
        { value: 'nov', label: 'November' },
        { value: 'dec', label: 'December' },
    ];
    const currentMonthValue = months[new Date().getMonth()].value;
    const [formData, setFormData] = useState({
        source_code_from: "",
        source_code_to: "",
        month_to: "",
        month_from: currentMonthValue,
        availableBalance: 0,
        amount: "",
        attachment: null,
        converted: "",
        purpose: "",
    });
    const [budgetSourceCodeOptions, setBudgetSourceCodeOptions] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const handleCheckboxChange = (value) => {
        setSelectedCurrencies(value); // Only one can be active
    };
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

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

    const handleBudgetSourceCodeChange = async (selected) => {
        controller.abort();
        const newController = new AbortController();

        if (!selected) {
            setFormData((prev) => ({
                ...prev,
                source_code_from: null,
                source_code_to: null,
                month_to: "",
                month_from: "",
                availableBalance: 0,
                purpose: "",
                attachment: null,
                converted: "",
            }));
            return;
        }

        const value = selected.value;

        // ✅ update FROM (main field)
        setFormData((prev) => ({
            ...prev,
            source_code_from: value,
            // source_code_to: value, // 🔥 auto-copy if you want same default
        }));

        // fetch related data
        const response = await GetBudgetSourceCode(
            { source_code: value },
            { signal: newController.signal }
        );

        const data = response.data[0][0];

        setFormData((prev) => ({
            ...prev,
            availableBalance: data.available_balance,
        }));
    };
    
    const handleChangeMonthFrom = async (e) => {
        const monthFrom = e.target.value;
        const data =[
            { month: monthFrom, source_code: formData.source_code_from },
        ]

        try {
            const response = await GetAvailableBalByMonthAPI(data);
            console.log(response.data[0]);
            setFormData((prev) => ({
                ...prev,
                month_from: monthFrom,
                availableBalance: response.data[0],
            }));
        } catch (error) {
            console.error("Error fetching available balance:", error);
            setFormData((prev) => ({
                ...prev,
                month_from: monthFrom,
                availableBalance: 0, // default to 0 on error
            }));
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

    useEffect(() => {
        if(formData.source_code_from){
            handleChangeMonthFrom({
                target: { value: currentMonthValue }
            });
        }
    }, [formData.source_code_from]);
    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
        ...formData,
        [name]:
            type === "checkbox" ? checked : files ? files[0] : value,
        });
        if (files && files[0]) {
            setFileName(files[0].name);
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
            const response = await AddRealignmentRequest(data);
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

    const clearForm = async () => {
        setFormData({
            source_code_from: "",
            source_code_to: "",
            month_to: "",
            month_from: currentMonthValue,
            availableBalance: 0,
            amount: "",
            attachment: "",
            converted: "",
            purpose: "",
        });
        setFileName("");
        setSelectedCurrencies([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        console.log(formData);
    };

    return (
        <div className="min-h-screen py-4 px-3">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-xl p-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            Re-alignment Request
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Submit a budget realignment request
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            Available Balance
                        </p>
                        <p className="text-sm font-bold text-green-600">
                            ${Number(formData.availableBalance || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative w-1/2">
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                />
                            </svg>
                        </div>

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

                        {/* Loading Spinner inside search bar */}
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

                {/* Main Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">

                    {/* FROM */}
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                            From
                        </div>

                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Budget Source Code
                        </label>

                        <Select
                            options={budgetSourceCodeOptions}
                            value={
                                formData.source_code_from
                                    ? budgetSourceCodeOptions.find(
                                        (o) => o.value === formData.source_code_from
                                    )
                                    : null
                            }
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    source_code_from: selected
                                        ? selected.value
                                        : null
                                }))
                            }
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
                                    zIndex: 9999
                                }),
                            }}
                        />
                    </div>

                    {/* TO */}
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                            To
                        </div>

                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Budget Source Code
                        </label>

                        <Select
                            options={budgetSourceCodeOptions}
                            value={
                                formData.source_code_to
                                    ? budgetSourceCodeOptions.find(
                                        (o) => o.value === formData.source_code_to
                                    )
                                    : null
                            }
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    source_code_to: selected
                                        ? selected.value
                                        : null
                                }))
                            }
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
                                    zIndex: 9999
                                }),
                            }}
                        />
                    </div>

                    {/* FROM MONTH */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            From Month
                        </label>

                        <select
                            name="month_from"
                            value={formData.month_from}
                            onChange={handleChangeMonthFrom}
                            className="w-full h-9 border border-gray-300 rounded-md px-2
                                    text-sm bg-white focus:outline-none
                                    focus:ring-2 focus:ring-blue-100
                                    focus:border-blue-500"
                            required
                        >
                            <option value="">Select month</option>
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TO MONTH */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            To Month
                        </label>

                        <select
                            name="month_to"
                            value={formData.month_to}
                            onChange={handleChange}
                            className="w-full h-9 border border-gray-300 rounded-md px-2
                                    text-sm bg-white focus:outline-none
                                    focus:ring-2 focus:ring-blue-100
                                    focus:border-blue-500"
                            required
                        >
                            <option value="">Select month</option>
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Amount
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                $
                            </span>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full h-9 border border-gray-300 rounded-md
                                        pl-7 pr-3 text-sm
                                        focus:outline-none focus:ring-2
                                        focus:ring-blue-100 focus:border-blue-500"
                                required
                            />
                        </div>

                        {formData.converted && (
                            <p className="text-[11px] text-gray-500 mt-1">
                                Converted:{" "}
                                <span className="font-semibold text-gray-700">
                                    ${formData.converted}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* CURRENCY */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Currency
                        </label>

                        <div className="h-9 flex items-center gap-4 px-3 border border-gray-200 rounded-md bg-gray-50">
                            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCurrencies === "Peso"}
                                    onChange={() => handleCheckboxChange("Peso")}
                                    className="w-3.5 h-3.5"
                                />
                                Peso
                            </label>

                            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCurrencies === "USDollar"}
                                    onChange={() => handleCheckboxChange("USDollar")}
                                    className="w-3.5 h-3.5"
                                />
                                US Dollar
                            </label>

                            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCurrencies === "BZDollar"}
                                    onChange={() => handleCheckboxChange("BZDollar")}
                                    className="w-3.5 h-3.5"
                                />
                                Belize Dollar
                            </label>
                        </div>
                    </div>

                    {/* ATTACHMENT */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Attachment
                        </label>

                        <label className="inline-flex items-center gap-2 h-9 px-3
                                        border border-gray-300 rounded-md
                                        text-xs font-medium text-gray-600
                                        cursor-pointer hover:bg-gray-50 transition">
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

                            <input
                                type="file"
                                name="attachment"
                                onChange={handleChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                        </label>

                        {fileName && (
                            <span className="ml-2 text-[11px] text-green-600">
                                {fileName}
                            </span>
                        )}
                    </div>

                    {/* PURPOSE */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Purpose / Details
                        </label>

                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            placeholder="Enter purpose or additional details..."
                            rows="2"
                            className="w-full border border-gray-300 rounded-md px-3 py-2
                                    text-sm resize-none
                                    focus:outline-none focus:ring-2
                                    focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
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
                        className="h-9 px-4 rounded-md bg-blue-600 text-white
                                text-xs font-semibold
                                hover:bg-blue-700 transition
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitLoading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default realignmentFormRequest