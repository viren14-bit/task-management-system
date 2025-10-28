"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              Task Manager
            </Link>
            {user && (
              <div className="ml-10 flex space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/tasks" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  Tasks
                </Link>
                <Link to="/projects" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  Projects
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.username} ({user.role})
                </span>
                <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
