import { useState, useEffect } from 'react';
import { analyticsAPI, queueAPI, forecastsAPI, bookingsAPI } from '../services/api';

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [queueStatus, setQueueStatus] = useState(null);
    const [forecasts, setForecasts] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [dashboardRes, queueRes, forecastRes, bookingsRes] = await Promise.all([
                analyticsAPI.getDashboard(),
                queueAPI.getStatus(),
                forecastsAPI.getToday(),
                bookingsAPI.getAllAdmin()
            ]);

            setDashboard(dashboardRes.data);
            setQueueStatus(queueRes.data);
            setForecasts(forecastRes.data);
            setRecentBookings(bookingsRes.data.slice(0, 10));
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return <div className="text-center">Loading dashboard...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">System overview and queue management</p>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-card-label">Today's Bookings</div>
                    <div className="stat-card-value primary">{dashboard?.today?.totalBookings || 0}</div>
                    <div className="stat-card-subtext">Total reservations</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">Served</div>
                    <div className="stat-card-value">{dashboard?.today?.totalServed || 0}</div>
                    <div className="stat-card-subtext">Completed orders</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">In Queue</div>
                    <div className="stat-card-value">{queueStatus?.waitingCount || 0}</div>
                    <div className="stat-card-subtext">Waiting tokens</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">Avg Wait Time</div>
                    <div className="stat-card-value">{dashboard?.today?.avgWaitTime || 0}</div>
                    <div className="stat-card-subtext">Minutes</div>
                </div>
            </div>

            {/* Queue and Forecasts */}
            <div className="dashboard-grid-2">
                {/* Queue Management */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Queue Management</h3>

                    </div>

                    <div className="queue-display" style={{ padding: '1rem' }}>
                        <div className="queue-current-label">Currently Serving</div>
                        <div className="queue-current-token">
                            {queueStatus?.currentlyServing?.tokenNumber || '--'}
                        </div>
                    </div>

                    <div className="queue-list">
                        {queueStatus?.waitingTokens?.map((token, index) => (
                            <div key={token._id} className={`queue-item ${index === 0 ? 'current' : ''}`}>
                                <span className="queue-token">{token.tokenNumber}</span>
                                <span className="queue-wait">{token.estimatedWaitTime} min</span>
                            </div>
                        ))}
                        {(!queueStatus?.waitingTokens || queueStatus.waitingTokens.length === 0) && (
                            <p className="text-muted text-center">No tokens in queue</p>
                        )}
                    </div>
                </div>

                {/* Today's Forecast */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Today's Demand Forecast</h3>
                    </div>

                    <div className="dashboard-grid-3" style={{ marginBottom: 0 }}>
                        {forecasts.map(forecast => (
                            <div key={forecast._id} className="forecast-card">
                                <div className="forecast-meal">{forecast.mealType}</div>
                                <div className="forecast-demand">{forecast.predictedDemand}</div>
                                <div className="forecast-confidence">
                                    Confidence: {forecast.confidence}%
                                </div>
                                <div className="forecast-bar">
                                    <div
                                        className="forecast-bar-fill"
                                        style={{ width: `${forecast.confidence}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {forecasts.length === 0 && (
                        <p className="text-muted text-center">No forecasts available</p>
                    )}
                </div>
            </div>

            {/* Demand by Meal */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                    <h3 className="card-title">Demand Distribution</h3>
                </div>
                <div className="dashboard-grid-3" style={{ marginBottom: 0 }}>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">Breakfast</span>
                            <span className="text-sm font-bold">{dashboard?.demandByMeal?.breakfast || 0}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${Math.min((dashboard?.demandByMeal?.breakfast || 0) / 2, 100)}%` }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">Lunch</span>
                            <span className="text-sm font-bold">{dashboard?.demandByMeal?.lunch || 0}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${Math.min((dashboard?.demandByMeal?.lunch || 0) / 2, 100)}%` }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">Dinner</span>
                            <span className="text-sm font-bold">{dashboard?.demandByMeal?.dinner || 0}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${Math.min((dashboard?.demandByMeal?.dinner || 0) / 2, 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Bookings</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Student</th>
                                <th>Meal Type</th>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="font-bold">{booking.tokenNumber}</td>
                                    <td>{booking.user?.name || 'N/A'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{booking.slot?.mealType || 'N/A'}</td>
                                    <td>{booking.menuItems?.length || 0} items</td>
                                    <td>
                                        <span className={`badge ${booking.status === 'served' ? 'badge-success' :
                                            booking.status === 'confirmed' ? 'badge-info' :
                                                booking.status === 'cancelled' ? 'badge-error' :
                                                    'badge-neutral'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No bookings yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
