import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AUTH_API = `${API_BASE_URL}/api/auth`;
export const PATIENTS_API = `${API_BASE_URL}/api/patients`;
export const INTERVENTIONS_API = `${API_BASE_URL}/api/interventions`;

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const savedToken = localStorage.getItem("token");

if (savedToken) {
  setAuthToken(savedToken);
}