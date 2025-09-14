import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-cyan-500/20 py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            PayWave
          </div>
          <div className="flex space-x-4">
            <Link to="/signin" className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300 text-sm">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                         text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="text-center max-w-2xl">
          {/* App Icon/Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-cyan-400/30">
              <span className="text-4xl text-white">₹</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Send Money Instantly
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-cyan-200/90 mb-10 max-w-md mx-auto">
            Secure virtual money transfers with complete transaction history. Fast, reliable, and easy to use.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '⚡', title: 'Instant', desc: 'Send money in seconds' },
              { icon: '🔒', title: 'Secure', desc: 'Bank-level security' },
              { icon: '📊', title: 'Track', desc: 'Full transaction history' }
            ].map((feature, index) => (
              <div key={index} className="p-4 bg-gray-800/40 backdrop-blur-md rounded-xl border border-cyan-500/30 hover:border-cyan-400/40 transition-all duration-300">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">{feature.title}</h3>
                <p className="text-cyan-200/80 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 
                         text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Create Account
            </Link>
            <Link 
              to="/signin" 
              className="px-8 py-3 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400/50 
                         font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-6 px-4">
        <div className="text-center">
          <p className="text-cyan-400/60 text-sm">© 2023 PayWave. Secure virtual money transfers.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home