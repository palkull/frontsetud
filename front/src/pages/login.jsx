import { Link } from "react-router-dom"; // Asegúrate de usar 'react-router-dom' en lugar de 'react-router'
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { login, error:loginErrors } = useAuth();
  const onSubmit = handleSubmit(data => {
    login(data);
    console.log(data);
    

  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Page</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Please enter your credentials to log in.</p>
            {loginErrors.map((error, i) => (
              <div key={i} className="bg-red-500 text-white p-2 mb-4">
                {typeof error === "object" ? error.message : error}
              </div>
            ))}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="correo" className="block text-gray-700 dark:text-gray-300 mb-1">Username:</label>
            <input
              type="text"
              {...register("correo", { required: true })}
              id="correo"
              name="correo"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white"
            />
            {errors.correo && (
              <span className="text-red-500 text-sm">This field is required</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">Password:</label>
            <input
              type="password"
              {...register("password", { required: true })}
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white"
            />
            {errors.correo && (
              <span className="text-red-500 text-sm">This field is required</span>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/inicio" className="text-blue-500 hover:underline">Go to Usuarios</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
