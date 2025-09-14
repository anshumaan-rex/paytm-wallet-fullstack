import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const savedEmail = localStorage.getItem("email")
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await axios.patch("http://localhost:4000/api/v1/auth/reset-password", formData, {
        headers: { "Content-Type": "application/json" }
      })

      if (res.data.success) {
        setMessage(res.data.message)
        localStorage.removeItem("email")
        setTimeout(() => navigate("/signin"), 2000)
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data
        setError(data.error || data.message || "Failed to reset the password")
      } else {
        setError("Network error. Try again")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl"></div>
        
        <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Reset Password
            </h1>
            <p className="mt-2 text-cyan-200/80">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-300 text-sm">{message}</p>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                placeholder="Enter your new password"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                         text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                         focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            <button
              disabled={loading}
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset