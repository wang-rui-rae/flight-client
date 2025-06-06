import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightTable from '../components/FlightTable';

const SearchResultsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const results = state?.results || {
    data:{
    departureFlights: [],
    returnFlights: []
    },
    isRoundTrip: false
  };

  const departureFlights = results.data.departureFlights || [];
  const returnFlights = results.data.returnFlights || [];

  const handleSelectFlight = (flightId) => {
    navigate(`/flight/${flightId}`);
  };

  const handleNewSearch = () => {
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Flight Search Results</h1>
        <button
          onClick={handleNewSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          New Search
        </button>
      </div>

      <FlightTable 
        flights={departureFlights} 
        title="Departure Flights"
        onSelect={handleSelectFlight}
      />

      {returnFlights.length != 0 && (
        <FlightTable 
          flights={returnFlights} 
          title="Return Flights"
          onSelect={handleSelectFlight}
        />
      )}

      {departureFlights.length === 0 && 
        (returnFlights.length === 0) && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No flights found matching your search criteria
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search parameters
          </p>
          <button
            onClick={handleNewSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Modify Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;