import React, { useState } from "react";
import { ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./component/LoginForm";

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const validateForm = (email:string, password: string): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (value: { email: string; password: string }): Promise<void> => {
    if (!validateForm(value.email, value.password)) return;

    setLoading(true);
    try {
      const result = await login(value.email, value.password);
      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error: unknown) {
      setErrors({ general: "Error inesperado al iniciar sesión" });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-800 to-red-800 p-8 text-center">
          <ChefHat className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">FoodRank</h1>
        </div>

        <div className="p-8">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <LoginForm errors={errors} loading={loading} submit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Login;
