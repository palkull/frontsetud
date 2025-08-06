import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import { addAdminRequest, getAdminsRequest, deleteAdminRequest } from '../api/auth.admin';
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
            setIsAuth(true);
            setAdmin(res.data);
        } catch (error) {
            setError([error.response ? error.response.data : 'An error occurred']);
            setIsAuth(false);
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
        Cookies.remove('token');
        setIsAuth(false);
        setAdmin(null);

    }
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

    return (
        <AuthContext.Provider value={{
            admin,
            setAdmin,
            signup,
            register,
            getUsers,
            createUser,
            deleteUsers,
            login,
            isAuth,
            setIsAuth,
            error,
            setError,
            loading,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
