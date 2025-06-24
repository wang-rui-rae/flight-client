import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { FaPlane, FaCreditCard, FaDollarSign, FaCoins, FaMoneyBill } from 'react-icons/fa';
import { getFlightDetails } from "../services/flightApi";
import { searchBooks, createBooking } from "../services/bookApi"; // 导入createBooking方法

const FlightDetailPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const username = localStorage.getItem('username');

  // 用于获取画面价格的ref
  const totalPriceRef = useRef(null);

  // 新增预订状态
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingData, setBookingData] = useState(null); // 存储预订成功后返回的数据
  const [totalPrice, setTotalPrice] = useState(0); // 存储从画面获取的总价格

  useEffect(() => {
    if (location.state?.flight) {
      setFlight(location.state.flight);
      setLoading(false);
    } else {
      fetchFlightDetails();
    }
  }, [flightId, location.state]); // 移除flight依赖，避免无限循环

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      const results = await getFlightDetails(`${flightId}`);
      console.log("flight data:", results);

      setFlight(results.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch flight details:', err);
      setError('Failed to load flight details. Please try again.');
    } finally {
      setLoading(false); // 确保无论如何都会结束加载状态
    }
  };

  // 从UI获取总价格
  const updateTotalPriceFromUI = () => {
    if (flight && flight.totalfare) {
      const price = parseFloat(flight.totalfare);
      if (!isNaN(price)) {
        setTotalPrice(price);
      }
    } else if (totalPriceRef.current) {
      const priceText = totalPriceRef.current.textContent;
      const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(price)) {
        setTotalPrice(price);
      }
    }
  };

  // 添加新的useEffect来处理价格更新
  useEffect(() => {
    // 当flight数据或DOM元素就绪时更新价格
    if (flight || totalPriceRef.current) {
      updateTotalPriceFromUI();
    }
  }, [flight, totalPriceRef.current]);

  // 修改现有函数：使用createBooking方法替代原来的逻辑
  const handleBookFlight = async () => {
    if (!flight) return;
    
    setLoading(true); // 这里的loading可能是误用，应该是setBookingProcessing?
    setBookingProcessing(true);
    setBookingError(null);
    
    try {
      // 准备要发送的数据，包含flightId和从画面获取的总价格
      const bookingData = {
        username: username,
        flightId: flightId,
        totalPrice: totalPrice.toFixed(2)
      };
      
      console.log("发送到后端的预订数据:", bookingData);
      
      // 调用createBooking方法发送POST请求
      const response = await createBooking(bookingData);
      
      console.log("Booking response:", response);
      
      if (response && response.success) {
        setBookingSuccess(true);
        setBookingData(response.data); // 保存后端返回的预订信息
      } else {
        setBookingError(response?.message || 'Failed to create booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError('An error occurred while processing your booking. Please try again.');
    } finally {
      setLoading(false); // 这里的loading可能是误用，应该是setBookingProcessing?
      setBookingProcessing(false);
    }
  };

  // 保持原有函数不变
  const formatTime = (dateTime) => {
    return dayjs(dateTime).format('HH:mm');
  };

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format('ddd, MMMM D, YYYY');
  };

  const calculateDuration = (departure, arrival) => {
    const diff = dayjs(arrival).diff(dayjs(departure), 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  // 修改加载状态判断，仅当真正加载数据时显示
  if (loading && !flight) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading flight details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-600 mb-4">Flight not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Search
        </button>
      </div>
    );
  }

  // 修改预订成功页面：显示新的预订信息
  if (bookingSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold text-lg">Booking Successful!</h3>
          <p>Your flight has been successfully booked.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // 修改按钮：添加预订状态显示
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        ← Back to Results
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">Departure</p>
              <p className="text-xl font-bold">{flight.departure}</p>
              <p className="text-gray-600">{formatDate(flight.departureTimestamp)}</p>
              <p className="text-2xl font-medium">{formatTime(flight.departureTimestamp)}</p>
            </div>
            <div className="flex flex-col items-center mx-4 my-4">
              <FaPlane className="text-blue-500 text-xl transform" />
              <p className="text-sm text-gray-500 mt-2">
                {calculateDuration(flight.departureTimestamp, flight.destinationTimestamp)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Arrival</p>
              <p className="text-xl font-bold">{flight.destination}</p>
              <p className="text-gray-600">{formatDate(flight.destinationTimestamp)}</p>
              <p className="text-2xl font-medium">{formatTime(flight.destinationTimestamp)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-semibold text-lg mb-3">Price Details</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <FaCreditCard className="text-blue-500 mr-2" />
                <span>Seat Class: {flight.positionlevel}</span>
              </div>
              <div className="flex items-center">
                <FaDollarSign className="text-blue-500 mr-2" />
                <span>Base Fare: ${flight.basefare}</span>
              </div>
              <div className="flex items-center">
                <FaCoins className="text-blue-500 mr-2" />
                <span>Tax Fare: ${flight.taxfare}</span>
              </div>
              <div className="flex items-center" ref={totalPriceRef}>
                <FaMoneyBill className="text-blue-500 mr-2" />
                <span>Total Fare: ${flight.totalfare || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <button
              onClick={handleBookFlight}
              disabled={loading || bookingProcessing}
              className={`w-full py-3 px-4 rounded-md text-white font-bold ${loading || bookingProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {bookingProcessing 
                ? 'Processing Booking...' 
                : 'Book Flight'}
            </button>
            
            {/* 新增：预订错误提示 */}
            {bookingError && (
              <p className="text-red-500 mt-2 text-center">{bookingError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailPage;
