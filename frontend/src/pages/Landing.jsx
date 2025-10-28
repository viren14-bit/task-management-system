"use client"

import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const Landing = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Management System</h1>
        <p className="text-lg text-gray-600 mb-8">
          Streamline your project workflow with our simple and efficient task tracking solution.
        </p>
        <div className="flex justify-center space-x-4">
          {user ? (
            <Link to="/dashboard" className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700">
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-800 px-6 py-3 rounded border border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Landing
