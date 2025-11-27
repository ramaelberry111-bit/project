import { createContext, useState } from "react";
import { food_list as seedFoodList, menu_list } from "../assets/assets";
export const StoreContext = createContext(null);

const DELIVERY_FEE = 150;
const ORDER_STATUS_STEPS = [
    "Order confirmed",
    "Being prepared",
    "Out for delivery",
    "Delivered"
];

const deriveFoodMeta = (item) => {
    const lowerName = item.food_name.toLowerCase();
    const vegetarianCategories = ["Salad", "Pure Veg", "Cake", "Deserts", "Pasta", "Noodles", "Rolls"];
    const vegetarianKeywords = ["veg", "vegan", "cheese", "paneer", "mushroom", "pancake", "rice", "pulao", "noodles", "cake", "ice cream", "lasagna", "bread"];
    const isVegetarian =
        vegetarianCategories.includes(item.food_category) ||
        vegetarianKeywords.some((keyword) => lowerName.includes(keyword));
    let priceTier = "Medium";
    if (item.food_price <= 360) {
        priceTier = "Low";
    } else if (item.food_price > 600) {
        priceTier = "High";
    }
    const rating = Number((4 + ((item.food_id % 5) * 0.1)).toFixed(1));
    const reviews = 24 + item.food_id * 2;
    return {
        ...item,
        isVegetarian,
        priceTier,
        rating,
        reviews
    };
};

const StoreContextProvider = (props) => {

    const [foodData] = useState(() => seedFoodList.map(deriveFoodMeta));
    const [cartItems, setCartItems] = useState({});
    const [favoriteItems, setFavoriteItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [currentTrackingId, setCurrentTrackingId] = useState(null);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;
            const updated = { ...prev };
            if (updated[itemId] <= 1) {
                delete updated[itemId];
            } else {
                updated[itemId] = updated[itemId] - 1;
            }
            return updated;
        });
    };

    const toggleFavorite = (itemId) => {
        setFavoriteItems((prev) => {
            const updated = { ...prev };
            if (updated[itemId]) {
                delete updated[itemId];
            } else {
                updated[itemId] = true;
            }
            return updated;
        });
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = foodData.find((product) => product.food_id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.food_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const placeOrder = (deliveryData, paymentData = null) => {
        const itemsInCart = Object.entries(cartItems).filter(([, quantity]) => quantity > 0);
        if (itemsInCart.length === 0) {
            return null;
        }

        const orderedItems = itemsInCart.map(([id, quantity]) => {
            const itemInfo = foodData.find((product) => product.food_id === Number(id));
            return {
                ...itemInfo,
                quantity
            };
        }).filter(Boolean);

        const subtotal = getTotalCartAmount();
        const deliveryFee = subtotal === 0 ? 0 : DELIVERY_FEE;
        const total = subtotal + deliveryFee;

        const newOrder = {
            id: Date.now(),
            items: orderedItems,
            subtotal,
            deliveryFee,
            total,
            statusIndex: 0,
            statusSteps: ORDER_STATUS_STEPS,
            createdAt: new Date().toISOString(),
            deliveryData,
            payment: paymentData
        };

        setOrders((prev) => [newOrder, ...prev]);
        setCartItems({});
        setCurrentTrackingId(newOrder.id);
        return newOrder.id;
    };

    const advanceOrderStatus = (orderId) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id !== orderId) return order;
                if (order.statusIndex >= order.statusSteps.length - 1) return order;
                return {
                    ...order,
                    statusIndex: order.statusIndex + 1
                };
            })
        );
    };

    const contextValue = {
        food_list: foodData,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        placeOrder,
        favoriteItems,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        orders,
        advanceOrderStatus,
        currentTrackingId,
        deliveryFeeAmount: DELIVERY_FEE
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;