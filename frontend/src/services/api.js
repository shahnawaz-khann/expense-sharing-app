import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-sharing-app-b8cu.onrender.com"
});

export default api;