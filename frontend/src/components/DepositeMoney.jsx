const DepositeMoney = ({ user, amount, setAmount, initiateDeposite, loading, message, error, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl"></div>
        
        <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center">
            Deposit Money
          </h2>
          
          {/* User Info */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-cyan-300 font-semibold">{user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}</p>
              <p className="text-cyan-200/80 text-sm">@{user.username}</p>
              <p className="text-cyan-200/80 text-sm mt-1">Balance: ₹{user.balance?.toFixed(2)}</p>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg mb-4">
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-cyan-300 text-sm font-medium mb-2">
              Enter Amount (₹)
            </label>
            <input
              type="number"
              required
              name="amount"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                       text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                       focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-center text-xl
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
              step="0.01"
            />
          </div>
          
          {/* Deposit Button */}
          <button 
            onClick={initiateDeposite}
            disabled={loading || amount <= 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 
                     hover:from-cyan-600 hover:to-purple-700 text-white font-semibold 
                     rounded-lg shadow-lg transform hover:scale-[1.02] transition-all 
                     duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Deposit ₹${amount || 0}`
            )}
          </button>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[100, 500, 1000, 2000, 5000, 10000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount)}
                className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-cyan-300 rounded-lg 
                         transition-all duration-300 transform hover:scale-105 text-sm"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositeMoney;