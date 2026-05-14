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

export const RejectBudgetRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/reject-budget-request",
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

export const GetBudgetSourceCodeOption = async (search) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/get-budget-source-code-options",
            search,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching budget source code: ", error);
        throw error;
    }
}

export const GetBudgetSourceCode = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/get-budget-source-code",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching budget source code details: ", error);
        throw error;
    }
}

export const GetClassificationOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-classification-options",
            {
              headers: {  
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching classification: ", error);
        throw error;
    }
}

export const GetModeOfPaymentOption = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-mode-of-payment-options",
            {
              headers: {  
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching mode of payment: ", error);
        throw error;
    }
}

export const GetRealignmentRequest = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post( 
            "/abs/get-realignment-request",
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

export const AddRealignmentRequest = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post( 
            "/abs/add-realignment-request",
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

export const ApproveRealignmentRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {        
        return await axiosInstance.post(  
            "/abs/approve-realignment-request",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while approving realignment request: ", error);
        throw error;
    }
}

export const RejectRealignmentRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/reject-realignment-request",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while rejecting realignment request: ", error);
        throw error;
    } 
}

export const GetAvailableBalByMonthAPI = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/get-available-balance-by-month",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while fetching available balance by month: ", error);
        throw error;
    }
}

export const UpdateRealignment = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            `/abs/update-realignment-request`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while updating realignment request: ", error);
        throw error;
    }
}

export const DeleteRealignmentRequest = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/delete-realignment-request",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting realignment request: ", error);
        throw error;
    }
}
