// src/pages/ClassDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Brain,
  Calendar,
  Users,
  BookOpen,
  AlertCircle,
  ExternalLink,
  Award,
  BarChart,
  TrendingUp,
  Target,
  Lightbulb,
  Menu,
  X,
  Play
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentService } from '../services/assignmentService';
import { classroomService } from '../services/classroomService';

const ClassDetails = () => {
  const [classroom, setClassroom] = useState({
    className: '',
    classJoinedDate: '',
    teacherName: '',
    subject: '',
    classDescription: '',
    assignments: [],
    learningAssessment: {
      completed: false,
      lastAssessmentDate: null,
      strengths: [],
      areasToImprove: [],
      recommendedStrategies: []
    },
    overallFeedback: {
      performance: {
        score: 0,
        trend: '',
        strengths: [],
        areasForImprovement: []
      },
      progressInsights: [],
      recommendations: [],
      detailedFeedback: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FEEDBACK specific states
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackFetchedOnce, setFeedbackFetchedOnce] = useState(false);
  const [attemptedAssignments, setAttemptedAssignments] = useState([]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments');
  const { classroomId } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchAttemptedAssignments = useCallback(async () => {
    try {
      const response = await assignmentService.getAttemptedAssignments(classroomId);
      setAttemptedAssignments(response || []);
    } catch (err) {
      console.error('Error fetching attempted assignments:', err);
      setAttemptedAssignments([]);
    }
  }, [classroomId]);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        console.log('ClassDetails: classroomId from params:', classroomId);

        if (!classroomId || classroomId === '0' || classroomId === 'undefined') {
          throw new Error('Invalid classroom ID provided');
        }

        setLoading(true);
        setError(null);
        
        const response = await classroomService.getClassroomById(classroomId);

        console.log('API Response:', response);

        const transformedData = {
          className: response.className || response.subject || 'Unknown Class',
          classJoinedDate: response.createdAt || new Date().toISOString(),
          teacherName: (response.teacher && response.teacher.fullName) || response.teacherName || 'Unknown Teacher',
          subject: response.subject || 'General',
          classDescription: response.description || 'No description available',
          assignments: response.assignments || [],
          learningAssessment: {
            completed: false,
            lastAssessmentDate: 'Feb 15, 2025',
            strengths: ['Visual learning', 'Problem solving'],
            areasToImprove: ['Time management', 'Test anxiety'],
            recommendedStrategies: [
              'Use visual aids when studying complex concepts',
              'Break down problems into smaller steps',
              'Schedule specific time blocks for practice'
            ]
          },
          overallFeedback: {
            performance: {
              score: 88,
              trend: 'improving',
              strengths: [
                'Exceptional problem-solving skills in calculus',
                'Strong grasp of algebraic concepts',
                'Consistent completion of assignments'
              ],
              areasForImprovement: [
                'Time management during quizzes',
                'Showing detailed work in solutions',
                'Complex integration techniques'
              ]
            },
            progressInsights: response.progressInsights || [
              { topic: 'Calculus', proficiency: 90, comment: 'Excellent understanding' },
              { topic: 'Algebra', proficiency: 85, comment: 'Good grasp' },
              { topic: 'Trigonometry', proficiency: 88, comment: 'Strong foundation' }
            ],
            recommendations: response.recommendations || [
              'Focus on time management strategies during problem-solving',
              'Practice showing detailed steps in solutions',
              'Dedicate extra time to complex integration techniques',
              'Continue strong performance in calculus fundamentals'
            ],
            detailedFeedback: response.detailedFeedback || `Your performance in Advanced Mathematics has been consistently strong...`
          }
        };

        setClassroom(transformedData);
        
        // Fetch attempted assignments after getting classroom data
        await fetchAttemptedAssignments();
      } catch (err) {
        console.error('Error fetching classroom data:', err);

        if (err.message === 'Invalid classroom ID provided') {
          setError('Invalid classroom ID. Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/student-dashboard');
          }, 1500);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load classroom details');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClassroomData();
  }, [classroomId, navigate, fetchAttemptedAssignments]);

  // fetch feedback from backend
  const fetchFeedback = useCallback(async (opts = { force: false }) => {
    // don't re-fetch repeatedly unless forced
    if (feedbackFetchedOnce && !opts.force) return;

    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const res = await classroomService.getClassFeedback(classroomId);
      console.log(res);
      // backend returns structured feedback with strengths, detailedFeedback, and improvements
      setFeedbackData(res);
      setFeedbackFetchedOnce(true);

      // also update classroom.overallFeedback with structured data
      setClassroom(prev => ({
        ...prev,
        overallFeedback: {
          ...prev.overallFeedback,
          performance: {
            ...prev.overallFeedback.performance,
            strengths: res.strengths || prev.overallFeedback.performance.strengths,
            areasForImprovement: res.improvements || prev.overallFeedback.performance.areasForImprovement
          },
          detailedFeedback: res.detailedFeedback || prev.overallFeedback.detailedFeedback
        }
      }));
    } catch (err) {
      console.error('fetchFeedback err', err);
      setFeedbackError(err.response?.data?.message || err.message || 'Failed to fetch feedback');
    } finally {
      setFeedbackLoading(false);
    }
  }, [classroomId, feedbackFetchedOnce]);

  // when user switches to feedback tab -> fetch feedback automatically
  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedback();
    }
  }, [activeTab, fetchFeedback]);

  const takeAssignment = (assignmentId) => {
    // Check if assignment has already been attempted
    const isAttempted = attemptedAssignments.some(assignment => 
      assignment.id === assignmentId || assignment.asgnId === assignmentId
    );
    
    if (isAttempted) {
      alert('You have already attempted this assignment. You cannot attempt it again.');
      return;
    }
    
    navigate(`/quizform/${assignmentId}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  const viewSolution = (assignmentId) => {
    navigate(`/assignment-solution/${assignmentId}`);
  };

  const viewFeedback = (assignmentId) => {
    navigate(`/assignment-feedback/${assignmentId}`);
  };

  const handleAssessmentAttempt = () => {
    navigate(`/classroom/${classroomId}/assessment/0101`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading classroom data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 p-6 rounded-xl max-w-md text-center w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Classroom</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={goBack}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 sm:p-6">
      {/* Header with back button */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={goBack} className="bg-slate-800 p-2 rounded-full mr-3 hover:bg-slate-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-cyan-400">{classroom.className}</h1>
          </div>
        </div>
        <div className="mt-2 sm:mt-0">
          
        </div>
      </div>

      {/* Classroom Overview Card
      <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg flex items-center">
            <Calendar className="text-cyan-500 mr-3 h-5 w-5" />
            <div>
              <p className="text-xs sm:text-sm text-slate-400">Joined Date</p>
              <p className="font-semibold text-sm sm:text-base">{classroom.classJoinedDate}</p>
            </div>
          </div>

          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg flex items-center">
            <Users className="text-cyan-500 mr-3 h-5 w-5" />
            <div>
              <p className="text-xs sm:text-sm text-slate-400">Teacher</p>
              <p className="font-semibold text-sm sm:text-base">{classroom.teacherName}</p>
            </div>
          </div>

          <div className="bg-slate-800 p-3 sm:p-4 rounded-lg flex items-center">
            <BookOpen className="text-cyan-500 mr-3 h-5 w-5" />
            <div>
              <p className="text-xs sm:text-sm text-slate-400">Subject</p>
              <p className="font-semibold text-sm sm:text-base">{classroom.subject}</p>
            </div>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base">{classroom.classDescription}</p>
      </div> */}

      {/* Tabs Navigation - Desktop */}
      <div className="hidden sm:flex border-b border-slate-800 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'assignments' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'feedback' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('feedback')}
        >
          Class Feedback
        </button>
      </div>

      {/* Mobile Tabs Navigation */}
      <div className="sm:hidden mb-4">
        <div className="relative">
          <button
            onClick={toggleMobileMenu}
            className="w-full bg-slate-800 py-3 px-4 rounded-lg flex justify-between items-center"
          >
            <span className="font-medium text-cyan-400">
              {activeTab === 'assignments' ? 'Assignments' :
                activeTab === 'learning' ? 'Learning Assessment' : 'Class Feedback'}
            </span>
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-lg z-10 shadow-lg">
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'assignments' ? 'bg-slate-700 text-cyan-400' : 'text-slate-300'}`}
                onClick={() => {
                  setActiveTab('assignments');
                  setMobileMenuOpen(false);
                }}
              >
                Assignments
              </button>
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'learning' ? 'bg-slate-700 text-cyan-400' : 'text-slate-300'}`}
                onClick={() => {
                  setActiveTab('learning');
                  setMobileMenuOpen(false);
                }}
              >
                Learning Assessment
              </button>
              <button
                className={`w-full text-left px-4 py-3 ${activeTab === 'feedback' ? 'bg-slate-700 text-cyan-400' : 'text-slate-300'}`}
                onClick={() => {
                  setActiveTab('feedback');
                  setMobileMenuOpen(false);
                }}
              >
                Class Feedback
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="bg-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-800">
        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-6">Assignments</h2>

            {classroom.assignments && classroom.assignments.length > 0 ? (
              <div className="space-y-4">
                {classroom.assignments.map((assignment) => {
                  const isAttempted = attemptedAssignments.some(attempted => 
                    attempted.id === (assignment.asgnId || assignment.id) || 
                    attempted.asgnId === (assignment.asgnId || assignment.id)
                  );
                  
                  return (
                    <div key={assignment.asgnId || assignment.id} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-cyan-300">{assignment.title}</h3>
                            {isAttempted && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Attempted</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{assignment.description || 'No description available'}</p>
                        </div>
                        <button
                          onClick={() => takeAssignment(assignment.asgnId || assignment.id)}
                          disabled={isAttempted}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                            isAttempted 
                              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                              : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          }`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isAttempted ? 'Already Attempted' : 'Attempt Assignment'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-800 p-4 sm:p-8 rounded-lg text-center">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Assignments Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                  There are currently no assignments available for this class.
                  Check back later or contact your teacher for more information.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-0">Learning Pattern Assessment</h2>

              <button
                onClick={handleAssessmentAttempt}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors"
              >
                <Brain className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> {classroom.learningAssessment.completed ? 'Retake Assessment' : 'Take Assessment'}
              </button>
            </div>

            {classroom.learningAssessment.completed ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-md font-semibold text-cyan-300 mb-2 sm:mb-3">Last Assessment</h3>
                  <p className="text-xs sm:text-sm text-slate-400">You completed your learning assessment on {classroom.learningAssessment.lastAssessmentDate}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-sm sm:text-md font-semibold text-green-400 mb-2 sm:mb-3 flex items-center">
                      <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Your Strengths
                    </h3>
                    <ul className="space-y-2">
                      {classroom.learningAssessment.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center text-xs sm:text-sm">
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 mr-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-sm sm:text-md font-semibold text-yellow-400 mb-2 sm:mb-3 flex items-center">
                      <AlertCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Areas to Improve
                    </h3>
                    <ul className="space-y-2">
                      {classroom.learningAssessment.areasToImprove.map((area, index) => (
                        <li key={index} className="flex items-center text-xs sm:text-sm">
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-yellow-500 mr-2"></div>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-md font-semibold text-cyan-300 mb-2 sm:mb-3 flex items-center">
                    <BarChart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Recommended Learning Strategies
                  </h3>
                  <ul className="space-y-2">
                    {classroom.learningAssessment.recommendedStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm mb-2">
                        <div className="h-4 w-4 sm:h-5 sm:w-5 bg-cyan-900 rounded-full flex items-center justify-center text-cyan-400 mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors">
                    <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> View Full Assessment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 p-4 sm:p-8 rounded-lg text-center">
                <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Discover Your Learning Style</h3>
                <p className="text-slate-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Take a short assessment to identify your learning strengths and receive personalized strategies to improve your performance in this class.
                </p>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-md flex items-center mx-auto transition-colors"
                  onClick={handleAssessmentAttempt}
                >
                  <Brain className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Start Assessment Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-0">Overall Class Performance</h2>
              <div className="flex items-center bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                {/* <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
                <span className="text-base sm:text-lg font-bold">{classroom.overallFeedback.performance.score}%</span>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 ml-2" /> */}
              </div>
            </div>

            {/* Generate Feedback Section */}
            <div className="bg-slate-800 p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center justify-center">
                  <MessageSquare className="mr-2 h-5 w-5" /> AI Performance Feedback
                </h3>
                
                <p className="text-slate-400 mb-6">
                  Get detailed AI-powered feedback on your classroom performance, including strengths, areas for improvement, and personalized recommendations.
                </p>

                {feedbackError && (
                  <div className="bg-rose-900/30 text-rose-300 p-3 rounded mb-4">
                    {feedbackError}
                  </div>
                )}

                {!feedbackData && (
                  <button
                    onClick={() => fetchFeedback({ force: true })}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={feedbackLoading}
                  >
                    {feedbackLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating Feedback...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        Generate AI Feedback
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Display Feedback Results */}
            {!feedbackLoading && !feedbackError && feedbackData && (
              <div className="space-y-6">
                {/* Strengths Section */}
                {feedbackData.strengths && feedbackData.strengths.length > 0 && (
                  <div className="bg-slate-800 p-6 rounded-lg">
                    <h4 className="text-base font-semibold text-green-400 mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {feedbackData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Feedback Section */}
                {feedbackData.detailedFeedback && (
                  <div className="bg-slate-800 p-6 rounded-lg">
                    <h4 className="text-base font-semibold text-cyan-400 mb-3 flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" /> Detailed Analysis
                    </h4>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      {feedbackData.detailedFeedback.split('\n\n').map((para, idx) => (
                        <p key={idx} className="text-slate-300 mb-3 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements Section */}
                {feedbackData.improvements && feedbackData.improvements.length > 0 && (
                  <div className="bg-slate-800 p-6 rounded-lg">
                    <h4 className="text-base font-semibold text-yellow-400 mb-3 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {feedbackData.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regenerate Button */}
                <div className="text-center">
                  <button
                    onClick={() => fetchFeedback({ force: true })}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm"
                    disabled={feedbackLoading}
                  >
                    {feedbackLoading ? 'Regenerating...' : 'Regenerate Feedback'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;