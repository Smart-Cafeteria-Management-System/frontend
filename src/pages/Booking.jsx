import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slotsAPI, menuAPI, bookingsAPI } from '../services/api';

function Booking() {
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [slotsRes, menuRes] = await Promise.all([
                slotsAPI.getToday(),
                menuAPI.getAll()
            ]);
            setSlots(slotsRes.data.filter(s => s.status === 'available'));
            setMenuItems(menuRes.data.filter(m => m.available));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (item) => {
        const exists = selectedItems.find(i => i.itemId === item._id);
        if (exists) {
            setSelectedItems(selectedItems.filter(i => i.itemId !== item._id));
        } else {
            setSelectedItems([...selectedItems, { itemId: item._id, name: item.name, quantity: 1 }]);
        }
    };

    const updateQuantity = (itemId, quantity) => {
        setSelectedItems(selectedItems.map(item =>
            item.itemId === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const handleSubmit = async () => {
        if (!selectedSlot) {
            setError('Please select a time slot');
            return;
        }
        if (selectedItems.length === 0) {
            setError('Please select at least one menu item');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            await bookingsAPI.create({
                slotId: selectedSlot._id,
                menuItems: selectedItems
            });
            setSuccess('Booking confirmed! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    const categories = ['main', 'side', 'beverage', 'dessert'];

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Book a Meal</h1>
                <p className="page-subtitle">Select a time slot and choose your items</p>
            </div>

            {error && (
                <div className="badge badge-error" style={{
                    width: '100%', justifyContent: 'center', padding: '0.75rem', marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div className="badge badge-success" style={{
                    width: '100%', justifyContent: 'center', padding: '0.75rem', marginBottom: '1rem'
                }}>
                    {success}
                </div>
            )}

            <div className="dashboard-grid-2">
                {/* Time Slots */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Select Time Slot</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {slots.map(slot => (
                            <div
                                key={slot._id}
                                className={`queue-item ${selectedSlot?._id === slot._id ? 'current' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                <div>
                                    <div className="font-bold" style={{ textTransform: 'capitalize' }}>
                                        {slot.mealType}
                                    </div>
                                    <div className="text-xs text-muted">
                                        {slot.startTime} - {slot.endTime}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`badge ${slot.bookedCount < slot.capacity * 0.7 ? 'badge-success' : 'badge-warning'}`}>
                                        {slot.capacity - slot.bookedCount} spots
                                    </span>
                                </div>
                            </div>
                        ))}
                        {slots.length === 0 && (
                            <p className="text-muted text-center">No available slots</p>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Your Order</h3>
                    </div>

                    {selectedSlot && (
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>
                            <div className="text-sm text-muted">Selected Slot</div>
                            <div className="font-bold" style={{ textTransform: 'capitalize' }}>
                                {selectedSlot.mealType} ({selectedSlot.startTime} - {selectedSlot.endTime})
                            </div>
                        </div>
                    )}

                    {selectedItems.length > 0 ? (
                        <div>
                            {selectedItems.map(item => (
                                <div key={item.itemId} className="flex justify-between items-center mb-2">
                                    <span>{item.name}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span style={{ width: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? 'Booking...' : 'Confirm Booking'}
                            </button>
                        </div>
                    ) : (
                        <p className="text-muted text-center">No items selected</p>
                    )}
                </div>
            </div>

            {/* Menu Items */}
            <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
                <div className="card-header">
                    <h3 className="card-title">Menu Items</h3>
                </div>

                {categories.map(category => (
                    <div key={category} style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'capitalize', marginBottom: '1rem', color: 'var(--gray-600)' }}>
                            {category}
                        </h4>
                        <div className="menu-grid">
                            {menuItems.filter(item => item.category === category).map(item => {
                                const isSelected = selectedItems.some(i => i.itemId === item._id);
                                return (
                                    <div
                                        key={item._id}
                                        className="menu-item-card"
                                        style={{
                                            cursor: 'pointer',
                                            border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--gray-200)'
                                        }}
                                        onClick={() => toggleItem(item)}
                                    >
                                        <div className="menu-item-name">{item.name}</div>
                                        <div className="menu-item-price">Rs {item.price.toFixed(2)}</div>
                                        <div className="menu-item-nutrition">
                                            <span>{item.nutritionInfo?.calories || 0} cal</span>
                                            <span>{item.nutritionInfo?.protein || 0}g protein</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Booking;
