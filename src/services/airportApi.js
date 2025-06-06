import airportHttpClient from './http';

// send search  request
export const searchAirports = () => {
  return airportHttpClient.get('/airports');
};

;

