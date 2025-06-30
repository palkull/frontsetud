import { Link } from "react-router";


function Login() {
   return (
      <>
         <h1>Login Page</h1>
         <p>Please enter your credentials to log in.</p>
            <form>
                <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link to="/usuarios">Go to Usuarios</Link>
      </>
   );
}
export default Login;