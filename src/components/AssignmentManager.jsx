import React, { useState, useEffect } from "react";
import { assignmentService } from "../services/assignmentService";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X
} from "lucide-react";

const AssignmentManager = ({ classroomCode, classroomId, isTeacher = true }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    classroomCode: classroomCode,
    numMcqs: 5,
    numWriting: 2,
    dueDate: ""
  });

  // Fetch assignments
  useEffect(() => {
    fetchAssignments();
  }, [classroomCode]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      if (isTeacher) {
        const data = await assignmentService.getAllAssignmentsByClassroom(classroomCode);
        setAssignments(data);
      } else {
        // For students, get attempted assignments
        const data = await assignmentService.getAttemptedAssignments(classroomId);
        setAssignments(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.id, formData);
      } else {
        await assignmentService.createAssignment(formData);
      }
      setShowCreateForm(false);
      setEditingAssignment(null);
      setFormData({
        title: "",
        description: "",
        difficulty: "medium",
        classroomCode: classroomCode,
        numMcqs: 5,
        numWriting: 2,
        dueDate: ""
      });
      fetchAssignments();
    } catch (err) {
      console.error("Error saving assignment:", err);
      alert("Failed to save assignment");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.deleteAssignment(assignmentId);
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
        alert("Failed to delete assignment");
      }
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      difficulty: assignment.difficulty || "medium",
      classroomCode: classroomCode,
      numMcqs: assignment.numMcqs || 5,
      numWriting: assignment.numWriting || 2,
      dueDate: assignment.dueDate || ""
    });
    setShowCreateForm(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-400 h-4 w-4" />;
      case "pending":
        return <Clock className="text-yellow-400 h-4 w-4" />;
      case "overdue":
        return <XCircle className="text-red-400 h-4 w-4" />;
      default:
        return <AlertCircle className="text-gray-400 h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "hard":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center">
          <BookOpen className="mr-2 text-cyan-500 h-5 w-5" />
          Assignments
        </h3>
        {isTeacher && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Assignment List */}
      {assignments.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <BookOpen className="mx-auto text-slate-500 h-12 w-12 mb-4" />
          <p className="text-slate-400">
            {isTeacher ? "No assignments created yet." : "No assignments available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-1">
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-slate-400 mb-2">
                    {assignment.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(assignment.difficulty)}`}>
                      {assignment.difficulty || "medium"}
                    </span>
                    {assignment.dueDate && (
                      <span className="flex items-center text-slate-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center text-slate-400">
                      <Users className="mr-1 h-3 w-3" />
                      {assignment.submittedCount || 0} submitted
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(assignment.status)}
                  {isTeacher && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingAssignment(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-cyan-400 mb-6">
              {editingAssignment ? "Edit Assignment" : "Create Assignment"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-20"
                  placeholder="Enter assignment description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    MCQ Questions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numMcqs}
                    onChange={(e) =>
                      setFormData({ ...formData, numMcqs: parseInt(e.target.value) })
                    }
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Writing Questions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numWriting}
                    onChange={(e) =>
                      setFormData({ ...formData, numWriting: parseInt(e.target.value) })
                    }
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManager;
