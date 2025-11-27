import React, { useContext, useMemo } from 'react';
import './OrderTracking.css';
import { StoreContext } from '../../Context/StoreContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderTracking = () => {
    const { orders, currentTrackingId } = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId || currentTrackingId;

    const order = useMemo(
        () => orders.find((entry) => entry.id === orderId),
        [orders, orderId]
    );

    if (!order) {
        return (
            <div className='order-tracking'>
                <div className="tracking-card">
                    <h2>No order in progress</h2>
                    <p>Place a new order to start tracking.</p>
                    <Link to='/' className='primary-button'>Back to home</Link>
                </div>
            </div>
        );
    }

    const { statusSteps, statusIndex, deliveryData } = order;

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <div className='order-tracking'>
            <div className="tracking-card">
                <h2>Order in Progress</h2>
                <p className='tracking-subtitle'>Order #{order.id}</p>
                <div className="tracking-timeline">
                    {statusSteps.map((step, index) => (
                        <div key={step} className={`timeline-step ${index <= statusIndex ? 'active' : ''}`}>
                            <span className="timeline-index">{index + 1}</span>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
                <div className="tracking-location">
                    <h3>Delivery location</h3>
                    {deliveryData ? (
                        <>
                            <p>{deliveryData.street}, {deliveryData.city}</p>
                            <p>{deliveryData.state}, {deliveryData.country}, {deliveryData.zipcode}</p>
                            <div className="map-card">
                                Rider is on the way to {deliveryData.street}, {deliveryData.city}.
                            </div>
                        </>
                    ) : (
                        <p>Delivery details will appear here.</p>
                    )}
                </div>
                <button className='primary-button' onClick={handleBackHome}>Back to home</button>
            </div>
        </div>
    );
};

export default OrderTracking;

