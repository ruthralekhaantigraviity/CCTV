import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api/auth` 
    : '/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        setUser(res.data.user);
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const register = async (userData) => {
        const res = await axios.post(`${API_URL}/register`, userData);
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const login = async (userData) => {
        const res = await axios.post(`${API_URL}/login`, userData);
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = async (profileData) => {
        const token = localStorage.getItem('token');
        const res = await axios.put(`${API_URL}/profile`, profileData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
            setUser(res.data.user);
        }
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
