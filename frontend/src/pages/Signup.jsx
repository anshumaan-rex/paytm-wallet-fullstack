import { useState } from "react";
import axios from "axios";
import SuccessPopup from "../components/SuccessPopup";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupMessage, setShowPopupMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/auth/signup",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setShowPopupMessage(
        res.data.message || "Signed up successfully. Verification email has been sent to your email ID"
      );
      setFormData({ name: "", username: "", email: "", password: "" });
      setShowPopup(true);
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        setMessage(data.message || data.error || "Signup failed");

        if (data.errors) {
          const errorObj = {};
          data.errors.forEach((e) => {
            errorObj[e.path] = e.error;
          });
          setErrors(errorObj);
        }
      } else {
        setMessage("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">

        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl"></div>
        
        <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Create Account
            </h1>
            <p className="mt-2 text-cyan-200/80">Join our community today</p>
          </div>

          {showPopup && <SuccessPopup message={showPopupMessage} onClose={() => setShowPopup(false)} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm">{message}</p>
              </div>
            )}

            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                required
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.password}</p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 
                       hover:from-cyan-600 hover:to-purple-700 text-white font-semibold 
                       rounded-lg shadow-lg transform hover:scale-[1.02] transition-all 
                       duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cyan-300/80 text-sm">
              Already have an account?{" "}
              <a href="/signin" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;