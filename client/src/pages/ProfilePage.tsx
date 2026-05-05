import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Added for the empty state link
import { fetchUserBlogs } from "../store/slices/blogSlice";
import type { AppDispatch, RootState } from "../store/store";
import BlogCard from "../components/BlogCard";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Destructuring state for cleaner access
  const { user } = useSelector((state: RootState) => state.auth);
  const { userBlogs, loading, error } = useSelector(
    (state: RootState) => state.blogs,
  );

  useEffect(() => {
    dispatch(fetchUserBlogs());
  }, [dispatch]);

  // Safety check for user session
  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Link to="/login" className="text-blue-500 hover:underline mt-4 block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12 flex flex-col md:flex-row items-center md:space-x-8 text-center md:text-left transition-all">
        <div className="h-32 w-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-extrabold shadow-lg mb-6 md:mb-0">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {user.username}
          </h1>
          <p className="text-lg text-gray-500 font-medium">{user.email}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-bold border border-blue-100">
              {userBlogs.length} {userBlogs.length === 1 ? "Post" : "Posts"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Published Blogs
        </h2>
        {userBlogs.length > 0 && (
          <Link
            to="/create"
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            + Write New Post
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userBlogs.length > 0 ? (
            userBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} id={Number(blog.id)} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg mb-6 italic">
                You haven't shared any stories yet.
              </p>
              <Link
                to="/create"
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md"
              >
                Create Your First Blog
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
