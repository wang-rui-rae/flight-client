import { useState } from 'react';
import FlightSearchForm from '../components/FlightSearchForm';
import { searchFlights } from "../services/flightApi";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
   const navigate = useNavigate();

  const handleSearch = async (searchParams) => {
    try {
      // invoke api for search
      const results = await searchFlights(searchParams);

      // navigate results
      navigate("/search-results", { state: { results } });
    } catch (error) {
      console.error("Search failed:", error);
      alert("Failed to search flights. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 rounded-lg overflow-hidden shadow-md">
        <img 
          src="/flight_img.jpg" 
          alt="Airline" 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Flight Search</h2>
        <FlightSearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default HomePage;