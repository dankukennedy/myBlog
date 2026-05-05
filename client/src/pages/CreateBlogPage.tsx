import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog, clearBlogError } from "../store/slices/blogSlice";
import type { AppDispatch, RootState } from "../store/store";

const CreateBlogPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Grab loading AND error from the store
  const { loading, error } = useSelector((state: RootState) => state.blogs);

  // Clear errors when the user navigates away or types
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearBlogError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(
      createBlog({ title, content, image, published: true }),
    );

    if (createBlog.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Write a New Story
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 font-medium transition"
        >
          Cancel
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl animate-in fade-in slide-in-from-top-2">
          <p className="font-bold">Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border-l-4 border-gray-100 pl-6 focus-within:border-blue-500 transition-colors">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder-gray-200 bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Paste an image URL..."
            className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {image && (
            <div className="relative rounded-2xl overflow-hidden h-64 bg-gray-100 border">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/800x400?text=Invalid+Image+URL")
                }
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm">
                Preview
              </div>
            </div>
          )}
        </div>

        <div>
          <textarea
            placeholder="Tell your story..."
            className="w-full min-h-[500px] text-xl leading-relaxed border-none outline-none focus:ring-0 resize-none placeholder-gray-300 bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t py-4 px-4 z-50">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-3 rounded-full font-bold hover:bg-blue-700 transition transform active:scale-95 disabled:bg-gray-300 shadow-xl shadow-blue-100 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="h-24" />
    </div>
  );
};

export default CreateBlogPage;
