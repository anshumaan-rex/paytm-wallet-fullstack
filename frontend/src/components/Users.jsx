import { useNavigate } from "react-router-dom"

const Users = ({ users }) => {
  const navigate = useNavigate()

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-cyan-200/80">No users found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-cyan-500/30">
            <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Name</th>
            <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Username</th>
            <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-b border-cyan-500/10 hover:bg-gray-700/50 transition-colors">
              <td className="py-3 px-4 text-cyan-200">{user.name}</td>
              <td className="py-3 px-4 text-cyan-200/80">@{user.username}</td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/sendmoney/${user._id}`)}
                    className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                             text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    Send Money
                  </button>
                  <button 
                    onClick={() => navigate(`/transactions/${user._id}`)}
                    className="px-3 py-1 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400/50 
                             rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    History
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users