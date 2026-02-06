import { useState, useEffect } from 'react';
import { forecastsAPI, wasteAPI, sustainabilityAPI, preparationAPI } from '../services/api';
import '../styles/global.css';

const StaffForecast = () => {
    const [forecasts, setForecasts] = useState([]);
    const [accuracy, setAccuracy] = useState(null);
    const [wasteSummary, setWasteSummary] = useState(null);
    const [sustainability, setSustainability] = useState(null);
    const [preparations, setPreparations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('forecasts');
    const [selectedDate, setSelectedDate] = useState(
        new Date(Date.now() + 86400000).toISOString().split('T')[0]
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [forecastRes, accuracyRes, wasteRes, sustainRes, prepRes] = await Promise.all([
                forecastsAPI.getWeek(),
                forecastsAPI.getAccuracy(30),
                wasteAPI.getSummary(30),
                sustainabilityAPI.getMetrics(),
                preparationAPI.getRecommendations(selectedDate)
            ]);

            setForecasts(forecastRes.data);
            setAccuracy(accuracyRes.data);
            setWasteSummary(wasteRes.data);
            setSustainability(sustainRes.data);
            setPreparations(prepRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        setSelectedDate(e.target.value);
        try {
            const prepRes = await preparationAPI.getRecommendations(e.target.value);
            setPreparations(prepRes.data);
        } catch (error) {
            console.error('Error fetching preparations:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading forecast data...</p>
            </div>
        );
    }

    return (
        <div className="staff-forecast-page">
            <div className="page-header">
                <h1>Demand Forecasting & Sustainability</h1>
                <p>View predictions, waste metrics, and preparation recommendations</p>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'forecasts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('forecasts')}
                >
                    Forecasts
                </button>
                <button
                    className={`tab ${activeTab === 'preparation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preparation')}
                >
                    Preparation
                </button>
                <button
                    className={`tab ${activeTab === 'waste' ? 'active' : ''}`}
                    onClick={() => setActiveTab('waste')}
                >
                    Waste Tracking
                </button>
                <button
                    className={`tab ${activeTab === 'sustainability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sustainability')}
                >
                    Sustainability
                </button>
            </div>

            {/* Forecasts Tab */}
            {activeTab === 'forecasts' && (
                <div className="tab-content">
                    {/* Accuracy Card */}
                    {accuracy && (
                        <div className="metrics-grid">
                            <div className="metric-card highlight">
                                <div className="metric-value">{accuracy.accuracy?.toFixed(1)}%</div>
                                <div className="metric-label">Forecast Accuracy</div>
                                <div className="metric-sublabel">{accuracy.period}</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-value">{accuracy.forecastsWithData}</div>
                                <div className="metric-label">Forecasts Evaluated</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-value">{accuracy.meanAbsoluteError?.toFixed(1)}</div>
                                <div className="metric-label">Mean Absolute Error</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-value">{accuracy.mape?.toFixed(1)}%</div>
                                <div className="metric-label">MAPE</div>
                            </div>
                        </div>
                    )}

                    {/* Weekly Forecasts */}
                    <div className="card">
                        <h2>Weekly Demand Forecasts</h2>
                        <div className="forecast-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Day</th>
                                        <th>Meal</th>
                                        <th>Predicted Demand</th>
                                        <th>Weather</th>
                                        <th>Schedule</th>
                                        <th>Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecasts.slice(0, 21).map((forecast, index) => (
                                        <tr key={forecast._id || index}>
                                            <td>{new Date(forecast.date).toLocaleDateString()}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{forecast.dayOfWeek}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{forecast.mealType}</td>
                                            <td className="font-bold">{forecast.predictedDemand}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{forecast.weatherCondition}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{forecast.academicSchedule}</td>
                                            <td>
                                                <div className="confidence-bar">
                                                    <div
                                                        className="confidence-fill"
                                                        style={{
                                                            width: `${forecast.confidence}%`,
                                                            backgroundColor: forecast.confidence >= 80 ? 'var(--success)' :
                                                                forecast.confidence >= 60 ? 'var(--warning)' : 'var(--error)'
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="confidence-text">{forecast.confidence}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Preparation Tab */}
            {activeTab === 'preparation' && (
                <div className="tab-content">
                    <div className="card">
                        <div className="card-header-row">
                            <h2>Preparation Recommendations</h2>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="date-picker"
                            />
                        </div>

                        {preparations && (
                            <>
                                <p className="info-text">
                                    Recommendations for <strong>{preparations.dayOfWeek}, {preparations.date}</strong>
                                </p>

                                <div className="prep-grid">
                                    {preparations.recommendations?.map((rec, index) => (
                                        <div key={index} className="prep-card">
                                            <div className="prep-meal">{rec.mealType}</div>
                                            <div className="prep-item">{rec.foodItem}</div>
                                            <div className="prep-numbers">
                                                <div className="prep-stat">
                                                    <span className="stat-label">Predicted Demand</span>
                                                    <span className="stat-value">{rec.predictedDemand}</span>
                                                </div>
                                                <div className="prep-stat highlight">
                                                    <span className="stat-label">Recommended Qty</span>
                                                    <span className="stat-value">{rec.recommendedQuantity}</span>
                                                </div>
                                                <div className="prep-stat">
                                                    <span className="stat-label">Historical Waste</span>
                                                    <span className="stat-value">{rec.historicalWaste}%</span>
                                                </div>
                                            </div>
                                            <div className="prep-reason">{rec.adjustmentReason}</div>
                                            <div className="prep-confidence">
                                                Confidence: {rec.confidence}%
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {preparations.notes && (
                                    <div className="notes-section">
                                        <h4>Notes</h4>
                                        <ul>
                                            {preparations.notes.map((note, i) => (
                                                <li key={i}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Waste Tab */}
            {activeTab === 'waste' && (
                <div className="tab-content">
                    {wasteSummary && (
                        <>
                            <div className="metrics-grid">
                                <div className="metric-card warning">
                                    <div className="metric-value">{wasteSummary.wastePercentage?.toFixed(1)}%</div>
                                    <div className="metric-label">Waste Percentage</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{wasteSummary.totalWasted}</div>
                                    <div className="metric-label">Total Wasted (servings)</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{wasteSummary.totalWasteWeight?.toFixed(1)} kg</div>
                                    <div className="metric-label">Waste Weight</div>
                                </div>
                                <div className="metric-card danger">
                                    <div className="metric-value">₹{wasteSummary.estimatedCost?.toFixed(0)}</div>
                                    <div className="metric-label">Estimated Cost</div>
                                </div>
                            </div>

                            <div className="card">
                                <h2>Top Wasted Items</h2>
                                {wasteSummary.topWastedItems?.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Food Item</th>
                                                <th>Total Wasted</th>
                                                <th>Waste %</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wasteSummary.topWastedItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.foodItem}</td>
                                                    <td>{item.totalWasted}</td>
                                                    <td>
                                                        <span className={`badge ${item.wastePercent > 20 ? 'danger' : item.wastePercent > 10 ? 'warning' : 'success'}`}>
                                                            {item.wastePercent?.toFixed(1)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="empty-state">No waste data recorded yet. Start logging waste to see insights.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Sustainability Tab */}
            {activeTab === 'sustainability' && (
                <div className="tab-content">
                    {sustainability && (
                        <>
                            <div className="metrics-grid">
                                <div className="metric-card success large">
                                    <div className="metric-value">{sustainability.sustainabilityScore}</div>
                                    <div className="metric-label">Sustainability Score</div>
                                    <div className="metric-sublabel">Out of 100</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{sustainability.wasteReductionPercent?.toFixed(1)}%</div>
                                    <div className="metric-label">Waste Reduction</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{sustainability.foodUtilizationPercent?.toFixed(1)}%</div>
                                    <div className="metric-label">Food Utilization</div>
                                </div>
                                <div className="metric-card eco">
                                    <div className="metric-value">{sustainability.co2SavedKg?.toFixed(1)} kg</div>
                                    <div className="metric-label">CO₂ Saved</div>
                                </div>
                            </div>

                            <div className="card">
                                <h2>Performance Metrics</h2>
                                <div className="sustainability-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Forecast Accuracy</span>
                                        <span className="detail-value">{sustainability.forecastAccuracy?.toFixed(1)}%</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Total Meals Served</span>
                                        <span className="detail-value">{sustainability.totalMealsServed}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Waste Per Meal</span>
                                        <span className="detail-value">{sustainability.wastePerMeal?.toFixed(2)} servings</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Cost Savings</span>
                                        <span className="detail-value highlight">₹{sustainability.costSavings?.toFixed(0)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Period</span>
                                        <span className="detail-value">{sustainability.period}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StaffForecast;
