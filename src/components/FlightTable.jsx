import React from 'react';
import dayjs from 'dayjs';

const FlightTable = ({ flights, title, onSelect }) => {
  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {title} <span className="text-sm text-gray-500">({flights.length} options found)</span>
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">FlightNo</th>
              <th className="py-3 px-4 text-left">From</th>
              <th className="py-3 px-4 text-left">To</th>
              <th className="py-3 px-4 text-left">DepartureDate</th>
              <th className="py-3 px-4 text-left">ArrivalDate</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flights.length > 0 ? (
              flights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{flight.flight_number}</td>
                  <td className="py-3 px-4">{flight.departure}</td>
                  <td className="py-3 px-4">{flight.destination}</td>
                  <td className="py-3 px-4">{formatDateTime(flight.departureTimestamp)}</td>
                  <td className="py-3 px-4">{formatDateTime(flight.destinationTimestamp)}</td>
                  <td className="py-3 px-4">{flight.duration}</td>
                  <td className="py-3 px-4 font-medium text-blue-600">${flight.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelect(flight.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No flights found for your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;