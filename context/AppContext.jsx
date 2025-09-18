'use client'
// Removed dummy data imports. We'll fetch real data from our API routes.
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY

    const { user } = useUser()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            const res = await fetch('/api/service-provider/list', { cache: 'no-store' });
            if (!res.ok) {
                console.error('Failed to fetch providers');
                return;
            }
            const json = await res.json();
            if (json?.ok && Array.isArray(json.data)) {
                setProducts(json.data);
            } else if (Array.isArray(json?.data)) {
                // fallback shape { data: [...] }
                setProducts(json.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching providers:', err);
            setProducts([]);
        }
    }

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/auth/register', { method: 'GET', cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                // API returns { user }
                const u = json?.user || null;
                setUserData(u);
                setIsSeller(u?.role === 'serviceProvider');
            } else {
                setUserData(null);
                setIsSeller(false);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setUserData(null);
            setIsSeller(false);
        }
    }

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                // In services, use hourlyRate if available; fallback to 0
                const price = itemInfo?.pricing?.hourlyRate ?? 0;
                totalAmount += price * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        user,
        currency,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}