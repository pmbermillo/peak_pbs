import React, {useState} from 'react'
import { ResetPassword } from '../../Api/Auth/AuthApi.jsx';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await ResetPassword({ currentPassword, password });
            console.log(response);
        } catch (error) {
            console.log(error);
        }

        setMessage("Password reset request submitted!");
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
                Reset Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                Please enter your current and new password.
                </p>

                {message && (
                <div className="mb-4 text-center text-blue-600 font-medium">
                    {message}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                        </label>
                        <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                        </label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                        </label>
                        <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile