import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import PasswordReset from "./pages/PasswordReset"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sendmoney" element={<SendMoney />} />
    </Routes>
  )
}

export default App