import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, deleteBlog } from "../store/slices/blogSlice";
import type { AppDispatch, RootState } from "../store/store";

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Typed params
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentBlog, loading } = useSelector(
    (state: RootState) => state.blogs,
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (id) dispatch(fetchBlogById(id));

    // Optional: Reset currentBlog on unmount to prevent seeing old data
    // when clicking a new blog.
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?") && id) {
      const result = await dispatch(deleteBlog(id));
      if (deleteBlog.fulfilled.match(result)) {
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-12 bg-gray-200 w-3/4 mb-4" />
        <div className="h-6 bg-gray-200 w-1/4" />
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Blog not found.</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Check if current user is the author
  const isAuthor = currentUser?.id === currentBlog.authorId;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-gray-500 hover:text-gray-800 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      {currentBlog.image && (
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl mb-12">
          <img
            src={currentBlog.image}
            alt={currentBlog.title}
            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
          {currentBlog.title}
        </h1>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner">
              {currentBlog.author.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {currentBlog.author.username}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {new Date(currentBlog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/edit/${currentBlog.id}`)}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 rounded-xl font-bold transition-all shadow-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-bold transition-all"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="prose prose-blue prose-xl max-w-none">
        <div className="text-gray-800 leading-[1.8] whitespace-pre-wrap font-serif">
          {currentBlog.content}
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-gray-100">
        <p className="text-gray-400 text-sm">
          End of story. Thanks for reading!
        </p>
      </footer>
    </article>
  );
};

export default BlogDetailPage;
