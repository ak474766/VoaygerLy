"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookProviderPage() {
  const { id } = useParams(); // provider id
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    date: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10),
    time: "10:00",
    duration: 60
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/service-provider/detail?id=${id}`, { cache: 'no-store' });
      if (res.ok) {
        const j = await res.json();
        const data = j?.data || j?.provider;
        setProvider(data || null);
        if (data?.serviceAreas?.[0]?.areaName) {
          setForm((f) => ({ ...f, city: data.serviceAreas[0].areaName }));
        }
      }
    };
    if (id) load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: id,
          category: provider?.categories?.[0] || 'other',
          description: form.description || `Booking for ${provider?.businessName || 'service'}`,
          scheduledDate: form.date,
          scheduledTime: form.time,
          duration: Number(form.duration || 60),
          address: form.address, city: form.city, state: form.state, pincode: form.pincode,
          paymentMethod: 'cod'
        })
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        alert('Booking created!');
        router.push(`/messages/${json.data?._id}`);
      } else {
        alert('Failed: ' + (json?.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Book Service</h1>
        {provider && (
          <div className="mb-6 text-gray-700">
            <div className="font-semibold">{provider.businessName}</div>
            <div>₹{provider?.pricing?.hourlyRate ?? 0}/hr • ⭐ {Number(provider?.rating?.average || 0).toFixed(1)}</div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Describe your service requirement"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} required />
            <input className="border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} required />
            <input className="border rounded px-3 py-2" placeholder="State" value={form.state} onChange={(e)=>setForm({...form,state:e.target.value})} required />
            <input className="border rounded px-3 py-2" placeholder="Pincode" value={form.pincode} onChange={(e)=>setForm({...form,pincode:e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="date" className="border rounded px-3 py-2" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} required />
            <input type="time" className="border rounded px-3 py-2" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} required />
            <input type="number" min="30" step="30" className="border rounded px-3 py-2" value={form.duration} onChange={(e)=>setForm({...form,duration:e.target.value})} required />
          </div>
          <button disabled={submitting} className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
