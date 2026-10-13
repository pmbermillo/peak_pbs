import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
    ArrowPathIcon,
    ArrowUpTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const ExcelUploadModal = ({
    isOpen,
    onClose,
    uploadFile,
    title = "Upload Excel File",
}) => {
    const [file, setFile] = useState(null);
    const [previewHeaders, setPreviewHeaders] = useState([]);
    const [previewData, setPreviewData] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    if (!isOpen) return null;

    // -----------------------------
    // Select & Preview Excel File
    // -----------------------------
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setResult(null);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);

                const workbook = XLSX.read(data, {
                    type: "array",
                });

                const firstSheet = workbook.Sheets[
                    workbook.SheetNames[0]
                ];

                const rows = XLSX.utils.sheet_to_json(
                    firstSheet,
                    {
                        header: 1,
                        defval: "",
                    }
                );

                if (rows.length > 0) {
                    setPreviewHeaders(rows[0]);
                    setPreviewData(rows.slice(1));
                }
            } catch (error) {
                console.error("Error reading Excel file:", error);

                setResult({
                    success: false,
                    message: "Unable to read the Excel file.",
                });
            }
        };

        reader.readAsArrayBuffer(selectedFile);

        // Allow selecting the same file again
        e.target.value = "";
    };

    // -----------------------------
    // Upload
    // -----------------------------
    const handleUpload = async () => {
        if (!file || uploading) return;

        const formData = new FormData();
        formData.append("file", file);

        let progressTimer;

        try {
            setUploading(true);
            setProgress(5);
            setResult(null);

            // Simulated progress while Laravel processes the file
            progressTimer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        return 90;
                    }

                    // Gradually slow down as it approaches 90%
                    if (prev >= 70) {
                        return prev + 1;
                    }

                    if (prev >= 40) {
                        return prev + 2;
                    }

                    return prev + 3;
                });
            }, 300);

            const response = await uploadFile(formData);

            // API finished
            clearInterval(progressTimer);

            setProgress(100);

            setResult({
                success: response.data?.status === "success",
                message:
                    response.data?.message ||
                    "File uploaded successfully.",
                data: response.data?.[0] ?? {},
            });

        } catch (error) {
            clearInterval(progressTimer);

            console.error("Error uploading file:", error);

            setProgress(100);

            setResult({
                success: false,
                message:
                    error?.response?.data?.message ||
                    "Upload failed. Please try again.",
            });
        } finally {
            setUploading(false);
        }
    };

    // -----------------------------
    // Close / Reset
    // -----------------------------
    const handleClose = () => {
        if (uploading) return;

        setFile(null);
        setPreviewHeaders([]);
        setPreviewData([]);
        setProgress(0);
        setResult(null);

        onClose();
    };

    // -----------------------------
    // File Size
    // -----------------------------
    const getFileSize = () => {
        if (!file) return "";

        const size = file.size / 1024 / 1024;

        return `${size.toFixed(2)} MB`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* ================= HEADER ================= */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <DocumentIcon className="w-5 h-5 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-gray-800">
                                {result
                                    ? "Upload Result"
                                    : title}
                            </h2>

                            {file && (
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {file.name}
                                </p>
                            )}
                        </div>

                    </div>

                    {!uploading && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}

                </div>

                {/* ================= UPLOAD PROGRESS ================= */}
                {uploading && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">

                        <div className="flex items-center justify-between mb-2">

                            <div className="flex items-center gap-2">

                                <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />

                                <span className="text-xs font-medium text-blue-700">
                                    Uploading...
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-blue-600">
                                {progress}%
                            </span>

                        </div>

                        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>
                )}

                {/* ================= RESULT ================= */}
                {result && !uploading && (
                    <div className="p-6">

                        <div
                            className={`rounded-xl border p-5 ${
                                result.success
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                {result.success ? (
                                    <CheckCircleIcon className="w-7 h-7 text-green-600 flex-shrink-0" />
                                ) : (
                                    <XCircleIcon className="w-7 h-7 text-red-600 flex-shrink-0" />
                                )}

                                <div>

                                    <h3
                                        className={`text-sm font-semibold ${
                                            result.success
                                                ? "text-green-800"
                                                : "text-red-800"
                                        }`}
                                    >
                                        {result.success
                                            ? "Upload Complete"
                                            : "Upload Failed"}
                                    </h3>

                                    <p
                                        className={`text-xs mt-1 ${
                                            result.success
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {result.message}
                                    </p>

                                </div>

                            </div>

                            {/* API Result */}
                            {result.success && result.data && (
                                <div className="mt-5">

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                                        {/* Total */}
                                        <div className="bg-white rounded-lg border border-green-100 p-3">
                                            <p className="text-[10px] text-gray-400">
                                                Total
                                            </p>
                                            <p className="text-lg font-semibold text-gray-700">
                                                {result.data.total ?? 0}
                                            </p>
                                        </div>

                                        {/* Added */}
                                        <div className="bg-white rounded-lg border border-green-100 p-3">
                                            <p className="text-[10px] text-gray-400">
                                                Added
                                            </p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {result.data.added ?? 0}
                                            </p>
                                        </div>

                                        {/* Updated */}
                                        <div className="bg-white rounded-lg border border-green-100 p-3">
                                            <p className="text-[10px] text-gray-400">
                                                Updated
                                            </p>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {result.data.updated ?? 0}
                                            </p>
                                        </div>

                                        {/* Errors */}
                                        <div className="bg-white rounded-lg border border-green-100 p-3">
                                            <p className="text-[10px] text-gray-400">
                                                Errors
                                            </p>
                                            <p className="text-lg font-semibold text-red-600">
                                                {result.data.errors ?? 0}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Error Details Button */}
                                    {result.data.errors > 0 &&
                                        result.data.error_details?.length > 0 && (
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowErrorDetails(true)}
                                                    className="text-xs font-medium text-red-600 hover:text-red-700"
                                                >
                                                    View error details
                                                </button>
                                            </div>
                                        )}

                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ================= FILE PREVIEW ================= */}
                {!result && !uploading && (

                    <div className="flex-1 overflow-hidden">

                        {/* File Selection */}
                        {!file && (
                            <div className="p-8">

                                <label
                                    className="
                                        flex flex-col items-center justify-center
                                        h-40
                                        border-2 border-dashed
                                        border-gray-200
                                        rounded-xl
                                        bg-gray-50
                                        hover:bg-blue-50/40
                                        hover:border-blue-300
                                        transition
                                        cursor-pointer
                                    "
                                >

                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                                        <ArrowUpTrayIcon className="w-6 h-6 text-blue-500" />
                                    </div>

                                    <p className="text-sm font-medium text-gray-700">
                                        Choose an Excel file
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        XLSX or XLS files
                                    </p>

                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                </label>

                            </div>
                        )}

                        {/* Spreadsheet */}
                        {file && (
                            <>
                                <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            Spreadsheet Preview
                                        </h3>

                                        <p className="text-[11px] text-gray-400">
                                            {previewData.length} rows
                                        </p>
                                    </div>

                                    <label className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">

                                        Change File

                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                    </label>

                                </div>

                                <div className="overflow-auto max-h-[55vh]">

                                    <table className="min-w-full text-xs">

                                        <thead className="sticky top-0 z-10 bg-gray-50">

                                            <tr>
                                                {previewHeaders.map(
                                                    (header, index) => (
                                                        <th
                                                            key={index}
                                                            className="
                                                                px-4 py-3
                                                                text-left
                                                                font-semibold
                                                                text-gray-600
                                                                border-b
                                                                border-gray-200
                                                                whitespace-nowrap
                                                            "
                                                        >
                                                            {header ||
                                                                `Column ${
                                                                    index + 1
                                                                }`}
                                                        </th>
                                                    )
                                                )}
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {previewData.map(
                                                (row, rowIndex) => (
                                                    <tr
                                                        key={rowIndex}
                                                        className="hover:bg-blue-50/40"
                                                    >

                                                        {previewHeaders.map(
                                                            (_, columnIndex) => (
                                                                <td
                                                                    key={
                                                                        columnIndex
                                                                    }
                                                                    className="
                                                                        px-4 py-2.5
                                                                        text-gray-600
                                                                        border-b
                                                                        border-gray-100
                                                                        whitespace-nowrap
                                                                    "
                                                                >
                                                                    {row[
                                                                        columnIndex
                                                                    ] ?? ""}
                                                                </td>
                                                            )
                                                        )}

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            </>
                        )}

                    </div>
                )}

                {/* ================= FOOTER ================= */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">

                    {!result && !uploading && file && (
                        <div className="flex items-center gap-2 min-w-0">

                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-green-600">
                                    XLS
                                </span>
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate max-w-xs">
                                    {file.name}
                                </p>

                                <p className="text-[10px] text-gray-400">
                                    {getFileSize()}
                                </p>
                            </div>

                        </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto">

                        {!result && !uploading && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="
                                        px-4 h-9
                                        rounded-lg
                                        border border-gray-200
                                        bg-white
                                        text-xs font-medium
                                        text-gray-600
                                        hover:bg-gray-100
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={!file}
                                    className="
                                        px-5 h-9
                                        rounded-lg
                                        bg-blue-600
                                        hover:bg-blue-700
                                        disabled:bg-gray-200
                                        disabled:text-gray-400
                                        disabled:cursor-not-allowed
                                        text-white
                                        text-xs font-semibold
                                        flex items-center gap-2
                                    "
                                >
                                    <ArrowUpTrayIcon className="w-4 h-4" />
                                    Upload File
                                </button>
                            </>
                        )}

                        {result && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className="
                                    px-5 h-9
                                    rounded-lg
                                    bg-gray-800
                                    hover:bg-gray-900
                                    text-white
                                    text-xs font-semibold
                                "
                            >
                                Done
                            </button>
                        )}

                    </div>

                </div>
                
                {showErrorDetails && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

                        <div className="w-full max-w-5xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        Upload Error Details
                                    </h3>

                                    <p className="text-[11px] text-gray-400 mt-1">
                                        {result?.data?.errors ?? 0} row(s) failed to process
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowErrorDetails(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>

                            </div>

                            {/* Error List */}
                            <div className="flex-1 overflow-auto">

                                {result?.data?.error_details?.map(
                                    (error, index) => (
                                        <div
                                            key={index}
                                            className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
                                        >

                                            <div className="flex items-start gap-4">

                                                {/* Row Number */}
                                                <div className="flex-shrink-0">

                                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-red-600">
                                                            {error.row}
                                                        </span>
                                                    </div>

                                                </div>

                                                {/* Error Information */}
                                                <div className="min-w-0 flex-1">

                                                    <p className="text-xs font-semibold text-gray-700">
                                                        Row {error.row}
                                                    </p>

                                                    <p className="text-xs text-red-600 mt-1">
                                                        {error.message}
                                                    </p>

                                                    {/* Row Data */}
                                                    {error.data && (
                                                        <details className="mt-2">
                                                            <summary className="text-[11px] text-gray-500 cursor-pointer hover:text-gray-700">
                                                                View row data
                                                            </summary>

                                                            <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-[10px] text-gray-600 overflow-auto">
                                                                {JSON.stringify(
                                                                    error.data,
                                                                    null,
                                                                    2
                                                                )}
                                                            </pre>
                                                        </details>
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">

                                <button
                                    type="button"
                                    onClick={() => setShowErrorDetails(false)}
                                    className="px-5 h-9 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelUploadModal;