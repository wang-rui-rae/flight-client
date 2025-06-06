import { useState } from "react";
import dayjs from "dayjs";

const FlightSearchForm = ({ onSearch }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    departureAirport: "",
    arrivalAirport: "",
    dates: [dayjs()],
    passengerCount: 1,
  });

  const handleTripTypeChange = (e) => {
    const roundTrip = e.target.value === "round";
    
    setIsRoundTrip(roundTrip);
    
    setFormData(prev => {
      const newDates = [...prev.dates];
      if (roundTrip && newDates.length < 2) {
        newDates.push(dayjs().add(1, "week"));
      } else if (!roundTrip && newDates.length > 1) {
        newDates.pop();
      }
      return { ...prev, dates: newDates };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, index) => {
    const newDates = [...formData.dates];
    newDates[index] = date;
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const handlePassengerChange = (value) => {
    setFormData({ ...formData, passengerCount: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const departureDate = formData.dates[0]?.isValid() 
        ? formData.dates[0].format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
      
      const returnDate = isRoundTrip && formData.dates[1]?.isValid()
        ? formData.dates[1].format("YYYY-MM-DD")
        : undefined;

      const params = {
        departureAirport: formData.departureAirport,
        arrivalAirport: formData.arrivalAirport,
        departureDate,
        returnDate,
        passengerCount: formData.passengerCount,
        isRoundTrip
      };
      onSearch(params);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateValue = (index) => {
    return formData.dates[index]?.isValid() 
      ? formData.dates[index].format("YYYY-MM-DD")
      : "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="tripType"
            value="oneway"
            checked={!isRoundTrip}
            onChange={handleTripTypeChange}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">One Way</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="tripType"
            value="round"
            checked={isRoundTrip}
            onChange={handleTripTypeChange}
            className="form-radio text-blue-600"
          />
          <span className="ml-2">Round Trip</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Airport
          </label>
          <input
            type="text"
            name="departureAirport"
            value={formData.departureAirport}
            onChange={handleInputChange}
            placeholder="Enter the departure city"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arrival Airport
          </label>
          <input
            type="text"
            name="arrivalAirport"
            value={formData.arrivalAirport}
            onChange={handleInputChange}
            placeholder="Enter the destination city"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Date
          </label>
          <input
            type="date"
            value={getDateValue(0)}
            onChange={(e) => handleDateChange(dayjs(e.target.value), 0)}
            min={dayjs().format("YYYY-MM-DD")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {isRoundTrip && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input
              type="date"
              value={getDateValue(1)}
              onChange={(e) => handleDateChange(dayjs(e.target.value), 1)}
              min={getDateValue(0) || dayjs().format("YYYY-MM-DD")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Passengers
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={formData.passengerCount}
          onChange={(e) => handlePassengerChange(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Searching..." : "Search Flights"}
      </button>
    </form>
  );
};

export default FlightSearchForm;  
