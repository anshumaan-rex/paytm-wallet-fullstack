import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Verify() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    setLoading(true);
    setError("");
    setMessage("");

    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `http://localhost:4000/api/v1/auth/verify?token=${token}`
        );
        if (res.data.success) {
          setMessage(res.data.message);
          setTimeout(() => navigate("/signin"), 3000);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        if (err.response) {
          const data = err.response.data;
          setError(data.error || data.message || "Verification failed");
        } else {
          setError("Network error. Try again!");
        }
      } finally {
        setLoading(false)
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl"></div>
        
        <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
            {loading ? (
              <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : message ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            Email Verification
          </h2>

          {message && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg mb-6">
              <p className="text-green-300 font-medium">{message}</p>
              <p className="text-green-200/80 text-sm mt-2">Redirecting to sign in page...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg mb-6">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
              <p className="text-cyan-300 font-medium">Verifying your email...</p>
            </div>
          )}

          <button
            onClick={() => navigate("/signin")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                     text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify;