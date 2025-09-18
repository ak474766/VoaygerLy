"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";

export default function MessagesThreadPage() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const { user } = useUser();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/messages?bookingId=${bookingId}`, { cache: 'no-store' });
      const json = await res.json();
      setMessages(Array.isArray(json?.data) ? json.data : []);
    } catch (e) {
      console.error('Load messages error', e);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (bookingId) load();
    const id = setInterval(() => { if (bookingId) load(); }, 5000);
    return () => clearInterval(id);
  }, [bookingId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, text })
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        setText("");
        await load();
      } else {
        alert('Failed to send: ' + (json?.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Send error: ' + e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow">
          <div className="px-4 py-3 border-b font-semibold">Conversation • Booking {bookingId}</div>
          <div className="p-4 h-[60vh] overflow-y-auto space-y-3">
            {loading && <div className="text-gray-500 text-sm">Loading messages…</div>}
            {!loading && !messages.length && (
              <div className="text-gray-500 text-sm">No messages yet. Say hello!</div>
            )}
            {messages.map((m) => {
              const isMine = user?.id && m.senderId === user.id;
              return (
                <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] inline-block px-3 py-2 rounded-lg text-sm shadow-sm ${isMine ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {m?.content?.text || '[Unsupported message]'}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="p-4 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button disabled={sending} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

