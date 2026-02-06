import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, queueAPI, forecastsAPI, slotsAPI } from '../services/api';

function UserDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myToken, setMyToken] = useState(null);
    const [queueStatus, setQueueStatus] = useState(null);
    const [todaySlots, setTodaySlots] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const [bookingsRes, tokenRes, queueRes, slotsRes, forecastRes] = await Promise.all([
                bookingsAPI.getAll(),
                queueAPI.getMyToken(),
                queueAPI.getStatus(),
                slotsAPI.getToday(),
                forecastsAPI.getToday()
            ]);

            setBookings(bookingsRes.data);
            setMyToken(tokenRes.data);
            setQueueStatus(queueRes.data);
            setTodaySlots(slotsRes.data);
            setForecasts(forecastRes.data);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCrowdLevel = (mealType) => {
        const forecast = forecasts.find(f => f.mealType === mealType);
        if (!forecast) return { level: 'Unknown', class: 'badge-neutral' };

        const demand = forecast.predictedDemand;
        if (demand < 80) return { level: 'Low', class: 'badge-success' };
        if (demand < 120) return { level: 'Moderate', class: 'badge-warning' };
        return { level: 'High', class: 'badge-error' };
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    const activeBooking = bookings.find(b => b.status === 'confirmed');
    const pastBookings = bookings.filter(b => b.status !== 'confirmed').slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Welcome, {user?.name}</h1>
                <p className="page-subtitle">Student ID: {user?.studentId || 'N/A'}</p>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-card-label">Your Token</div>
                    <div className="stat-card-value primary">
                        {myToken?.token?.tokenNumber || '--'}
                    </div>
                    <div className="stat-card-subtext">
                        {myToken?.token ? `Position: ${myToken.position}` : 'No active token'}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">Estimated Wait</div>
                    <div className="stat-card-value">{myToken?.estimatedWait || 0}</div>
                    <div className="stat-card-subtext">Minutes</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">Currently Serving</div>
                    <div className="stat-card-value">
                        {queueStatus?.currentlyServing?.tokenNumber || '--'}
                    </div>
                    <div className="stat-card-subtext">Counter 1</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">In Queue</div>
                    <div className="stat-card-value">{queueStatus?.waitingCount || 0}</div>
                    <div className="stat-card-subtext">People waiting</div>
                </div>
            </div>

            <div className="dashboard-grid-2">
                {/* Active Booking */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Active Booking</h3>
                    </div>

                    {activeBooking ? (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted">Token Number</span>
                                <span className="font-bold text-primary">{activeBooking.tokenNumber}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted">Meal Type</span>
                                <span style={{ textTransform: 'capitalize' }}>{activeBooking.slotId?.mealType}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted">Time Slot</span>
                                <span>{activeBooking.slotId?.startTime} - {activeBooking.slotId?.endTime}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted">Items</span>
                                <span>{activeBooking.menuItems?.length || 0} items</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted">Predicted Wait</span>
                                <span>{activeBooking.predictedWaitTime} min</span>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                                <div className="text-sm text-muted mb-1">Order Items:</div>
                                {activeBooking.menuItems?.map((item, idx) => (
                                    <div key={idx} className="text-sm">
                                        {item.quantity}x {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center" style={{ padding: '2rem' }}>
                            <p className="text-muted mb-2">No active booking</p>
                            <a href="/booking" className="btn btn-primary">Book a Meal</a>
                        </div>
                    )}
                </div>

                {/* Crowd Levels */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Today's Crowd Levels</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['breakfast', 'lunch', 'dinner'].map(meal => {
                            const crowd = getCrowdLevel(meal);
                            const slot = todaySlots.find(s => s.mealType === meal);
                            return (
                                <div key={meal} className="queue-item">
                                    <div>
                                        <div className="font-bold" style={{ textTransform: 'capitalize' }}>{meal}</div>
                                        <div className="text-xs text-muted">
                                            {slot ? `${slot.startTime} - ${slot.endTime}` : 'No slot'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge ${crowd.class}`}>{crowd.level}</span>
                                        {slot && (
                                            <div className="text-xs text-muted mt-1">
                                                {slot.bookedCount}/{slot.capacity} booked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Booking History */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent History</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Token</th>
                                <th>Meal</th>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                    <td className="font-bold">{booking.tokenNumber}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{booking.slotId?.mealType || 'N/A'}</td>
                                    <td>{booking.menuItems?.length || 0} items</td>
                                    <td>
                                        <span className={`badge ${booking.status === 'served' ? 'badge-success' :
                                                booking.status === 'cancelled' ? 'badge-error' :
                                                    'badge-neutral'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {pastBookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No history yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
