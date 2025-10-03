import apiClient from "@/api/axiosInstance";


const urlBack = import.meta.env.VITE_URL_BACK;
const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`${urlBack}auth/login`, {
      email,
      password,
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post(`${urlBack}auth/logout`);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async () => {
  try {
    const response = await apiClient.get(`${urlBack}auth/user`);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { login, logout, getUser };
