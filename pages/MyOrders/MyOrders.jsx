import React, { useContext } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../Context/StoreContext'

const MyOrders = () => {
  const { orders, advanceOrderStatus } = useContext(StoreContext);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className='orders-empty'>You have not placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <p className='order-id'>Order #{order.id}</p>
                  <p className='order-date'>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <p className='order-total'>{order.total.toLocaleString('en-EG')} EGP</p>
              </div>
              <ul className='order-items'>
                {order.items.map((item) => (
                  <li key={item.food_id}>
                    <span>{item.food_name}</span>
                    <span>{item.quantity} x {item.food_price.toLocaleString('en-EG')} EGP</span>
                  </li>
                ))}
              </ul>
              <div className="order-status">
                {order.statusSteps.map((step, index) => (
                  <span key={step} className={index <= order.statusIndex ? 'active' : ''}>{step}</span>
                ))}
              </div>
              {order.statusIndex < order.statusSteps.length - 1 && (
                <button className='status-button' onClick={()=>advanceOrderStatus(order.id)}>
                  Next status
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
