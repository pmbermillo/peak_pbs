import React from 'react'
import { useState } from "react";
import { toast } from 'react-toastify';

const realignmentFormRequest = () => {
    const [formData, setFormData] = useState({
        costCenter: "",
        department: "",
        client: "",
        siteLocation: "",
        dateRequested: "",
        targetMonth: "",
        targetCategory: "",
        targetProject: "",
        perHeadcount: false,
        sourceMonth: "",
        sourceCategory: "",
        sourceProject: "",
        expenseAccount: "",
        purpose: "",
        amount: "",
        attachment: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
        ...formData,
        [name]:
            type === "checkbox" ? checked : files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.info("This is a demo form. Submission functionality is not implemented yet.");
    };
    return (
        <div >
            <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white shadow-md p-6 rounded-2xl space-y-4"
            >
            {/* Title */}
            <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-wide">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Re-alignment Request Form
                </span>
                <div className="mt-2 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded"></div>
            </h2>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Budget Source */}
                <div>
                    <label className="block mb-1 font-semibold">Budget Source</label>
                    <select
                        name="costCenter"
                        value={formData.costCenter}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Budget Source --</option>
                        <option value="Operations">Operations</option>
                        <option value="Shared Services">Shared Services</option>
                        <option value="Global">Global</option>
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
                        <option value="">-- Select Location --</option>
                        <option value="Belize">Belize</option>
                        <option value="Makati">Makati</option>
                        <option value="Dumaguete">Dumaguete</option>
                    </select>
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
                        <option value="">-- Select Category --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
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
                    <label className="block mb-1 font-semibold">Client and Account</label>
                    <select
                        name="clientAccount"
                        value={formData.clientAccount}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Client and Account --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Client and Account</label>
                    <select
                        name="clientAccount"
                        value={formData.clientAccount}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Client and Account --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
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
                        <option value="">-- Select Project --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Project</label>
                    <select
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Project --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
                </div>

                {/* Expense Account */}
                <div>
                    <label className="block mb-1 font-semibold">Expense Account</label>
                    <select
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Project --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Expense Account</label>
                    <select
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Select Project --</option>
                        <option value="Sample 1">Sample 1</option>
                        <option value="Sample 2">Sample 2</option>
                        <option value="Sample 3">Sample 3</option>
                    </select>
                </div>

                {/* Date Needed */}
                <div>
                <label className="block mb-1 font-semibold">Date Needed</label>
                <input
                    type="date"
                    name="dateNeeded"
                    value={formData.dateNeeded}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                </div>

                {/* Amount */}
                <div>
                <label className="block mb-1 font-semibold">Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full border p-2 rounded"
                />
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

export default realignmentFormRequest