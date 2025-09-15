import { useNavigate } from "react-router-dom"
import axios from "axios"

const UserProfile = ({ user, setShowProfile }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/auth/logout", {}, {
        withCredentials: true
      })
      navigate("/signin")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800/90 backdrop-blur-md rounded-xl border border-cyan-500/30 p-4 shadow-xl z-10">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-cyan-300 text-center font-semibold">{user.name}</h3>
        <p className="text-cyan-200/80 text-center text-sm">@{user.username}</p>
      </div>
      
      <div className="space-y-2 text-sm">
        <p className="text-cyan-200/80"><span className="text-cyan-300">Email:</span> {user.email}</p>
        <p className="text-cyan-200/80"><span className="text-cyan-300">Balance:</span> ₹{user.balance?.toFixed(2)}</p>
        <p className="text-cyan-200/80"><span className="text-cyan-300">Status:</span> {user.isVerified ? "Verified" : "Not Verified"}</p>
      </div>
      
      <button 
        onClick={handleLogout}
        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 
                 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  )
}

export default UserProfile