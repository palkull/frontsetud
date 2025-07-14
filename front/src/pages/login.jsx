import { Link } from "react-router-dom"; // Asegúrate de usar 'react-router-dom' en lugar de 'react-router'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Page</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Please enter your credentials to log in.</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-1">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white"
            />
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
