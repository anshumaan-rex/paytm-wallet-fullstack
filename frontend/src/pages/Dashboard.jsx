import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Users from "../components/Users";
import DepositeMoney from "../components/DepositeMoney";

function Dashboard() {
  const [user, setUser] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [depositeAmount, setDepositeAmount] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState("");
  const [depositError, setDepositError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/auth/profile",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/signin");
        }
      } catch {
        navigate("/signin");
      }
    };
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    setMessage("");

    const getUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/users/all?search=${search}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setFetchedUsers(res.data.users || []);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        if (err.response) {
          const data = err.response.data;
          setError(data.error || data.message || "Failed to get users");
        } else {
          setError("Network Error. Try again!");
        }
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [search]);

  async function initiateDeposite() {
    setDepositLoading(true);
    setDepositMessage("");
    setDepositError("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/deposite/wallet",
        { amount: depositeAmount },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setDepositMessage(res.data.message);
        setUser((prev) => ({
          ...prev,
          balance: prev.balance + parseFloat(depositeAmount),
        }));
        setTimeout(() => {
          setDepositeAmount(0);
          setShowDepositModal(false);
        }, 2000);
      } else {
        setDepositError(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        setDepositError(data.error || data.message || "Failed to deposit");
      } else {
        setDepositError("Network error. Try again!");
      }
    } finally {
      setDepositLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6">
      <section className="flex flex-col max-w-[2080px] mx-auto sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8 p-4 bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 relative z-10">
        <div className="text-center sm:text-left">
          <p className="text-cyan-200/80 text-sm sm:text-base">Hello,</p>
          <p className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {user.name
              ? user.name.charAt(0).toUpperCase() + user.name?.slice(1)
              : ""}
          </p>
        </div>
        <div className="text-center">
          <p className="text-cyan-200/80 text-sm sm:text-base">Your Balance</p>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400">
            ₹ {user.balance?.toFixed(2) || "0.00"}
          </p>
          <button
            onClick={() => setShowDepositModal(true)}
            className="mt-2 px-3 sm:px-4 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
          >
            Deposit
          </button>
        </div>
        <div className="relative">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg"
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

      {showDepositModal && (
        <DepositeMoney
          user={user}
          initiateDeposite={initiateDeposite}
          setAmount={setDepositeAmount}
          amount={depositeAmount}
          loading={depositLoading}
          message={depositMessage}
          error={depositError}
          onClose={() => {
            setShowDepositModal(false);
            setDepositeAmount(0);
            setDepositMessage("");
            setDepositError("");
          }}
        />
      )}

      <section className="max-w-screen-xl mx-auto bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search users by name or username..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/60 border border-cyan-500/30 rounded-lg text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
          />
        </div>
        <h4 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-3 sm:mb-4">
          Users
        </h4>
        {message && (
          <div className="p-2 sm:p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg mb-3 sm:mb-4">
            <p className="text-blue-300 text-xs sm:text-sm">{message}</p>
          </div>
        )}
        {error && (
          <div className="p-2 sm:p-3 bg-red-500/20 border border-red-500/50 rounded-lg mb-3 sm:mb-4">
            <p className="text-red-300 text-xs sm:text-sm">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <Users users={fetchedUsers} />
        )}
      </section>
    </div>
  );
}

export default Dashboard;
