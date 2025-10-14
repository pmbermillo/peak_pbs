import axiosInstance from "../../utils/axiosConfig";

export const GetBudgetSourceOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-budget-source-options",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching budget source: ", error);
        throw error;
    }
}

export const GetClientAccountOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-client-account-options",
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching client account: ", error);
        throw error;
    }
}

export const GetLocationOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-location-options",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching location: ", error);
        throw error;
    } 
}

export const GetCategoryOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-category-options",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching category: ", error);
        throw error;
    }
}

export const GetProjectOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-project-options",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching project: ", error);
        throw error;
    }
}

export const GetExpenseAccountOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get( 
            "/abs/get-expense-account-options",
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

export const GetCurrency = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post( 
            "/abs/get-currency",
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

export const AddBudgetRequest = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post( 
            "/abs/add-budget-request",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Set content type for file upload
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching expense account: ", error);
        throw error;
    }
}

export const GetBudgetRequest = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post( 
            "/abs/get-budget-request",
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
            "/abs/update-budget-request",
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

export const DeleteBudgetRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-budget-request",
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

export const ApproveBudgetRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/approve-budget-request",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while approving budget request: ", error);
        throw error;
    }
}




