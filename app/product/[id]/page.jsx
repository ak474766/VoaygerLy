"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";

const Product = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [provider, setProvider] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [bookForm, setBookForm] = useState({
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    scheduledDate: new Date(Date.now()+24*60*60*1000).toISOString().slice(0,10),
    scheduledTime: "10:00",
    duration: 60,
  });
  const [contactText, setContactText] = useState("");
  const [reviewForm, setReviewForm] = useState({
    bookingId: "",
    rating: 5,
    title: "",
    comment: "",
    detailedRating: {
      punctuality: 5,
      quality: 5,
      professionalism: 5,
      communication: 5,
      valueForMoney: 5
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/service-provider/detail?id=${id}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data || json?.provider || null;
          setProvider(data);
          const firstPhoto = data?.photos?.[0] || null;
          setMainImage(firstPhoto);
          if (data?.serviceAreas?.[0]?.areaName) {
            setBookForm((f) => ({ ...f, city: data.serviceAreas[0].areaName }));
          }
        }
      } catch (e) {
        console.error('Failed to load provider', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?providerId=${id}`);
        if (res.ok) {
          const json = await res.json();
          setReviews(json.data || []);
        }
      } catch (e) {
        console.error('Failed to load reviews', e);
      }
    };
    if (id) loadReviews();
  }, [id]);

  // Load user's bookings with this provider
  useEffect(() => {
    const loadUserBookings = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/bookings/my');
        if (res.ok) {
          const json = await res.json();
          const providerBookings = (json.data || []).filter(
            booking => String(booking.serviceProviderId) === String(id) && 
                      booking.status === 'completed' && 
                      !booking.hasReview
          );
          setUserBookings(providerBookings);
        }
      } catch (e) {
        console.error('Failed to load user bookings', e);
      }
    };
    loadUserBookings();
  }, [user, id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${
            i <= Math.floor(rating || 0)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>
      );
    }
    return stars;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      const json = await res.json();
      if (res.ok && json?.ok) {
        alert('Review submitted successfully!');
        setReviewOpen(false);
        // Reload reviews
        const reviewsRes = await fetch(`/api/reviews?providerId=${id}`);
        if (reviewsRes.ok) {
          const reviewsJson = await reviewsRes.json();
          setReviews(reviewsJson.data || []);
        }
        // Reload user bookings
        const bookingsRes = await fetch('/api/bookings/my');
        if (bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          const providerBookings = (bookingsJson.data || []).filter(
            booking => String(booking.serviceProviderId) === String(id) && 
                      booking.status === 'completed' && 
                      !booking.hasReview
          );
          setUserBookings(providerBookings);
        }
      } else {
        alert('Review failed: ' + (json?.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Review error: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (!provider) return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14">
        <p className="text-gray-600">Service not found.</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-0 md:px-8 lg:px-12">
            <div className="rounded-lg overflow-hidden bg-gray-100 mb-4 aspect-video">
              {mainImage ? (
                <Image src={mainImage} alt={provider.businessName} className="w-full h-full object-cover" width={1280} height={720} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No photos</div>
              )}
            </div>
            {provider?.photos?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {provider.photos.slice(0, 8).map((photo, idx) => (
                  <button key={idx} onClick={() => setMainImage(photo)} className="rounded-lg overflow-hidden bg-gray-100 aspect-video">
                    <Image src={photo} alt={`photo-${idx}`} className="w-full h-full object-cover" width={400} height={225} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{provider.businessName}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <span className="font-semibold">⭐ {Number(provider?.rating?.average || 0).toFixed(1)}</span>
              <span>({provider?.rating?.count || 0} reviews)</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                ₹{provider?.pricing?.hourlyRate ?? 0}/hr
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{provider.description}</p>
            <div className="mt-6 space-y-3">
              {provider?.serviceAreas?.length > 0 && (
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Service Areas: </span>
                  {provider.serviceAreas.map((sa, idx) => (
                    <span key={idx} className="mr-2">{sa.areaName || `Area ${idx+1}`}</span>
                  ))}
                </div>
              )}
              {provider?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {provider.categories.map((c) => (
                    <span key={c} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 capitalize">
                      {String(c).replace('-', ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setBookOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Book Now</button>
              <button onClick={() => setContactOpen(true)} className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">Contact</button>
              {userBookings.length > 0 && (
                <button onClick={() => setReviewOpen(true)} className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Write Review</button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                      </div>
                      {review.title && <h4 className="font-medium text-gray-900">{review.title}</h4>}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-700 mb-3">{review.comment}</p>}
                  {review.detailedRating && Object.keys(review.detailedRating).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      {Object.entries(review.detailedRating).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="font-medium">{value}/5</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      {bookOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Book {provider?.businessName}</h3>
              <button onClick={() => setBookOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setBusy(true);
                const res = await fetch('/api/bookings/quick', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    providerId: provider._id,
                    category: provider?.categories?.[0] || 'other',
                    description: bookForm.description || `Booking for ${provider?.businessName}`,
                    scheduledDate: bookForm.scheduledDate,
                    scheduledTime: bookForm.scheduledTime,
                    duration: Number(bookForm.duration || 60),
                    address: bookForm.address,
                    city: bookForm.city,
                    state: bookForm.state,
                    pincode: bookForm.pincode,
                    paymentMethod: 'cod'
                  })
                });
                const json = await res.json();
                if (res.ok && json?.ok) {
                  alert('Booking created! Booking ID: ' + (json.data?.bookingId || json.data?._id) + '\nPayment Method: Cash on Delivery');
                  setBookOpen(false);
                } else {
                  alert('Booking failed: ' + (json?.error || 'Unknown error'));
                }
              } catch (e) {
                alert('Booking error: ' + e.message);
              } finally {
                setBusy(false);
              }
            }} className="space-y-4">
              <textarea className="w-full border rounded px-3 py-2" placeholder="Describe your service" value={bookForm.description} onChange={(e)=>setBookForm({...bookForm, description: e.target.value})} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Address" value={bookForm.address} onChange={(e)=>setBookForm({...bookForm,address:e.target.value})} required />
                <input className="border rounded px-3 py-2" placeholder="City" value={bookForm.city} onChange={(e)=>setBookForm({...bookForm,city:e.target.value})} required />
                <input className="border rounded px-3 py-2" placeholder="State" value={bookForm.state} onChange={(e)=>setBookForm({...bookForm,state:e.target.value})} required />
                <input className="border rounded px-3 py-2" placeholder="Pincode" value={bookForm.pincode} onChange={(e)=>setBookForm({...bookForm,pincode:e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="date" className="border rounded px-3 py-2" value={bookForm.scheduledDate} onChange={(e)=>setBookForm({...bookForm,scheduledDate:e.target.value})} required />
                <input type="time" className="border rounded px-3 py-2" value={bookForm.scheduledTime} onChange={(e)=>setBookForm({...bookForm,scheduledTime:e.target.value})} required />
                <input type="number" min="30" step="30" className="border rounded px-3 py-2" value={bookForm.duration} onChange={(e)=>setBookForm({...bookForm,duration:e.target.value})} required />
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800"><strong>Payment:</strong> Cash on Delivery (COD)</p>
                <p className="text-xs text-blue-600">Pay directly to the service provider when service is completed</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={()=>setBookOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button disabled={busy} className="px-5 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">{busy?'Submitting...':'Confirm Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Message {provider?.businessName}</h3>
              <button onClick={() => setContactOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              try {
                setBusy(true);
                const res = await fetch('/api/messages/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ providerId: provider._id, text: contactText })
                });
                const json = await res.json();
                if (res.ok && json?.ok) {
                  alert('Message sent! We created a thread for your inquiry. Check your messages to continue the conversation.');
                  setContactOpen(false);
                  setContactText("");
                } else {
                  alert('Message failed: ' + (json?.error || 'Unknown error'));
                }
              } catch (e) {
                alert('Message error: ' + e.message);
              } finally {
                setBusy(false);
              }
            }} className="space-y-4">
              <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Write your message" value={contactText} onChange={(e)=>setContactText(e.target.value)} required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={()=>setContactOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button disabled={busy} className="px-5 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">{busy?'Sending...':'Send Message'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Write Review for {provider?.businessName}</h3>
              <button onClick={() => setReviewOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Booking</label>
                <select 
                  className="w-full border rounded px-3 py-2" 
                  value={reviewForm.bookingId} 
                  onChange={(e)=>setReviewForm({...reviewForm, bookingId: e.target.value})} 
                  required
                >
                  <option value="">Select a completed booking</option>
                  {userBookings.map(booking => (
                    <option key={booking._id} value={booking._id}>
                      {booking.description} - {new Date(booking.scheduledDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Overall Rating</label>
                <select 
                  className="border rounded px-3 py-2" 
                  value={reviewForm.rating} 
                  onChange={(e)=>setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                >
                  {[5,4,3,2,1].map(r => (
                    <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <input 
                className="w-full border rounded px-3 py-2" 
                placeholder="Review title (optional)" 
                value={reviewForm.title} 
                onChange={(e)=>setReviewForm({...reviewForm, title: e.target.value})} 
              />
              <textarea 
                className="w-full border rounded px-3 py-2" 
                rows={4} 
                placeholder="Write your review" 
                value={reviewForm.comment} 
                onChange={(e)=>setReviewForm({...reviewForm, comment: e.target.value})} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="col-span-full text-sm font-medium">Detailed Ratings</h4>
                {Object.entries(reviewForm.detailedRating).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <select 
                      className="w-full border rounded px-2 py-1 text-sm" 
                      value={value} 
                      onChange={(e)=>setReviewForm({
                        ...reviewForm, 
                        detailedRating: {...reviewForm.detailedRating, [key]: Number(e.target.value)}
                      })}
                    >
                      {[5,4,3,2,1].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={()=>setReviewOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button disabled={busy || !reviewForm.bookingId} className="px-5 py-2 bg-yellow-500 text-white rounded disabled:opacity-50">
                  {busy ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Product;