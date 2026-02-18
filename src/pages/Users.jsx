import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await usersAPI.getAll();
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id) => {
        if (!confirm('Are you sure you want to block this user?')) return;
        try {
            await usersAPI.block(id);
            setMessage('User blocked successfully');
            fetchUsers();
        } catch (err) {
            setMessage('Failed to block user');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleUnblock = async (id) => {
        if (!confirm('Are you sure you want to unblock this user?')) return;
        try {
            await usersAPI.unblock(id);
            setMessage('User unblocked successfully');
            fetchUsers();
        } catch (err) {
            setMessage('Failed to unblock user');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">Manage users and blocking status</p>
            </div>

            {message && (
                <div className="badge badge-success" style={{
                    width: '100%', justifyContent: 'center', padding: '0.75rem', marginBottom: '1rem'
                }}>
                    {message}
                </div>
            )}

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><span className="badge badge-neutral">{user.role}</span></td>
                                    <td>
                                        {user.blocked ? (
                                            <span className="badge badge-error">Blocked</span>
                                        ) : (
                                            <span className="badge badge-success">Active</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.role !== 'admin' && (
                                            user.blocked ? (
                                                <button className="btn btn-success btn-sm" onClick={() => handleUnblock(user._id)}>
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button className="btn btn-error btn-sm" onClick={() => handleBlock(user._id)}>
                                                    Block
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;
