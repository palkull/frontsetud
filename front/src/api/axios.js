import axios from "axios";

const instance = axios.create({
  baseURL: "https://back-setued.onrender.com/",
  withCredentials: true,

})

export default instance;