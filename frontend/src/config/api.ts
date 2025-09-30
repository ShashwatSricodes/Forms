const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
};
