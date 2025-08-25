import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  const handleReview = async (bookingId, rating, reviewText) => {
    try {
      await axios.post(`${API_BASE_URL}/user/bookings/${bookingId}/review`, { rating, review: reviewText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Review submitted');
      fetchBookings();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8">My Bookings</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <div className="max-w-4xl mx-auto">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          bookings.map(b => (
            <div key={b._id} className="border-b py-4 flex flex-col gap-2">
              <div className="font-semibold">Photographer: {b.photographer?.user?.name}</div>
              <div className="text-sm text-gray-600">Status: {b.status}</div>
              <div className="text-sm text-gray-600">Date: {new Date(b.date).toLocaleDateString()}</div>
              {b.status === 'completed' && !b.reviewed && (
                <ReviewForm bookingId={b._id} onSubmit={handleReview} />
              )}
              {b.reviewed && (
                <div className="text-green-600">Reviewed</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ bookingId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bookingId, rating, review);
    setReview('');
    setRating(5);
  };

  return (
    <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
      <label>Rating:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Write your review..." className="border rounded p-2" />
      <button type="submit" className="bg-blue-600 text-white py-1 px-4 rounded">Submit Review</button>
    </form>
  );
};

export default Bookings;