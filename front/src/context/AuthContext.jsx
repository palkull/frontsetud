import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import { addAdminRequest, getAdminsRequest, deleteAdminRequest, getAdminRequest } from '../api/auth.admin';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true);

    const register = async (admin) => {
        try {
            const res = await addAdminRequest(admin);
            setAdmin(res.data);
            setIsAuth(true);
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false); 
        }
    }
 
    const createUser = async (admin) => {
    try {
        const res = await addAdminRequest(admin);
        return { success: true, user: res.data };
    } catch (error) {
        setError([error.response ? error.response.data : 'An error occurred']);
        return { success: false, error: error.response?.data };
    }
}
    const signup = async (admin) => {
        try {
            const res = await registerRequest(admin);
            setAdmin(res.data);
            setIsAuth(true);
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false); 
        }
    };

    const login = async (admin) => {
        try {
            const res = await loginRequest(admin);
            console.log("Login response:", res.data); // Debug log
            
            // Store complete user data including role
            setAdmin(res.data);
            setIsAuth(true);
            
            // Store in localStorage with complete user data
            localStorage.setItem('user', JSON.stringify(res.data));
            
            return res.data;
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Error en el inicio de sesión");
        }
    };

    const getUsers = async () => {
        try {
            const res = await getAdminsRequest();
            return res.data;
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            throw error;
        }
    };

    const getUserById = useCallback(async (id) => {
  try {
    const res = await getAdminRequest(id); // Asegúrate que esta ruta exista en el backend
    return res.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw new Error("No se pudo obtener el usuario");
  }
}, []);

    const deleteUsers = async (ids) => {
        try {
            // ids puede ser un solo id o un array de ids
            if (Array.isArray(ids)) {
                // Ejecuta todas las peticiones en paralelo
                const results = await Promise.all(
                    ids.map(id => deleteAdminRequest(id))
                );
                return results.map(res => res.data);
            } else {
                // Si es un solo id
                const res = await deleteAdminRequest(ids);
                return res.data;
            }
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            throw error;
        }  
    };
    const logout = () => {
        localStorage.removeItem('user');
        setAdmin(null);
        setIsAuth(false);
    };

    useEffect(() => {
        if (error.length > 0) {
            const timer = setTimeout(() => {
                setError([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        async function checkLogin (){
            const cookies = Cookies.get();
            
            if (!cookies.token) {
                setIsAuth(false);
                setLoading(false);
                return setAdmin(null);
                
            }
                
                try {
                    const res = await verifyTokenRequest(cookies.token);
                    console.log(res);
                    if (!res.data) {
                        setIsAuth(false);
                        setLoading(false);
                        return;
                    }

                    setIsAuth(true);
                    setAdmin(res.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    setIsAuth(false);
                    setAdmin(null);
                    setLoading(false);
                }
            
        };
        checkLogin();
    }, []);

    // Modify isAdmin function to properly check role
    const isAdmin = useCallback(() => {
        // Debug log
        console.log("Current admin state:", admin);
        return admin?.rol === true;
    }, [admin]);

    // Add function to check stored user on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    console.log("Stored user data:", userData); // Debug log
                    setAdmin(userData);
                    setIsAuth(true);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // En el return del AuthProvider, agregar isAdmin al value
    return (
        <AuthContext.Provider value={{
            admin,
            setAdmin,
            signup,
            register,
            getUsers,
            getUserById,
            createUser,
            deleteUsers,
            login,
            isAuth,
            setIsAuth,
            error,
            setError,
            loading,
            logout,
            isAdmin // Agregar la función helper
        }}>
            {children}
        </AuthContext.Provider>
    );
};
