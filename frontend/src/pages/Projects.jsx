"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const Projects = () => {
  const { isAdmin } = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

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

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description,
      })
    } else {
      setEditingProject(null)
      setFormData({
        name: "",
        description: "",
      })
    }
    setShowModal(true)
    setError("")
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}/`, formData)
      } else {
        await axios.post("/api/projects/", formData)
      }
      fetchProjects()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed")
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? All associated tasks will be deleted.")) return

    try {
      await axios.delete(`/api/projects/${projectId}/`)
      fetchProjects()
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        {/* {isAdmin() && ( */}
          <button onClick={() => openModal()} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
            Add Project
          </button>
        {/* )} */}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded border border-gray-200 text-center text-gray-600">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="text-sm text-gray-600 mb-4">
                <div>Tasks: {project.task_count}</div>
                <div>Created by: {project.created_by_username}</div>
              </div>
              {isAdmin() && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(project)}
                    className="flex-1 text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 text-red-600 hover:text-red-900 px-3 py-1 border border-red-300 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingProject ? "Edit Project" : "Add Project"}</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
                  {editingProject ? "Update" : "Create"}
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

export default Projects
