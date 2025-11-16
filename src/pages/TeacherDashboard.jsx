import React, { useState, useEffect } from "react";
import axios from "axios";
import { assignmentService } from "../services/assignmentService";
import { classroomService } from "../services/classroomService";

import {
  Users,
  ClipboardList,
  UserPlus,
  MessageCircle,
  BarChart2,
  Award,
  Bell,
  FileText,
  Clock,
  TrendingUp,
  GitPullRequest,
  FileCheck,
  X,
  BookOpen,
  Brain,
  Calendar,
  ArrowLeft,
  Menu,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    subject: "",
    description: "",
    classroomCode: "",
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);

  const [aiInsights, setAiInsights] = useState({
    totalAssignmentsGraded: 456,
    averageGradingTimeSaved: 75,
    personalizedFeedbackGenerated: 328,
    learningGapIdentified: 42,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      message: "New assignment submissions for Calculus",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "performance",
      message: "Student performance insights ready",
      timestamp: "4 hours ago",
    },
  ]);

  // Fetch classrooms data from backend
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) {
          throw new Error("Teacher ID not found. Please login again.");
        }
        
        const response = await classroomService.getTeacherClassrooms(user.id);
        console.log("Fetched classrooms:", response);
        
        if (response) {
          // Check if no classrooms found
          if (response.length === 0) {
            setClassrooms([]);
            setLoading(false);
            return;
          }
          
          // Simple mapping without assignment fetching to isolate the issue
          const mappedClassrooms = response.map((classroom, index) => {
            console.log("Mapping classroom:", classroom);
            
            const mappedClassroom = {
              id: classroom.classroomId || classroom.id || index + 1,
              name: classroom.className || classroom.name || "Untitled Classroom",
              subject: classroom.subject,
              classCode: classroom.classroomCode || classroom.classCode,
              students: classroom.studentCount || classroom.students?.length || 0,
              assignmentsCount: 0, // Temporarily set to 0
              learningAssessment: classroom.learningAssessmentEnabled || true,
              recentAssignments: [], // Temporarily empty
            };
            
            console.log("Mapped classroom:", mappedClassroom);
            return mappedClassroom;
          });
          
          console.log("Setting classrooms:", mappedClassrooms);
          setClassrooms(mappedClassrooms);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        if (err.response?.status === 404) {
          setError("Teacher not found. Please check your credentials and try again.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (err.message?.includes("Teacher ID not found")) {
          setError(err.message);
        } else {
          setError("Failed to load classrooms. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await classroomService.createClassroom({
          className: newClassroom.name,
          subject: newClassroom.subject,
          classroomCode: newClassroom.classroomCode,
        });
      if (response.classroomCode || response.classCode) {
        setIsDialogOpen(false);
        // Refresh classroom list or navigate
        navigate(`/teacher-class/${response.classroomCode || response.classCode}`);
      } else {
        alert("Error: " + (response.message || "Unknown error occurred"));
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error creating classroom!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-400";
      case "upcoming":
        return "bg-purple-500/20 text-purple-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  const navigate = useNavigate();
  const handleHome = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 sm:p-4 md:p-6">
      {/* Create Classroom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-4 sm:p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 sm:mb-6">
              Create New Classroom
            </h2>
            <form onSubmit={handleCreateClassroom} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Classroom Name
                </label>
                <input
                  type="text"
                  required
                  value={newClassroom.name}
                  onChange={(e) =>
                    setNewClassroom({ ...newClassroom, name: e.target.value })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Classroom Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Classroom Code
                </label>
                <input
                  type="text"
                  value={newClassroom.classroomCode}
                  onChange={(e) =>
                    setNewClassroom({
                      ...newClassroom,
                      classroomCode: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Classroom Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newClassroom.subject}
                  onChange={(e) =>
                    setNewClassroom({
                      ...newClassroom,
                      subject: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newClassroom.description}
                  onChange={(e) =>
                    setNewClassroom({
                      ...newClassroom,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 rounded-lg border border-slate-700 p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-20 sm:h-24"
                  placeholder="Enter Classroom Description"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
              >
                Create Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Notifications Overlay */}
      {showMobileNotifications && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 lg:hidden">
          <div className="h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                <Bell className="mr-2 text-cyan-500 h-5 w-5" /> Notifications
              </h2>
              <button
                onClick={() => setShowMobileNotifications(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors flex items-start"
                >
                  <div className="mr-3">
                    {notification.type === "assignment" ? (
                      <FileText className="text-blue-400 h-5 w-5" />
                    ) : (
                      <BarChart2 className="text-green-400 h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowMobileNotifications(false)} 
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-colors"
            >
              Close Notifications
            </button>
          </div>
        </div>
      )}

      {/* Mobile Notifications Button (Fixed) */}
      <div className="fixed bottom-4 right-4 lg:hidden z-40">
        <button
          onClick={() => setShowMobileNotifications(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content Area (3 columns on desktop) */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* AI Insights & Analytics */}
          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center mb-4 sm:mb-6">
              <button
                onClick={handleHome}
                className="bg-slate-800 p-2 rounded-full mr-3 sm:mr-4 hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <BarChart2 className="mr-2 sm:mr-3 text-cyan-500 h-5 w-5 sm:h-6 sm:w-6" /> 
              <span className="truncate">AI Grading Insights</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              {[
                {
                  icon: <FileCheck className="text-green-400 h-5 w-5" />,
                  title: "Assignments Graded",
                  value: aiInsights.totalAssignmentsGraded,
                },
                {
                  icon: <Clock className="text-blue-400 h-5 w-5" />,
                  title: "Grading Time Saved",
                  value: `${aiInsights.averageGradingTimeSaved}%`,
                },
                {
                  icon: <GitPullRequest className="text-purple-400 h-5 w-5" />,
                  title: "Personalized Feedback",
                  value: aiInsights.personalizedFeedbackGenerated,
                },
                {
                  icon: <TrendingUp className="text-orange-400 h-5 w-5" />,
                  title: "Learning Gaps Identified",
                  value: aiInsights.learningGapIdentified,
                },
              ].map((metric) => (
                <div
                  key={metric.title}
                  className="flex items-center bg-slate-800 p-3 sm:p-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="mr-3 sm:mr-4">{metric.icon}</div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400">{metric.title}</p>
                    <p className="text-lg sm:text-xl font-bold text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Management Advanced */}
          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center">
                <Users className="mr-2 sm:mr-3 text-cyan-500 h-5 w-5 sm:h-6 sm:w-6" /> Classroom Management
              </h2>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                <UserPlus className="inline-block mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Create Classroom
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32 sm:h-48">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : classrooms.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-6 sm:p-8 text-center">
                <p className="text-slate-400 text-lg">
                  No Classroom Found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    onClick={() =>
                      navigate(`/teacher-class/${classroom.classCode}`)
                    }
                    className="bg-slate-800 rounded-lg p-4 sm:p-6 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <div className="overflow-hidden">
                        <h3 className="text-lg sm:text-xl font-semibold text-cyan-300 truncate">
                          {classroom.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {classroom.subject}
                        </p>
                      </div>
                      <ChevronRight className="text-slate-500 h-5 w-5" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="bg-slate-900 p-2 sm:p-4 rounded-lg flex items-center">
                        <Users className="text-blue-400 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        <div>
                          <p className="text-xs sm:text-sm text-slate-400">Students</p>
                          <p className="text-base sm:text-lg font-bold">
                            {classroom.students}
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2 sm:p-4 rounded-lg flex items-center">
                        <BookOpen className="text-green-400 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        <div>
                          <p className="text-xs sm:text-sm text-slate-400">Assignments</p>
                          <p className="text-base sm:text-lg font-bold">
                            {classroom.assignmentsCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900 p-2 sm:p-4 rounded-lg mb-3 sm:mb-4">
                      <div className="flex items-center">
                        <Brain className="text-purple-400 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs sm:text-sm">Learning Assessment</span>
                      </div>
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs ${
                          classroom.learningAssessment
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {classroom.learningAssessment
                          ? "Available"
                          : "Not Available"}
                      </span>
                    </div>

                    {/* Recent Assignments Section */}
                    <div className="mt-3 sm:mt-4">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3 flex items-center">
                        <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Recent Assignments
                      </h4>
                      {classroom.recentAssignments &&
                      classroom.recentAssignments.length > 0 ? (
                        <div className="space-y-1.5 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                          {classroom.recentAssignments.slice(0, 3).map((assignment) => (
                            <div
                              key={assignment.id}
                              className="bg-slate-900 p-2 sm:p-3 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs sm:text-sm font-medium truncate">
                                  {assignment.title}
                                </p>
                              </div>
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap ml-2 ${getStatusColor(assignment.status)}`}
                              >
                                {assignment.status.charAt(0).toUpperCase() +
                                  assignment.status.slice(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-900 p-2 sm:p-3 rounded-lg text-center">
                          <p className="text-xs sm:text-sm text-slate-400">
                            No recent assignments
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Panel (1 column on desktop, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02] sticky top-6">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center mb-4 sm:mb-6">
              <Bell className="mr-2 sm:mr-3 text-cyan-500 h-5 w-5 sm:h-6 sm:w-6" /> Notifications
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-slate-800 p-3 sm:p-4 rounded-lg hover:bg-slate-700 transition-colors flex items-start"
                >
                  <div className="mr-3 sm:mr-4">
                    {notification.type === "assignment" ? (
                      <FileText className="text-blue-400 h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <BarChart2 className="text-green-400 h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 sm:mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;