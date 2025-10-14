import axiosInstance from "../../utils/axiosConfig";

export const UploadFile = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/upload-budget",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while uploading budget: ", error);
        throw error;
    } 
}

export const GetBudget = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/get-budget",
            data,
            { 
              headers: {    
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching expense account: ", error);
        throw error;
    }
}

export const UpdateBudget = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/update-budget",
            data,
            { 
              headers: {    
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching expense account: ", error);
        throw error;
    }
}

export const DeleteBudget = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-budget",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting expense account: ", error);
        throw error;
    }
}