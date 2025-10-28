"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalProjects: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([axios.get("/api/tasks/"), axios.get("/api/projects/")])

      const tasks = tasksRes.data
      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === "completed").length,
        inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
        totalProjects: projectsRes.data.length,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.first_name || user?.username}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
