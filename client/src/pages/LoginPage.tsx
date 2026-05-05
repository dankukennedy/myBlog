import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice"; // Added clearError
import type{ AppDispatch, RootState } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { clearBlogError } from "../store/slices/blogSlice";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Extracting slice state
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Clear error message when the component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (error) dispatch(clearBlogError());
    };
  }, [dispatch, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Using unwrap() is often cleaner for local logic, 
    // but .match() is perfectly fine for Redux actions.
    const result = await dispatch(login({ email, password }));
    
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transition-all">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 font-medium">
          Please enter your details
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-300 transform active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;