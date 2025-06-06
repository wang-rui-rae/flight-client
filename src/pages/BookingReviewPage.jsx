import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getBookDetails} from '../services/bookApi';
import dayjs from 'dayjs';
import { FaUser, FaPlane, FaCalendarAlt, FaClock, FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa';

const BookingReviewPage = () => {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookDetails(`${bookingReference}`);
        setBooking(response);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: `/bookings/${bookingReference}` } });
        } else if (err.response?.status === 404) {
          setError('Booking not found');
        } else {
          setError('Failed to load booking details. Please try again.');
          console.error('Failed to fetch booking:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingReference, navigate]);

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format('dddd, MMMM D, YYYY');
  };

  const formatTime = (dateTime) => {
    return dayjs(dateTime).format('HH:mm');
  };

  const calculateDuration = (departure, arrival) => {
    const diff = dayjs(arrival).diff(dayjs(departure), 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => navigate('/bookings')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate('/bookings')}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        ← Back to Bookings
      </button>

      {/* flight picture */}
      <div className="h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
        {booking.coverImageUrl ? (
          <img 
            src={booking.coverImageUrl} 
            alt="Flight cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {booking.airline}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 bg-blue-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Booking #{booking.bookingReference}</h2>
              <p className="text-blue-100">
                Booked on {formatDate(booking.bookingTime)}
              </p>
            </div>
            <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
              {dayjs(booking.departureTime).isAfter(dayjs()) ? 'UPCOMING' : 'COMPLETED'}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* flight information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaPlane className="mr-2" /> Flight Details
            </h3>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500">Departure</p>
                <p className="text-xl font-bold">{booking.departureAirport}</p>
                <p className="text-gray-600">{formatDate(booking.departureTime)}</p>
                <p className="text-2xl font-medium">{formatTime(booking.departureTime)}</p>
              </div>

              <div className="flex flex-col items-center mx-4 my-4">
                <FaPlane className="text-gray-400 text-xl transform rotate-90" />
                <p className="text-sm text-gray-500 mt-2">
                  {calculateDuration(booking.departureTime, booking.arrivalTime)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500">Arrival</p>
                <p className="text-xl font-bold">{booking.arrivalAirport}</p>
                <p className="text-gray-600">{formatDate(booking.arrivalTime)}</p>
                <p className="text-2xl font-medium">{formatTime(booking.arrivalTime)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaTicketAlt className="text-gray-400 mr-2" />
                <span>Flight Number: {booking.flightNumber}</span>
              </div>
              <div className="flex items-center">
                <FaPlane className="text-gray-400 mr-2" />
                <span>Airline: {booking.airline}</span>
              </div>
            </div>
          </div>
          
          {/* book information */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Booking Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-500">Passengers</p>
                  <p className="font-medium">{booking.passengerCount}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaMoneyBillWave className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-500">Total Price</p>
                  <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-500">Booking Date</p>
                  <p className="font-medium">{formatDate(booking.bookingTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-500">Booking Time</p>
                  <p className="font-medium">{formatTime(booking.bookingTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;
