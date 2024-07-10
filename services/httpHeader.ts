import axios from "axios";

const MONGODB_API = process.env.EXPO_PUBLIC_MONGODB_API;

export default axios.create({
  baseURL: MONGODB_API,
  headers: {
    "Content-Type": "application/json",
  },
});
