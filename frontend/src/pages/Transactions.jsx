import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState({});
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
 
        const transactionsRes = await axios.get(
          `http://localhost:4000/api/v1/users/transactions/${id}`,
          { withCredentials: true }
        );

        if (transactionsRes.data.success) {
          if (transactionsRes.data.transactions.length === 0) {
            setMessage("No transactions found with this user");
          } else {
            setTransactions(transactionsRes.data.transactions);
          }
        } else {
          setMessage(transactionsRes.data.message);
        }


        const receiverRes = await axios.get(
          `http://localhost:4000/api/v1/users/${id}`,
          { withCredentials: true }
        );

        if (receiverRes.data.success) {
          setReceiver(receiverRes.data.user);
        }

      } catch (err) {
        if (err.response) {
          const data = err.response.data;
          setError(data.error || data.message || "Failed to fetch transactions");
        } else {
          setError("Network error. Please try again!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (transaction) => {

    return "Sent";
  };

  const getAmountColor = (transaction) => {
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {receiver.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-cyan-300 font-semibold">{receiver.name}</h2>
              <p className="text-cyan-200/80 text-sm">@{receiver.username}</p>
            </div>
          </div>
        </div>


        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Transaction History
          </h1>
          <p className="text-cyan-200/80 mt-2">All transactions with {receiver.name}</p>
        </div>


        {message && (
          <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg mb-6">
            <p className="text-blue-300 text-center">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg mb-6">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}


        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}


        {!loading && transactions.length > 0 && (
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-500/30">
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold">Date & Time</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold">Amount</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-cyan-300 font-semibold">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction._id} 
                      className="border-b border-cyan-500/10 hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-cyan-200/90">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300">
                          {getTransactionType(transaction)}
                        </span>
                      </td>
                      <td className={`py-4 px-6 font-semibold ${getAmountColor(transaction)}`}>
                        ₹{transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          Completed
                        </span>
                      </td>
                      <td className="py-4 px-6 text-cyan-200/80 text-sm font-mono">
                        {transaction._id.slice(-8)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {!loading && transactions.length === 0 && !message && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-cyan-300 text-lg font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-cyan-200/80">You haven't made any transactions with this user yet.</p>
            <button
              onClick={() => navigate(`/sendmoney/${id}`)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                       text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Send Money
            </button>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="mt-6 p-4 bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-cyan-200/80 text-sm">Total Transactions</p>
                <p className="text-cyan-300 text-xl font-semibold">{transactions.length}</p>
              </div>
              <div>
                <p className="text-cyan-200/80 text-sm">Total Amount</p>
                <p className="text-red-400 text-xl font-semibold">
                  ₹{transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-cyan-200/80 text-sm">Last Transaction</p>
                <p className="text-cyan-300 text-sm">
                  {transactions.length > 0 ? formatDate(transactions[0].createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;