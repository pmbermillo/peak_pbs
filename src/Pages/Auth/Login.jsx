import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import objFormValidator from "../../utils/formValidator";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import useRerender from "../../Hooks/useReRender";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { LoginAPI } from '../../Api/Auth/AuthApi';

const objValidator = { ...objFormValidator };

objValidator.default = {
  required: (_, obj) => `${obj.label} is required`,
  email: (_, obj) => "email should be a valid email",
  numeric: (_, obj) => `${obj.label} should be a number`,
};

objValidator.fields = {
  employee_id: { required: true, label: "Employee ID", inputType: "employee_id", numeric: true, type: "text", placeHolder: "Enter your Employee ID" },
  password: { required: true, label: "Password", inputType: "password", type: "password", placeHolder: "Enter your Password" },
};

const initialData = {
  employee_id: "",
  password: "",
};

const iconMap = {
  employee_id: <IoPersonCircleOutline />,
  password: <FaFingerprint />,
};

const Login = () => {
    const [objFormData, setFormData] = useState(initialData);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const Render = useRerender();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
        console.log(location);
        const from = location.state?.from || "/dashboard"; // Fallback if no previous route
        console.log("Navigating to:", from);  // Debugging log
        navigate(from, { replace: true });
        }
    }, [navigate, location]);

    const handleSubmitLogin = async () => {
        if (objValidator.validateFields(objFormData)) {
            Render();
            return false;
        }
        
        try {
            const data = await LoginAPI(objFormData);
            console.log(data)
            const urlToken = data.data.token;
            localStorage.setItem('auth_token', urlToken);
            // setUser(data.data.user); // Set user data in context
            navigate('/dashboard');
            toast.success(data.data.message || 'Login successful!');
        } catch (error) {
            console.error('Login failed:', error);
            toast.error(error.response.data.error || 'Login failed!');
        }
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-black animate-gradient-x"></div>

            {/* Login card */}
            <div className="relative z-10 w-[90%] max-w-md p-6 bg-white/10 backdrop-blur-lg flex flex-col items-center gap-6 rounded-3xl shadow-2xl border border-white/20">
                
                {/* Logo */}
                <img src="/" alt="logo" className="w-16 md:w-20" />

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
                Accounting Budget System
                </h1>

                {/* Subtitle */}
                <p className="text-sm text-gray-300 text-center">
                    Welcome Back!
                </p>

                {/* Form Fields */}
                <div className="w-full flex flex-col gap-4">
                {Object.entries(objValidator.fields).map(([key, value], index) => (
                    <div key={index} className="relative flex items-center w-full">
                    {/* Floating label container */}
                    <div className="relative flex-1">
                        {iconMap[value.inputType] && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{iconMap[value.inputType]}</div>
                        )}
                        <input
                        type={value.type === "password" ? (showPassword ? "text" : "password") : value.type}
                        value={objFormData[key]}
                        onChange={(e) => setFormData({ ...objFormData, [key]: e.target.value })}
                        placeholder=" "
                        className={`peer w-full rounded-xl p-3 pl-10 text-white bg-gray-900/60 border border-gray-700 focus:border-blue-500 outline-none transition`}
                        />
                        <label className="absolute left-10 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-400">
                        {value.placeHolder}
                        </label>

                        {/* Password toggle */}
                        {value.type === "password" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white">
                            {showPassword ? (
                            <FaRegEyeSlash className="h-5 w-5" onClick={togglePasswordVisibility} />
                            ) : (
                            <FaRegEye className="h-5 w-5" onClick={togglePasswordVisibility} />
                            )}
                        </div>
                        )}
                    </div>

                    {/* Error message */}
                    {objValidator.getErrorType(key) && (
                        <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
                        {objValidator.getError(key, objValidator.fields[key])}
                        </p>
                    )}
                    </div>
                ))}
                </div>

                {/* Login Button */}
                <button
                className="w-full flex items-center justify-center gap-2 mt-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/30 transition"
                onClick={handleSubmitLogin}
                >
                    <CiLogin className="h-5 w-5" />
                <span>Login</span>
                </button>
            </div>

            {/* Gradient animation keyframes */}
            <style>
                {`
                @keyframes gradient-x {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                background-size: 200% 200%;
                animation: gradient-x 10s ease infinite;
                }
                `}
            </style>
        </div>
        // <div className="w-full h-screen flex items-center justify-center">
        //     <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-gray-900 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg">
        //         <img src="/" alt="logo" className="w-12 md:w-14" />
        //         <h1 className="text-lg md:text-xl font-semibold text-white">Accounting Budget System</h1>
        //         <p className="text-xs md:text-sm text-gray-500 text-center">Welcome Back!
        //             {/* <span className="text-white"> Sign up</span> */}
        //         </p>
        //         <div className="w-full flex flex-col gap-3">
        //         {Object.entries(objValidator.fields).map(([key, value], index) => (
        //             <div key={index} className="relative flex items-center bg-gray-800 p-2 rounded-xl gap-2 text-white">
        //             <div className="flex items-center gap-2">
        //                 {
        //                 iconMap[value.inputType]
        //                 }
        //                 {(value.type === "text" || value.type === "password") && (
        //                 <>
        //                     <input
        //                     type={value.type === "password" ? (showPassword ? "text" : "password") : value.type}
        //                     value={objFormData[key]}
        //                     onChange={(e) => setFormData({ ...objFormData, [key]: e.target.value })}
        //                     placeholder={value.placeHolder}
        //                     className="bg-transaprent border-0 w-full outline-none text-sm md:text-base"
        //                     />
        //                     {value.type === "password" && (
        //                     <div className="absolute right-2 top-4">
        //                         {showPassword ? (
        //                         <FaRegEyeSlash
        //                             className="absolute right-2 cursor-pointer"
        //                             onClick={togglePasswordVisibility}
        //                         />) : (
        //                         <FaRegEye
        //                             className="absolute right-2 cursor-pointer"
        //                             onClick={togglePasswordVisibility} />)}
        //                     </div>
        //                     )}
        //                 </>
        //                 )}
        //             </div>
        //             {
        //                 objValidator.getErrorType(key) && (
        //                 <p className="text-red-500 text-xs mt-1">
        //                     {objValidator.getError(key, objValidator.fields[key])}
        //                 </p>
        //                 )
        //             }
        //             </div>
        //         ))}
        //         </div>
        //         <button className="bg-blue-500 p-2 rounded-xl mt-3 hover:text-blue-600 text-sm md:text-base text-white" onClick={handleSubmitLogin}>
        //             <CiLogin className="inline" /> Login 
        //         </button>
        //         {/* <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100">
        //             <ArrowRightOnRectangleIcon className="h-6 w-6 text-blue-600" />
        //             <span>Sign In</span>
        //         </button> */}
        //     </div>
        // </div>
    )
}

export default Login
