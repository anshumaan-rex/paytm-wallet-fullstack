const PaymentCard = ({ user, amount, setAmount, initiateTransfer, loading }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
        Send Money
      </h2>
      
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-cyan-300 font-semibold">{user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}</p>
          <p className="text-cyan-200/80 text-sm">@{user.username}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <input
          type="number"
          required
          name="amount"
          value={amount}
          placeholder="Enter Amount (₹)"
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/60 border border-cyan-500/30 rounded-lg 
                   text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 
                   focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-center text-xl
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      
      <button 
        onClick={initiateTransfer}
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
          `Send ₹${amount || 0}`
        )}
      </button>
    </div>
  );
};

export default PaymentCard;