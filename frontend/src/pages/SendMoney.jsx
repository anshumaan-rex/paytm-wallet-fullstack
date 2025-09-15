import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentCard from "../components/PaymentCard";

const SendMoney = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState({});

  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true);
    setMessage("");
    setError("");
    setUser({});

    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/users/${id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setMessage(res.data.message);
        }
      } catch (err) {
        if (err.response) {
          const data = err.response.data;
          setError(data.error || data.message || "user not found");
        } else {
          setError("Network error. Try again!");
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  const initiateTransfer = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/users/send/${id}`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setMessage(res.data.message);
        setTimeout(()=> {
          navigate("/dashboard")
        },2000)
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        setError(data.error || data.message || "failed to transfer money");
      } else {
        setError("Network error. Try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg blur opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl"></div>
        
        <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-xl">
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
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <PaymentCard user={user} amount={amount} setAmount={setAmount} initiateTransfer={initiateTransfer} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SendMoney;