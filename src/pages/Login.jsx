import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Smart Cafeteria</h1>
                <p className="login-subtitle">Sign in to your account</p>

                {error && (
                    <div className="badge badge-error" style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '0.75rem',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p className="text-sm text-muted">
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                    <p className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>Demo Credentials:</p>
                    <p className="text-xs">Admin: admin@cafeteria.com / admin123</p>
                    <p className="text-xs">Student: john.keller@university.edu / john123</p>
                    <p className="text-xs">Staff: staff@cafeteria.com / staff123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
