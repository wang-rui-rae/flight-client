import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/bookApi';
import dayjs from 'dayjs';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState({ upcoming: [], pasted: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await searchBooks({ username, page: page - 1, size: 5 });
        const rawData = response?.data || {};

        if (!rawData.upcoming || !rawData.pasted) {
          throw new Error('Invalid response structure');
        }

        setBookings({
          upcoming: rawData.upcoming,
          pasted: rawData.pasted,
        });

        setTotalPages(rawData.totalPages || 1);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: '/bookings' } });
        } else {
          setError('Failed to load bookings. Please try again.');
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBookings();
    } else {
      navigate('/login');
    }
  }, [page, username, navigate]);

  const goToPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const renderTable = (title, data) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 italic">No bookings available</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Booking Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Flight Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Departure Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking) => (
                <tr key={booking.bookingReference} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{booking.bookingReference}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dayjs(booking.departureDate).format('YYYY-MM-DD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">My Bookings</h1>

      {renderTable('Upcoming Trips', bookings.upcoming)}
      {renderTable('Past Trips', bookings.pasted)}

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={goToPrevPage}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyBookingsPage;
