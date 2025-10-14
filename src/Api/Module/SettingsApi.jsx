import axiosInstance from "../../utils/axiosConfig";

export const GetUser = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-user",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating module: ", error);
        throw error;
    }
}

export const PostUser = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/post-user",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating module: ", error);
        throw error;
    }
}

export const DeleteUser = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-user",
            id, 
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting user: ", error);
        throw error;
    } 
}

export const PostBudgetSource = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/post-budget-source",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating budget source: ", error);
        throw error;
    }
}

export const GetBudgetSource = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-budget-source",
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

export const DeleteBudgetSource = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-budget-source",
            id, 
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting budget source: ", error);
        throw error;
    }
}

export const GetLeaders = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get( 
            "/abs/get-leaders",
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while fetching leaders: ", error);
        throw error;
    }
}

export const PostCategory = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/post-category",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while creating category: ", error);
        throw error;
    }
}

export const GetCategory = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-category",
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

export const DeleteCategory = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-category",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting category: ", error);
        throw error;
    } 
}

export const AddLocation = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/add-location",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while adding location: ", error);
        throw error;
    }
}

export const GetLocation = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-location",
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

export const DeleteLocation = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-location",
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while deleting location: ", error);
        throw error;
    }
}

export const AddProject = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/add-project",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while adding project: ", error);
        throw error;
    }
}
export const GetProject = async () => {
    const token = localStorage.getItem('auth_token');
    try { 
        return await axiosInstance.get(
            "/abs/get-projects",
            { 
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while fetching project: ", error);
        throw error;
    }
}

export const DeleteProject = async (id) => {  
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-project",  
            id,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    }
    catch (error) {
        console.error("Error while deleting project: ", error);
        throw error;
    } 
}

export const AddExpenseAccount = async (data) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(
            "/abs/add-expense-account",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send token in the Authorization header
              },
            }
          );
    } catch (error) {
        console.error("Error while adding expense account: ", error);
        throw error;
    } 
}

export const GetExpenseAccount = async () => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.get(
            "/abs/get-expense-accounts",
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

export const DeleteExpenseAccount = async (id) => {
    const token = localStorage.getItem('auth_token');
    try {
        return await axiosInstance.post(  
            "/abs/delete-expense-account",
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