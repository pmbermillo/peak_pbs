import axiosInstance from "../../utils/axiosConfig";

export const LoginAPI = async (credentials) => {
    try {
        return await axiosInstance.post("abs/login", credentials);
    } catch (error) {
        console.error("Error while logging in: ", error);
        throw error;
    }
}

export const LogoutAPI = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.error("No token found for logout.");
        return;
    }
    
    try {
        return await axiosInstance.post(
            "abs/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while logging out: ", error);
        throw error;
    }
}

export const getAuthUserAPI = async () => {
    try {
        return await axiosInstance.get("/auth/me");
    } catch (error) {
        console.error("Error while getting auth user: ", error);
        throw error;
    }
}

export const GetMyProfile = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "abs/me",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while getting my profile: ", error);
        throw error;
    }
}

export const ResetPassword = async (data) => {
    const token = localStorage.getItem('auth_token');
    
    try {
        return await axiosInstance.post(
            "abs/change-password",
            data, 
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            }
          );
    } catch (error) {
        console.error("Error while changing password: ", error);
        throw error;
    }
}