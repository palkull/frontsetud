import { Link } from "react-router-dom"; // Asegúrate de usar 'react-router-dom' en lugar de 'react-router'
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, error:loginErrors } = useAuth();

  const onSubmit = handleSubmit(data => {
    login(data);
    console.log(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 text-center">Bienvenido</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center">Inicia tu sesión</p>
        {loginErrors.map((error, i) => (
          <div key={i} className="bg-red-500/90 text-white p-2 mb-4 rounded shadow">
            {typeof error === "object" ? error.message : error}
          </div>
        ))}
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
            <input
              type="text"
              {...register("correo", { required: true })}
              id="correo"
              name="correo"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all duration-200"
              autoComplete="email"
            />
            {errors.correo && (
              <span className="text-red-500 text-xs mt-1 block">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                id="password"
                name="password"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-all duration-200"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-blue-500 dark:text-blue-400 hover:underline focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">Este campo es obligatorio</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl transition duration-300 focus:outline-none"
          >
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;
