import { createContext, useState, useContext, useEffect } from 'react';
import { registerRequest, loginRequest } from '../api/auth';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context; // <-- Agrega este return
}

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState([]);


    const signup = (admin) => {
        // Aquí puedes implementar la lógica de registro
        try {
            const res = registerRequest(admin);
            console.log(res.data)
            setAdmin(res.data);
            setIsAuth(true);
        } catch (error) {
            console.error('Error during signup:', error);
            setError([error.response ? error.response.data : 'An error occurred']);
            console.log(error)
            setIsAuth(false); 
        }
    }

    const login = async (admin) => {
        // Aquí puedes implementar la lógica de inicio de sesión
        try {
            const res = await loginRequest(admin);
            console.log(res.data)
        } catch (error) {
            console.error('Error during login:', error);
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false);
            return;
        }
    
        // Aquí puedes manejar la respuesta del inicio de sesión
    }

    useEffect(() => {
        if (error.length > 0) {
            const timer = setTimeout(() => {
                setError([]); // Limpiar errores después de 5 segundos
            }, 5000);
            return () => clearTimeout(timer); // Limpiar el timer al desmontar el componente
        }
    }, [error])

    return (
        <AuthContext.Provider value={{ 
            admin,
            setAdmin,
            signup,
            login,
            isAuth,
            setIsAuth,
            error,
            setError
            }}>
            {children}
        </AuthContext.Provider>
    );
};
