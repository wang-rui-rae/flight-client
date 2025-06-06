import { Outlet } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar />
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Flight System</h1>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default App
