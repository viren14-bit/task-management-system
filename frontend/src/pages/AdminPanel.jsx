"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    standardUsers: 0,
    totalTasks: 0,
    totalProjects: 0,
  })
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([axios.get("/api/tasks/"), axios.get("/api/projects/")])

      const tasksData = tasksRes.data
      const projectsData = projectsRes.data

      setTasks(tasksData)
      setProjects(projectsData)

      // Extract unique users from tasks and projects
      const userMap = new Map()
      tasksData.forEach((task) => {
        if (!userMap.has(task.created_by)) {
          userMap.set(task.created_by, {
            id: task.created_by,
            username: task.created_by_username,
          })
        }
      })
      projectsData.forEach((project) => {
        if (!userMap.has(project.created_by)) {
          userMap.set(project.created_by, {
            id: project.created_by,
            username: project.created_by_username,
          })
        }
      })

      const usersData = Array.from(userMap.values())
      setUsers(usersData)

      setStats({
        totalUsers: usersData.length,
        adminUsers: 0,
        standardUsers: usersData.length,
        totalTasks: tasksData.length,
        totalProjects: projectsData.length,
      })
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const getTasksByStatus = () => {
    const statusCounts = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    }
    tasks.forEach((task) => {
      statusCounts[task.status]++
    })
    return statusCounts
  }

  const getTasksByPriority = () => {
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
    }
    tasks.forEach((task) => {
      priorityCounts[task.priority]++
    })
    return priorityCounts
  }

  const getRecentTasks = () => {
    return tasks.slice(0, 5)
  }

  const statusCounts = getTasksByStatus()
  const priorityCounts = getTasksByPriority()
  const recentTasks = getRecentTasks()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tasks"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "projects"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            All Projects
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Projects</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-blue-600">{statusCounts.in_progress}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">To Do</span>
                    <span className="text-sm font-medium text-gray-900">{statusCounts.todo}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-gray-600 h-2 rounded"
                      style={{ width: `${(statusCounts.todo / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="text-sm font-medium text-gray-900">{statusCounts.in_progress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${(statusCounts.in_progress / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-medium text-gray-900">{statusCounts.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-green-600 h-2 rounded"
                      style={{ width: `${(statusCounts.completed / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">High</span>
                    <span className="text-sm font-medium text-gray-900">{priorityCounts.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-red-600 h-2 rounded"
                      style={{ width: `${(priorityCounts.high / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Medium</span>
                    <span className="text-sm font-medium text-gray-900">{priorityCounts.medium}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded"
                      style={{ width: `${(priorityCounts.medium / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Low</span>
                    <span className="text-sm font-medium text-gray-900">{priorityCounts.low}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-green-600 h-2 rounded"
                      style={{ width: `${(priorityCounts.low / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white p-6 rounded border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.project_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{task.status.replace("_", " ")}</p>
                    <p className="text-sm text-gray-600">{task.created_by_username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tasks Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Projects Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {tasks.filter((t) => t.created_by === user.id).length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {projects.filter((p) => p.created_by === user.id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Created By</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.project_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === "high"
                            ? "text-red-600 bg-red-50"
                            : task.priority === "medium"
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-green-600 bg-green-50"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.status === "completed"
                            ? "text-green-600 bg-green-50"
                            : task.status === "in_progress"
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-600 bg-gray-50"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.due_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{task.created_by_username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="bg-white rounded border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.task_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.created_by_username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
