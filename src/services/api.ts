import axios from "axios";

const api = axios.create({
    baseURL: "https://6b052ff5db01cf4636082dad.mockapi.io/api/v1",
    timeout: 10000,
});
export default api;