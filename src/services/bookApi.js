import bookHttpClient from './http';

// query book by input
export const searchBooks = async (params) => {
    return bookHttpClient.get('/bookings', {
    params: params
  });
};

// get book detail infomation
export const getBookDetails = async (bookingReference) => {
    return bookHttpClient.get(`/bookings/${bookingReference}`);
};

// insert book
export const createBooking = async (params) => {
    console.log("Creating booking with params:", params);
    return bookHttpClient.post('/booking/confirm',  params);

};
