import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserProfile from "../components/UserProfile"
import Users from "../components/Users"

function Dashboard() {
  const [user, setUser] = useState({})
  const [showProfile, setShowProfile] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [fetchedUsers, setFetchedUsers] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/auth/profile", {
          withCredentials: true
        })
        if(res.data.success) {
          setUser(res.data.user)
        } else {
          navigate("/signin")
        }
      } catch (error) {
        navigate("/signin")
      }
    }
    fetchLoggedInUser()
  },[])

  useEffect(() => {
    setLoading(true)
    setError("")
    setMessage("")

    const getUsers = async () => {
      try{
        const res = await axios.get(`http://localhost:4000/api/v1/users/all?search=${search}`, {
          withCredentials: true
        })
        if(res.data.success) {
          setFetchedUsers(res.data.users || [])
        } else {
          setMessage(res.data.message)
        }
      }catch(err){
        if(err.response) {
          const data = err.response.data
          setError(data.error || data.message || "Failed to get users")
        } else {
          setError("Network Error. Try again!")
        }
      } finally {
        setLoading(false)
      }
    }
    getUsers()
  },[search])

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Header Section */}
      <section className="flex justify-between items-center mb-8 p-4 bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 relative z-10">
        <div>
          <p className="text-cyan-200/80">Hello,</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-cyan-200/80">Your Balance</p>
          <p className="text-3xl font-bold text-cyan-400">₹ {user.balance?.toFixed(0) || '0.00'}</p>
          <button className="mt-2 px-4 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                         text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">
            Deposit
          </button>
        </div>
        
        <div className="relative">
          <div 
            className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg"
            onMouseEnter={() => setShowProfile(true)}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {showProfile && (
            <div 
              onMouseLeave={() => setShowProfile(false)}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <UserProfile user={user} setShowProfile={setShowProfile} />
            </div>
          )}
        </div>
      </section>
      {/* Search and Users Section */}
      <section className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-6">
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search users..." 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/60 border border-cyan-500/30 rounded-lg 
                     text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                     focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
          />
        </div>
        
        <h4 className="text-xl font-semibold text-cyan-300 mb-4">Users</h4>
        
        {message && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg mb-4">
            <p className="text-blue-300 text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <Users users={fetchedUsers}/>
        )}
      </section>
    </div>
  )
}

export default Dashboard