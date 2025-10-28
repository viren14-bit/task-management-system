"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const Tasks = () => {
  const { user, isAdmin } = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    project: "",
    status: "",
    priority: "",
  })
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    status: "todo",
    project: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [filters])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.project) params.append("project", filters.project)
      if (filters.status) params.append("status", filters.status)
      if (filters.priority) params.append("priority", filters.priority)

      const response = await axios.get(`/api/tasks/?${params.toString()}`)
      setTasks(response.data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects/")
      setProjects(response.data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        status: task.status,
        project: task.project,
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "todo",
        project: projects[0]?.id || "",
      })
    }
    setShowModal(true)
    setError("")
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTask(null)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}/`, formData)
      } else {
        await axios.post("/api/tasks/", formData)
      }
      fetchTasks()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed")
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await axios.delete(`/api/tasks/${taskId}/`)
      fetchTasks()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in_progress":
        return "text-blue-600 bg-blue-50"
      case "todo":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button onClick={() => openModal()} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white p-8 rounded border border-gray-200 text-center text-gray-600">No tasks found</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium text-gray-600 bg-gray-50">
                      {task.project_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Due: {task.due_date}</span>
                    <span className="mx-2">•</span>
                    <span>Created by: {task.created_by_username}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {isAdmin() && (
                    <>
                      <button
                        onClick={() => openModal(task)}
                        className="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-300 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingTask ? "Edit Task" : "Add Task"}</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
                  {editingTask ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white text-gray-800 py-2 rounded border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks
