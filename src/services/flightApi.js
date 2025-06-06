import flightHttpClient from './http';

// query flight by input
export const searchFlights = async (params) => {
    return flightHttpClient.post('/flights',params);
};

// get flight detail infomation
export const getFlightDetails = async (flightId) => {
    return flightHttpClient.get(`/flights/${flightId}`);
};

