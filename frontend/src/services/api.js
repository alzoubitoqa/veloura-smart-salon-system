import axios from "axios";

const API = axios.create({
  baseURL: "https://veloura-smart-salon-system.onrender.com/api",
});

export default API;