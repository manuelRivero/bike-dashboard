import axios from "axios";

const client = axios.create({
    baseURL: `https://bike-backend-73v5.onrender.com`,
})
export default client;