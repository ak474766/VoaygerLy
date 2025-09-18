'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import Link from "next/link";

const MyOrders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/bookings/my', { cache: 'no-store' });
            const json = await res.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            setOrders(data);
        } catch (e) {
            console.error('Fetch bookings failed', e);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Bookings</h2>
                    {loading ? <Loading /> : (
                        <div className="max-w-5xl border-t border-gray-300 text-sm">
                            {orders.length === 0 && (
                                <div className="p-6 text-gray-500">No bookings yet.</div>
                            )}
                            {orders.map((b) => (
                                <div key={b._id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div className="flex-1 min-w-0">
                                        <p className="flex flex-col gap-1">
                                            <span className="font-medium text-base truncate">{b?.provider?.businessName || 'Service'}</span>
                                            <span className="text-gray-600">Category: {b.category}</span>
                                            <span className="text-gray-600">Scheduled: {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : '—'} {b.scheduledTime || ''}</span>
                                            <span className="text-gray-600">Location: {b?.serviceLocation?.city || '—'}, {b?.serviceLocation?.state || '—'} {b?.serviceLocation?.pincode ? `(${b.serviceLocation.pincode})` : ''}</span>
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="font-semibold mb-1">{currency}{b?.pricing?.totalAmount ?? 0}</p>
                                        <p className="text-xs uppercase tracking-wide">Status: <span className="font-medium">{b.status}</span></p>
                                        <p className="text-xs text-gray-500">Booking ID: {b.bookingId}</p>
                                        <div className="mt-3 flex gap-2 justify-end">
                                            {b?.serviceProviderId && (
                                                <Link href={`/product/${b.serviceProviderId}`} className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50">View Provider</Link>
                                            )}
                                            {b?._id && (
                                                <Link href={`/messages/${b._id}`} className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">Open Chat</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;