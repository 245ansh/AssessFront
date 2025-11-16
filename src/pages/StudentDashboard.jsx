import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { assignmentService } from '../services/assignmentService';
import { classroomService } from '../services/classroomService';

import {
  Trophy,
  Target,
  FileText,
  Star,
  BookOpen,
  ArrowLeft,
  UserPlus,
  MessageSquare,
  Brain,
  Award,
  X,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classroomCode, setClassroomCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [studentProfile] = useState({
    name: 'Emma Thompson',
    grade: '11th',
    learningGoals: [
      {
        id: 1,
        title: 'Master Advanced Calculus',
        progress: 60,
        description: 'Complete advanced integration techniques',
        reward: 'Advanced Mathematician Badge'
      },
      {
        id: 2,
        title: 'ML Project Completion',
        progress: 40,
        description: 'Develop a machine learning application',
        reward: 'Tech Innovator Certificate'
      }
    ],
    achievements: [
      {
        id: 1,
        name: 'Perfect Attendance',
        icon: <Star className="text-yellow-400" />,
        level: 'Gold'
      },
      {
        id: 2,
        name: 'Top Performer',
        icon: <Trophy className="text-purple-500" />,
        level: 'Platinum'
      }
    ]
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!user.id) {
          setError("User ID not found. Please login again.");
          setLoading(false);
          return;
        }
        
        const response = await classroomService.getStudentClassrooms(user.id);
        console.log(response);
        if (response) {
          // Map the backend data structure to our component's format
          const mappedClassrooms = await Promise.all(
            response.map(async (classroom, index) => {
              // Use assignments data from classroom response instead of separate API call
              const attemptedAssignments = classroom.assignments || [];

              const assignedId = classroom.id || index;
              console.log(`Mapping classroom:`, {
                original: classroom,
                assignedId: assignedId,
                index: index
              });

              return {
                id: classroom.cid || assignedId,
                name: classroom.className || classroom.subject || 'Unknown Class',
                classcode: classroom.classroomCode || classroom.code || 'N/A',
                subject: classroom.subject || 'General',
                teacher: classroom.teacherName || classroom.teacher || 'Unknown',
                color: getRandomClassColor(),
                feedbackAvailable: attemptedAssignments.some(a => a.feedbackAvailable) || false,
                learningAssessmentCompleted: attemptedAssignments.some(a => a.assessmentCompleted) || false,
                recentAssignments: attemptedAssignments.slice(0, 3).map((assignment, assignmentIndex) => ({
                  id: assignment.asgnId || assignment.id || assignmentIndex + 1,
                  name: assignment.title,
                  description: assignment.description,
                  status: getAssignmentStatus(assignment),
                  dueDate: assignment.dueDate || 'No due date',
                  type: assignment.type || 'assignment'
                })) || classroom.assignments?.map((topic, topicIndex) => ({
                  id: topicIndex + 1,
                  name: topic.title,
                  description: topic.description,
                  status: getTopicStatus(topic),
                  createdAt: new Date(topic.createdAt).toLocaleDateString()
                })) || []
              };
            })
          );
          console.log(mappedClassrooms)
          setClassrooms(mappedClassrooms);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setError("Failed to load classrooms. Please try again later.");
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Helper function to determine assignment status
  const getAssignmentStatus = (assignment) => {
    if (assignment.completed) return 'Completed';
    if (assignment.submitted) return 'Submitted';
    if (assignment.inProgress) return 'In Progress';
    if (assignment.overdue) return 'Overdue';
    return 'Not Started';
  };

  // Helper function to determine topic status
  const getTopicStatus = (topic) => {
    // You might want to add more sophisticated status determination logic
    if (topic.completed) return 'Completed';
    if (topic.inProgress) return 'In Progress';
    return 'Not Started';
  };

  // Helper function to get random background color
  const getRandomClassColor = () => {
    const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-blue-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = () => {
    navigate('/classroom');
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    
    const trimmedCode = classroomCode.trim();
    
    if (!trimmedCode) {
      alert("⚠️ Please enter a valid classroom code.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user.id) {
        alert("User ID not found. Please login again.");
        return;
      }
      
      const response = await classroomService.joinClassroom(trimmedCode);

      console.log("✅ Server Response:", response);
      alert(response.message || "Successfully joined classroom!"); 
      
      // Refresh classrooms list
      const refreshClassrooms = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          
          const response = await classroomService.getStudentClassrooms(user.id);
          console.log(response);
          if (response) {
            // Map the backend data structure to our component's format
            const mappedClassrooms = await Promise.all(
              response.map(async (classroom, index) => {
                // Use assignments data from classroom response instead of separate API call
                const attemptedAssignments = classroom.assignments || [];

                const assignedId = classroom.id || index;
                console.log(`Mapping classroom (second location):`, {
                  original: classroom,
                  assignedId: assignedId,
                  index: index
                });

                return {
                  id: classroom.cid || assignedId,
                  name: classroom.className || classroom.subject || 'Unknown Class',
                  classcode: classroom.classroomCode || classroom.code || 'N/A',
                  subject: classroom.subject || 'General',
                  teacher: classroom.teacherName || classroom.teacher || 'Unknown',
                  color: getRandomClassColor(),
                  feedbackAvailable: attemptedAssignments.some(a => a.feedbackAvailable) || false,
                  learningAssessmentCompleted: attemptedAssignments.some(a => a.assessmentCompleted) || false,
                  recentAssignments: attemptedAssignments.slice(0, 3).map((assignment, assignmentIndex) => ({
                    id: assignment.asgnId || assignment.id || assignmentIndex + 1,
                    name: assignment.title,
                    description: assignment.description,
                    status: getAssignmentStatus(assignment),
                    dueDate: assignment.dueDate || 'No due date',
                    type: assignment.type || 'assignment'
                  })) || classroom.assignments?.map((topic, topicIndex) => ({
                    id: topicIndex + 1,
                    name: topic.title,
                    description: topic.description,
                    status: getTopicStatus(topic),
                    createdAt: new Date(topic.createdAt).toLocaleDateString()
                  })) || []
                };
              })
            );
            console.log(mappedClassrooms);
            setClassrooms(mappedClassrooms);
          }
          setLoading(false);
        } catch (err) {
          console.error("Error refreshing classrooms:", err);
          setLoading(false);
        }
      };
      
      await refreshClassrooms();
      
      setIsDialogOpen(false);
      setClassroomCode('');
    } catch (error) {
      console.error("❌ Join error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error joining classroom!");
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading classroom data...</p>
        </div>
      </div>
  );

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 sm:p-6">
      {/* Join Classroom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)}></div>
          <div className="relative bg-slate-900 rounded-xl p-4 sm:p-6 w-full max-w-md mx-4 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-cyan-400">Join Classroom</h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <form onSubmit={handleJoinClassroom}>
              <div className="mb-4">
                <label htmlFor="classroomCode" className="block text-sm font-medium text-slate-300 mb-2">
                  Enter Classroom Code
                </label>
                <input
                  type="text"
                  id="classroomCode"
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter code (e.g., ABC123)"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                Join Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <div className="flex items-center">
              <button onClick={goBack} className="bg-slate-800 p-2 rounded-full mr-3 hover:bg-slate-700 transition-colors">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center">
                <BookOpen className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" /> 
                <span className="truncate">My Classrooms</span>
              </h2>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
            >
              <UserPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Join Classroom
            </button>
          </div>

          {classrooms.length === 0 ? (
            <div className="text-center text-slate-400 py-8 sm:py-10">
              No classrooms joined yet. Click "Join Classroom" to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="bg-slate-800 rounded-lg p-3 sm:p-4 hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => {
                    console.log('Navigating to classroom with ID:', classroom.id, 'Classroom data:', classroom);
                    navigate(`/classroom/${classroom.id}`);
                  }}
                >
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-cyan-300 truncate">{classroom.name}</h3>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${classroom.color}`}></div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">Subject: {classroom.subject}</p>
                  <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">Teacher: {classroom.teacher}</p>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm text-slate-300 mb-1.5 sm:mb-2 flex items-center">
                      <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Recent Assignments
                    </h4>
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                      {classroom.recentAssignments.slice(0, 3).map((topic) => (
                        <div
                          key={topic.id}
                          className="flex justify-between items-center bg-slate-700 p-1.5 sm:p-2 rounded mb-1.5 sm:mb-2"
                        >
                          <div className="overflow-hidden flex-1 mr-2">
                            <span className="text-xs sm:text-sm text-white truncate block">{topic.name}</span>
                            <span className="text-xs text-slate-400 truncate block hidden sm:block">{topic.description}</span>
                          </div>
                          <span className={`
                            ${topic.status === 'Completed' ? 'bg-green-500' :
                              topic.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-red-500'} 
                            text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap`}
                          >
                            {topic.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
                    <div className={`flex items-center justify-center p-1.5 sm:p-2 rounded-lg ${classroom.feedbackAvailable ? 'bg-green-900 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs">Feedback</span>
                    </div>
                    <div className={`flex items-center justify-center p-1.5 sm:p-2 rounded-lg ${classroom.learningAssessmentCompleted ? 'bg-purple-900 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                      <Brain className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs">Assessment</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Learning Goals and Achievements in stacked layout on mobile, side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center mb-4 sm:mb-6">
              <Trophy className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" /> Achievements
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {studentProfile.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-slate-800 rounded-lg p-3 sm:p-4 flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center">
                    {React.cloneElement(achievement.icon, { className: achievement.icon.props.className + ' h-4 w-4 sm:h-5 sm:w-5' })}
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-base sm:text-lg font-semibold text-cyan-300">{achievement.name}</h3>
                      <span className="text-xs sm:text-sm text-slate-400">Level: {achievement.level}</span>
                    </div>
                  </div>
                  <Award className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              ))}
            </div>

            <button className="mt-4 sm:mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base">
              View All Achievements
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 transform transition-all hover:scale-[1.01] sm:hover:scale-[1.02]">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center mb-4 sm:mb-6">
              <Target className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" /> Learning Goals
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {studentProfile.learningGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-slate-800 rounded-lg p-3 sm:p-4 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-cyan-300 truncate mr-2">{goal.title}</h3>
                    <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 sm:h-2.5 mb-1.5 sm:mb-2">
                    <div
                      className="bg-cyan-500 h-2 sm:h-2.5 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">{goal.description}</p>
                  <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-xs text-purple-400 truncate">Reward: {goal.reward}</span>
                    <button className="text-xs bg-cyan-600 text-white px-3 py-1 rounded-full hover:bg-cyan-700 transition-colors w-full sm:w-auto text-center">
                      Update Goal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;