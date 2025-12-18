/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { User } from '../../types/auth.types';
import { useUser } from '../../composables/useUser';





const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const {searchUsers} = useUser();
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
  
    const runSearch = async () => {
      setLoading(true);
      try {
        const res = await searchUsers(query);
  
        if (res.success) {
          setResults(res.users);
        } else {
          setResults([]);
          console.error(res.error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    runSearch();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        User search results for "{query}"
      </h1>

      {loading && <p className="text-gray-500">Searching users...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}

      <ul className="space-y-4">
        {results.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:shadow"
          >
            <div className="flex items-center space-x-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium">{user.username}</span>
            </div>

            <Link
              to={`/profile/${user.id}`}
              className="text-orange-600 hover:underline"
            >
              View Profile
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
