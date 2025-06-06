import { Link } from 'react-router-dom';

const TopNavbar = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/bookings" 
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            Book
          </Link>
          <Link 
            to="/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;