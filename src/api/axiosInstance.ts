import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

function createAxiosIntance() {
  const urlBack = import.meta.env.VITE_URL_BACK;
  const axiosIntance = axios.create({
    baseURL: urlBack, 
    timeout: 40000, // 40 segundos
  });

  axiosIntance.interceptors.request.use(
    async (config) => {
      const token = await useAuthStore.getState().token;
      const userId = await useAuthStore.getState().userId;
      const userName = await useAuthStore.getState().userName;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["x-userId"] = userId;
        config.headers["x-userName"] = userName;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosIntance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error?.response?.status === 401) {
        try {
          // Limpia estado y storage, y redirige al login
          useAuthStore.getState().onLogout();
          try {
            localStorage.removeItem("foodranktoken");
          } catch {
            // ignore
          }
          if (typeof window !== "undefined") {
            // HashRouter
            window.location.assign('login');
          }
        } catch {
          // ignore side effects errors
        }
        return Promise.reject({
          statusCode: 401,
          message:
            error?.response?.data?.message ||
            "Sesión vencida, inicie de nuevo",
          code: error?.code,
          ...error?.response?.data,
        });
      } else if (error?.response?.status === 500) {
        return Promise.reject({
          statusCode: error.response.status,
          message: error?.response?.data?.message || "Error interno",
          code:error?.code,
          ...error?.response?.data,
          
        });
      }

      return Promise.reject({
        statusCode: error?.response?.status || 404,
        message:
          error?.response?.data?.message ||
          "Error en la conexión, verifica la ruta de la API, o el estado de la conexión",
        code:error?.code,
        ...error?.response?.data,
      });
    }
  );
  return axiosIntance;
}

export default createAxiosIntance();