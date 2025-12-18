import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../composables/useAuth';
//import { useUser } from '../../composables/useUser';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
 // const {searchUsers}  = useUser();
  const navigate = useNavigate();
   
  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`)
    // searchUsers(query);
    setQuery('');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/feed" className="text-2xl font-bold text-orange-600">
            HokagePath
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center mx-6 flex-1 max-w-md"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600"
              >
                Search
              </button>
            </form>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-orange-600">
                  Dashboard
                </Link>
                <Link to="/workouts" className="text-gray-700 hover:text-orange-600">
                  Workouts
                </Link>
                <Link to="/meals" className="text-gray-700 hover:text-orange-600">
                  Meals
                </Link>
                <Link to="/feed" className="text-gray-700 hover:text-orange-600">
                  Feed
                </Link>

                <Link to={`/profile/${user?.id}`} className="flex items-center">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-orange-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
