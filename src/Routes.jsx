import { createBrowserRouter} from 'react-router-dom';
import App from './App'
import './styles/tailwind.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingReviewPage from './pages/BookingReviewPage';
import SearchResultPage from './pages/SearchResultPage';
import FlightDetailPage from './pages/FlightDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,  // flight serach page.
      },
      {
        path: "login",
        element: <LoginPage />, // login page.
      },
      {
        path: "register",
        element: <RegisterPage />, // register page.
      },
      {
        path: "search-results",
        element: <SearchResultPage />, // search -results page.
      },
      {
        path: "flight/:flightId",
        element: <FlightDetailPage />, // flight detail page.
      },
      {
        path: "bookings",
        element: <ProtectedRoute><MyBookingsPage /></ProtectedRoute>, // my flight book information page.
      },
      {
        path: "bookings/:bookingReference",
        element: <ProtectedRoute><BookingReviewPage /></ProtectedRoute>, // flight book  detail page.
      },
    ],
  },
]);