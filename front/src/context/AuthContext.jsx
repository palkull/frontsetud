import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

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
            login,
            isAuth,
            setIsAuth,
            error,
            setError,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
