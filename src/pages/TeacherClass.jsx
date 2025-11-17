import React, { useState, useEffect } from 'react';
import axios from "axios";
import AssignmentManager from '../components/AssignmentManager';
import { classroomService } from '../services/classroomService';
import { assignmentService } from '../services/assignmentService';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
  ArrowLeft,
  X,
  Menu,
  ChevronDown,
  Target
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TeacherClass = () => {
  const { classcode } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentQuestions, setAssignmentQuestions] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    numMcqs: 5,
    numWriting: 2,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get logged-in teacher's name from localStorage
  const getLoggedInTeacherName = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || 'Teacher';
  };

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        const classroom = await classroomService.getClassroomByCode(classcode);
        const assignments = await assignmentService.getAllAssignmentsByClassroom(classcode).catch(() => []);
        
        // Fetch students if we have classroom ID
        let students = [];
        const classroomId = classroom?.id || classroom?.classroomId;
        if (classroomId) {
          students = await classroomService.getAllStudentsOfClassroom(classroomId).catch(() => []);
        }
        
        console.log('Classroom:', classroom);
        console.log('Assignments:', assignments);
        console.log('Students:', students);
        
        setClassroom({ ...classroom, students });
        setAssignmentsList(assignments);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching classroom data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    if (classcode) {
      fetchClassroomData();
    }
  }, [classcode]);

  // Refresh data after adding a new assignment/topic
  const refreshClassroomData = async () => {
    try {
      const classroom = await classroomService.getClassroomByCode(classcode);
      const assignments = await assignmentService.getAllAssignmentsByClassroom(classcode).catch(() => []);
      
      // Fetch students if we have classroom ID
      let students = [];
      const classroomId = classroom?.id || classroom?.classroomId;
      if (classroomId) {
        students = await classroomService.getAllStudentsOfClassroom(classroomId).catch(() => []);
      }
      
      setClassroom({ ...classroom, students });
      setAssignmentsList(assignments);
    } catch (err) {
      console.error("Error refreshing classroom data:", err);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-purple-500/20 text-purple-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const navigate = useNavigate();
  const goBack = () => { navigate(-1) };

  const showStudentAssessment = (studentId) => {
    // Logic to show student assessment
    console.log(`Showing assessment for student ${studentId}`);
  };
  
  const showStudentFeedback = (studentId) => {
    // Logic to show student feedback
    console.log(`Showing feedback for student ${studentId}`);
  };

  const removeStudent = async (studentId) => {
    try {
      const classroomId = classroom?.id || classroom?.classroomId;
      
      if (!classroomId) {
        throw new Error('Classroom ID not found');
      }
      
      // Add confirmation dialog
      const confirmed = window.confirm('Are you sure you want to remove this student from the classroom?');
      if (!confirmed) {
        return;
      }
      
      await classroomService.removeStudent(classroomId, studentId);
      
      // Refresh classroom data after removing a student
      await refreshClassroomData();
    } catch (err) {
      console.error('Error removing student:', err);
      alert('Failed to remove student: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Use the updated assignment service
      const quizJson = await assignmentService.createAssignment({
        title: newAssignment.title,
        description: newAssignment.description,
        classroomCode: classroom?.classroomCode || classroom?.classCode || classcode,
        difficulty: newAssignment.difficulty,
        numMcqs: newAssignment.numMcqs,
        numWriting: newAssignment.numWriting,
      });
      
      console.log('Assignment created successfully:', quizJson);
      
      // Reset form to initial values
      setNewAssignment({ 
        title: '', 
        description: '', 
        difficulty: 'medium',
        numMcqs: 5,
        numWriting: 2,
      });
      setSubmitSuccess(true);
      
      // Refresh classroom data to show the new assignment
      await refreshClassroomData();
      
      // Close the dialog after a short delay to show success message
      setTimeout(() => {
        setIsAddingAssignment(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error creating assignment:', err);
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClassDelete = async () => {
    console.log('Classroom object:', classroom);
    console.log('Classroom ID:', classroom?.id);
    console.log('Classroom ID (classroomId):', classroom?.classroomId);
    
    const classroomId = classroom?.id || classroom?.classroomId;
    
    if (!classroomId) {
      alert('Classroom ID not found');
      return;
    }
    
    // Add confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete the classroom "${actualClassName}"? This action cannot be undone and will remove all assignments and students.`);
    if (!confirmed) {
      return;
    }
    
    try {
      await classroomService.deleteClassroomById(classroomId);
      alert('Classroom deleted successfully!');
      // Redirect to teacher dashboard after successful deletion
      window.location.href = '/teacher-dashboard';
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete classroom: ' + (error.message || 'Unknown error'));
    }
  };

  const handleViewAssignment = async (assignment) => {
    setSelectedAssignment(assignment);
    setLoadingQuestions(true);
    try {
      const questionsData = await assignmentService.getAssignmentById(assignment.id);
      setAssignmentQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching assignment questions:", error);
      setAssignmentQuestions(null);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCloseAssignment = () => {
    setSelectedAssignment(null);
    setAssignmentQuestions(null);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!assignmentId) {
      alert('Assignment ID not found');
      return;
    }
    
    // Add confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    
    try {
      await assignmentService.deleteAssignment(assignmentId);
      alert('Assignment deleted successfully!');
      // Close the assignment modal if it's open
      handleCloseAssignment();
      // Refresh classroom data to show updated assignments list
      await refreshClassroomData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl text-cyan-400">Loading classroom data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-400 mb-4">Error loading classroom data</p>
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={goBack}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Get the class name from different possible field names
  const actualClassName = classroom?.className || classroom?.name || classroom?.classroomName || classroom?.title || 'Untitled Class';

  const { 
    subject = '',  
    classDescription = '',
    teacherName = getLoggedInTeacherName(),
    assignments = [],
    students = [],
  } = classroom || {};
      

  const studentsCount = students?.length || 0;
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="mr-3 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-cyan-400 break-words">{actualClassName}</h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">{classDescription}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-4">
          <button
            onClick={handleClassDelete}
            className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition duration-150 ease-in-out"
          >
            Delete Class
          </button>
          <button
            onClick={() => setIsAddingAssignment(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-1 md:mr-2" size={16} /> New Assignment
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Mobile */}
      <div className="md:hidden relative mb-6">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg"
        >
          <span className="font-medium capitalize">{activeTab}</span>
          <ChevronDown size={20} className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {mobileMenuOpen && (
          <div className="absolute z-10 mt-1 w-full bg-slate-800 rounded-lg shadow-xl">
            {['overview', 'assignments', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 ${activeTab === tab
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs - Desktop */}
      <div className="hidden md:flex space-x-4 mb-6 border-b border-slate-800 overflow-x-auto">
        {['overview', 'assignments', 'students'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px whitespace-nowrap ${activeTab === tab
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content based on Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Class Overview */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-slate-900 p-3 md:p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-blue-400" size={18} />
                  <span className="text-xs text-slate-400">Students</span>
                </div>
                <p className="text-xl md:text-2xl font-bold">{studentsCount}</p>
              </div>
              <div className="bg-slate-900 p-3 md:p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="text-green-400" size={18} />
                  <span className="text-xs text-slate-400">Assignments</span>
                </div>
                <p className="text-xl md:text-2xl font-bold">{assignmentsList.length}</p>
              </div>
              <div className="bg-slate-900 p-3 md:p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <Target className="text-purple-400" size={18} />
                  <span className="text-xs text-slate-400">Teacher</span>
                </div>
                <p className="text-xl md:text-2xl font-bold truncate">{teacherName}</p>
              </div>
            </div>


            {/* Recent Assignments */}
            <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-bold text-cyan-400 flex items-center">
                  <Calendar className="mr-2" size={20} /> Recent Assignments
                </h2>
                <button 
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 md:space-y-3">
                {assignmentsList.length > 0 ? (
                  assignmentsList.slice(0, 3).map((assignment, index) => (
                    <div
                      key={assignment.id || index}
                      className="bg-slate-800 p-3 md:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-700 transition-colors gap-2"
                    >
                      <div
                        onClick={() => handleViewAssignment(assignment)}
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                      >
                        <FileText className="text-slate-400 shrink-0" size={18} />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm md:text-base">{assignment.title || 'Untitled Assignment'}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(assignment.status || 'active')}`}>
                          {(assignment.status || 'active').charAt(0).toUpperCase() + 
                           (assignment.status || 'active').slice(1)}
                        </span>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAssignment(assignment.id);
                          }}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete assignment"
                        >
                          <X size={16} />
                        </button> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-slate-400 text-sm">
                    No assignments yet. Create your first assignment!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Class Info */}
            <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
              <h2 className="text-lg md:text-xl font-bold text-cyan-400 flex items-center mb-3 md:mb-4">
                <BookOpen className="mr-2" size={20} /> Class Information
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <span className="text-slate-400 sm:w-32 text-sm md:text-base">Subject:</span>
                  <span className="text-white text-sm md:text-base mt-1 sm:mt-0">{subject}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <span className="text-slate-400 sm:w-32 text-sm md:text-base">Teacher:</span>
                  <span className="text-white text-sm md:text-base mt-1 sm:mt-0">{teacherName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <span className="text-slate-400 sm:w-32 text-sm md:text-base">Class Code:</span>
                  <span className="text-white text-sm md:text-base mt-1 sm:mt-0">{classcode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <AssignmentManager 
          classroomCode={classcode}
          classroomId={classroom?.id}
          isTeacher={true}
          onAssignmentChange={() => {
            // Refresh classroom data when assignments change
            refreshClassroomData();
          }}
        />
      )}

      {activeTab === 'students' && (
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-3 md:mb-4">Students</h2>
          <div className="bg-slate-900 p-3 md:p-6 rounded-xl border border-slate-800">
            <ul className="divide-y divide-slate-800">
              {students && students.length > 0 ? (
                students.map(student => (
                  <li key={student.id} className="py-3 md:py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-cyan-300">{student.name}</h3>
                        <button 
                          className="mt-2 md:hidden px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                        >
                          Add-on Feedback
                        </button>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                        <div className="text-left md:text-right">
                          <p className="text-slate-400 text-xs md:text-sm">Grade: {student.grade}%</p>
                          <p className="text-slate-400 text-xs md:text-sm">Participation: {student.participation}%</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => showStudentAssessment(student.id)} 
                            className="px-2 py-1 md:px-3 md:py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors"
                          >
                            Assessment
                          </button>
                          <button 
                            onClick={() => showStudentFeedback(student.id)} 
                            className="px-2 py-1 md:px-3 md:py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors"
                          >
                            Feedback
                          </button>
                          <button 
                            onClick={() => removeStudent(student.id)} 
                            className="px-2 py-1 md:px-3 md:py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-slate-400 text-sm md:text-base">
                  No students enrolled in this class yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}


      {/* Add Assignment Dialog */}
      {isAddingAssignment && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">New Assignment</h2>
              <button
                onClick={() => setIsAddingAssignment(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitAssignment}>
              {submitSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg flex items-center">
                  <CheckCircle className="mr-2" size={18} />
                  Assignment created successfully!
                </div>
              )}
              
              {submitError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  {submitError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32"
                  placeholder="Enter assignment description"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={newAssignment.difficulty}
                  onChange={(e) => setNewAssignment({ ...newAssignment, difficulty: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Number of MCQs
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newAssignment.numMcqs}
                    onChange={(e) => setNewAssignment({ ...newAssignment, numMcqs: parseInt(e.target.value) || 5 })}
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Number of Writing Questions
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newAssignment.numWriting}
                    onChange={(e) => setNewAssignment({ ...newAssignment, numWriting: parseInt(e.target.value) || 2 })}
                    className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="2"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingAssignment(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Assignment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Questions Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400">{selectedAssignment.title}</h2>
                <p className="text-slate-400 mt-1">{selectedAssignment.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteAssignment(selectedAssignment.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Delete Assignment
                </button>
                <button
                  onClick={handleCloseAssignment}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {loadingQuestions ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="text-slate-400 mt-4">Loading questions...</p>
              </div>
            ) : assignmentQuestions?.questions ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-cyan-300">Generated Questions</h3>
                  <span className="text-sm text-slate-400">
                    {assignmentQuestions.questions.length} question{assignmentQuestions.questions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {assignmentQuestions.questions.map((question, index) => (
                  <div key={question.qid || index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-3">{question.text}</p>
                        
                        {question.type === 'MCQ' && question.mcq ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                                <span className="text-cyan-400 font-medium">A.</span>
                                <span className="text-slate-300">{question.mcq.option1}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                                <span className="text-cyan-400 font-medium">B.</span>
                                <span className="text-slate-300">{question.mcq.option2}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                                <span className="text-cyan-400 font-medium">C.</span>
                                <span className="text-slate-300">{question.mcq.option3}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                                <span className="text-cyan-400 font-medium">D.</span>
                                <span className="text-slate-300">{question.mcq.option4}</span>
                              </div>
                            </div>
                          </div>
                        ) : question.type === 'PARAGRAPH' ? (
                          <div className="bg-slate-700 rounded p-3">
                            <p className="text-slate-300 italic">Essay question - requires written response</p>
                          </div>
                        ) : null}
                        
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded">
                            {question.type}
                          </span>
                          <span className="text-xs text-slate-500">ID: {question.qid}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No questions available for this assignment.</p>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={handleCloseAssignment}
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherClass;
