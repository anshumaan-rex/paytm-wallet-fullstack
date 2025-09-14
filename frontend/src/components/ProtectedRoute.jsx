import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setIsAuth(false)

    const isAuthenticated = async () => {
      try{
        const res = await axios.get("http://localhost:4000/api/v1/auth/profile", {
          withCredentials: true
        })
        if(res.data.success) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      }catch(err){
        setIsAuth(false)
      } finally {
        setLoading(false)
      }

    }
    isAuthenticated()
  },[])


  if(loading) return <p>Loading...</p>
  if(!isAuth) return <Navigate to="/signin" replace />

  return children
}
