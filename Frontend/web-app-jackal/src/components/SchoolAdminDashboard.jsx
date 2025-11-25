// src/components/SchoolAdminDashboard.jsx - NEW FILE
import React, { useState, useEffect } from 'react'

const SchoolAdminDashboard = () => {
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageWPM: 0,
    averageAccuracy: 0,
    activeClasses: 0
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockClassrooms = [
      { id: 1, name: 'Grade 10 - Computer Science', teacher: 'Mr. Smith', studentCount: 25 },
      { id: 2, name: 'Grade 11 - IT Fundamentals', teacher: 'Ms. Johnson', studentCount: 30 },
      { id: 3, name: 'Grade 12 - Advanced Typing', teacher: 'Dr. Williams', studentCount: 20 }
    ]
    
    const mockStudents = [
      { id: 1, name: 'John Doe', email: 'john@school.edu', speed: 45, accuracy: 92, classroom: 1, progress: 85 },
      { id: 2, name: 'Jane Smith', email: 'jane@school.edu', speed: 38, accuracy: 88, classroom: 1, progress: 72 },
      { id: 3, name: 'Mike Johnson', email: 'mike@school.edu', speed: 52, accuracy: 95, classroom: 2, progress: 91 },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@school.edu', speed: 41, accuracy: 89, classroom: 2, progress: 78 },
      { id: 5, name: 'David Brown', email: 'david@school.edu', speed: 48, accuracy: 93, classroom: 3, progress: 88 }
    ]

    setClassrooms(mockClassrooms)
    setStudents(mockStudents)
    
    // Calculate stats
    setStats({
      totalStudents: mockStudents.length,
      averageWPM: Math.round(mockStudents.reduce((acc, student) => acc + student.speed, 0) / mockStudents.length),
      averageAccuracy: Math.round(mockStudents.reduce((acc, student) => acc + student.accuracy, 0) / mockStudents.length),
      activeClasses: mockClassrooms.length
    })
  }, [])

  const filteredStudents = selectedClassroom 
    ? students.filter(student => student.classroom === parseInt(selectedClassroom))
    : students

  const getPerformanceColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-400'
    if (accuracy >= 80) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="container-page py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">School Administration Dashboard</h1>
            <p className="text-neutral-400">Manage classrooms, track student progress, and monitor typing performance</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button className="btn-secondary">Export Reports</button>
            <button className="btn-primary">Add New Classroom</button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-surface p-6 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.totalStudents}</div>
            <div className="text-sm text-neutral-400">Total Students</div>
          </div>
          <div className="card-surface p-6 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.averageWPM} WPM</div>
            <div className="text-sm text-neutral-400">Average Speed</div>
          </div>
          <div className="card-surface p-6 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.averageAccuracy}%</div>
            <div className="text-sm text-neutral-400">Average Accuracy</div>
          </div>
          <div className="card-surface p-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.activeClasses}</div>
            <div className="text-sm text-neutral-400">Active Classes</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filters & Actions</h3>
              
              {/* Classroom Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Filter by Classroom
                </label>
                <select 
                  value={selectedClassroom} 
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Classrooms</option>
                  {classrooms.map(classroom => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
                  📊 Generate Progress Report
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
                  👥 Manage Students
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
                  🎯 Set Class Goals
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors">
                  📧 Send Announcements
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Students Table */}
            <div className="card-surface overflow-hidden">
              <div className="p-6 border-b border-neutral-700">
                <h3 className="text-xl font-semibold text-white">Student Progress</h3>
                <p className="text-neutral-400 text-sm mt-1">
                  {filteredStudents.length} students found
                  {selectedClassroom && ` in ${classrooms.find(c => c.id === parseInt(selectedClassroom))?.name}`}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800/60">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Student</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Classroom</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Speed (WPM)</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Accuracy</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Progress</th>
                      <th className="text-left p-4 text-sm font-semibold text-neutral-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredStudents.map(student => {
                      const classroom = classrooms.find(c => c.id === student.classroom)
                      return (
                        <tr key={student.id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-xs text-white">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium text-white text-sm">{student.name}</div>
                                <div className="text-xs text-neutral-400">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-neutral-300">{classroom?.name}</td>
                          <td className="p-4 text-sm text-white">{student.speed} WPM</td>
                          <td className="p-4">
                            <span className={`text-sm font-medium ${getPerformanceColor(student.accuracy)}`}>
                              {student.accuracy}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-neutral-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-neutral-400">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <button className="text-neutral-400 hover:text-white text-sm transition-colors">
                              View Details
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-neutral-500 text-lg">No students found</div>
                  <div className="text-neutral-400 text-sm mt-2">Try adjusting your filters</div>
                </div>
              )}
            </div>

            {/* Classroom Summary */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {classrooms.map(classroom => {
                const classStudents = students.filter(s => s.classroom === classroom.id)
                const avgWPM = classStudents.length > 0 
                  ? Math.round(classStudents.reduce((acc, s) => acc + s.speed, 0) / classStudents.length)
                  : 0
                const avgAccuracy = classStudents.length > 0
                  ? Math.round(classStudents.reduce((acc, s) => acc + s.accuracy, 0) / classStudents.length)
                  : 0

                return (
                  <div key={classroom.id} className="card-surface p-6">
                    <h4 className="font-semibold text-white mb-3">{classroom.name}</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Teacher:</span>
                        <span className="text-white">{classroom.teacher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Students:</span>
                        <span className="text-white">{classroom.studentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Avg WPM:</span>
                        <span className="text-emerald-400">{avgWPM}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Avg Accuracy:</span>
                        <span className="text-blue-400">{avgAccuracy}%</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 btn-secondary text-sm py-2">
                      Manage Class
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolAdminDashboard