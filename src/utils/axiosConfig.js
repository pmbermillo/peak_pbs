import axios from "axios";
// import { isTokenExpired } from "./jwtUtils";
 
// export const imageUrl = "http://127.0.0.1:8000/storage/";
 
// const baseURL = "https://clinic.peakoutsourcing1.tech/api";
const baseURL = "http://127.0.0.1:8000/api";
const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout for requests
  headers: {
    Accept: "application/json", // Requesting JSON format
  },
});
 
export default axiosInstance;