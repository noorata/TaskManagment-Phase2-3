import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, 
});

let inMemoryToken = null;

export function setToken(token) {
  inMemoryToken = token;
}

function getToken() {
  return (
    inMemoryToken ||
    JSON.parse(localStorage.getItem("currentUser") || "{}").token ||
    ""
  );
}


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.errors?.[0]?.message ||
      err.response?.data?.message ||
      err.message ||
      "Network error";
    return Promise.reject(new Error(msg));
  }
);


export async function gql({ query, variables = {}, operationName }) {
  const { data } = await api.post("", { query, variables, operationName });
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data; 
}

export default api;
