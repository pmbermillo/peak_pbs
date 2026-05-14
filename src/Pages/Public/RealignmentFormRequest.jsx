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

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
        ...formData,
        [name]:
            type === "checkbox" ? checked : files ? files[0] : value,
        });
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
            attachment: null,
            converted: "",
            purpose: "",
        });
        setSelectedCurrencies([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        console.log(formData);
    };

    return (
        <div >
            <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white shadow-md p-6 rounded-2xl space-y-4"
            >
            {/* Title */}
            <h2 className="text-xl font-extrabold text-center text-gray-900 tracking-wide">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Re-alignment Request Form
                </span>
                <div className="mt-2 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded"></div>
            </h2>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From */}
                <div>
                    <label className="block mb-1 font-semibold">From</label>
                </div>

                {/* To */}
                <div>
                    <label className="block mb-1 font-semibold">To</label>
                </div>

                {/* Client and Account */}
                <div>
                    <label className="block mb-1 font-semibold">Budget Source Code</label>
                    <Select 
                        options={budgetSourceCodeOptions}
                        value={
                            formData.source_code_from
                                ? budgetSourceCodeOptions.find((o) => o.value === formData.source_code_from)
                                : null // ✅ force clear
                        }
                        // onChange={handleBudgetSourceCodeChange}
                        onChange={(selected) => 
                            setFormData((prev) => ({
                                ...prev,
                                source_code_from: selected ? selected.value : null
                            }))
                        }
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
                <div>
                    <label className="block mb-1 font-semibold">Budget Source Code</label>
                    <Select 
                        options={budgetSourceCodeOptions}
                        value={
                            formData.source_code_to
                                ? budgetSourceCodeOptions.find((o) => o.value === formData.source_code_to)
                                : null // ✅ force clear
                        }
                        onChange={(selected) => 
                            setFormData((prev) => ({
                                ...prev,
                                source_code_to: selected ? selected.value : null
                            }))
                        }
                        placeholder="Select or type budget source code"
                        isClearable
                        isSearchable
                        menuPortalTarget={document.body}   // ⬅️ renders outside
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // keeps dropdown on top
                        }}
                        className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Project */}
                <div>
                    <label className="block mb-1 font-semibold">Month</label>
                    <select
                        name="month_from"
                        value={formData.month_from}
                        onChange={handleChangeMonthFrom}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Month --</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Month</label>
                    <select
                        name="month_to"
                        value={formData.month_to}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Month --</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Attachments */}
                <div>
                    <label className="block mb-1 font-semibold">Attachments (if any)</label>
                    <input
                    type="file"
                    name="attachment"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Optional — upload supporting files</p>
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

                {/* Purpose / Details */}
                <div>
                    <label className="block mb-1 font-semibold">Purpose / Details</label>
                    <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Enter purpose or details"
                    className="w-full border p-2 rounded"
                    rows="3"
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

export default realignmentFormRequest