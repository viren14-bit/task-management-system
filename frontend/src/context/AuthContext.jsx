"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/auth/me/")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:8000/api/auth/login/", { username, password })
    const { token: newToken, user: userData } = response.data
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(userData)
    axios.defaults.headers.common["Authorization"] = `Token ${newToken}`
    return userData
  }

  const register = async (userData) => {
    const response = await axios.post("http://localhost:8000/api/auth/register/", userData)
    const { token: newToken, user: newUser } = response.data
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(newUser)
    axios.defaults.headers.common["Authorization"] = `Token ${newToken}`
    return newUser
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
