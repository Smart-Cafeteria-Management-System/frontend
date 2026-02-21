import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, totpAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const data = response.data;

            if (data.totp_setup_required) {
                return { success: false, totpSetupRequired: true, tempToken: data.temp_token };
            }
            if (data.totp_required) {
                return { success: false, totpRequired: true, tempToken: data.temp_token };
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data?.message || 'Login failed'
            };
        }
    };

    const firstSetupTotp = async (tempToken) => {
        try {
            const response = await totpAPI.firstSetup(tempToken);
            return { success: true, qrCode: response.data.qrCode, secret: response.data.secret };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to initiate 2FA setup' };
        }
    };

    const firstConfirmTotp = async (tempToken, code) => {
        try {
            const response = await totpAPI.firstConfirm(tempToken, code);
            const data = response.data;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Invalid OTP code' };
        }
    };

    const verifyTotp = async (tempToken, code) => {
        try {
            const response = await authAPI.verifyTotp(tempToken, code);
            const data = response.data;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Invalid OTP code'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const data = response.data;

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
            }

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        verifyTotp,
        firstSetupTotp,
        firstConfirmTotp,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff',
        isStudent: user?.role === 'student'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
