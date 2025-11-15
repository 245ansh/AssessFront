import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Brain, 
  Calendar, 
  Users, 
  BookOpen,
  AlertCircle,
  Download,
  Upload,
  ExternalLink,
  Award,
  BarChart,
  Eye,
  TrendingUp,
  Target,
  Lightbulb,
  BookMarked,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments');
  const { classId } = useParams();
  const { classcode } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const response = await fetch(`/api/classroom/${classcode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch classroom data');
        }
        const data = await response.json();
        
        // Transform the data to match our component's expected structure
        const transformedData = {
          className: data.className,
          classJoinedDate: new Date(data.classJoinedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          teacherName: data.teacherName,
          subject: data.subject,
          classDescription: data.classDescription,
          assignments: data.assignments.map(assignment => ({
            id: assignment.id,
            name: assignment.title,
            description: assignment.description,
            status: assignment.attemptedDate ? 'Completed' : 'Not Started',
            releaseDate: new Date(assignment.creationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            submittedOn: assignment.attemptedDate ? new Date(assignment.attemptedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : null,
            score: assignment.score,
            feedback: null // Assuming feedback is not provided in the API response
          })),
          // Keep the default values for learningAssessment and overallFeedback
          // until we have API endpoints for these
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
            progressInsights: [
              {
                topic: 'Calculus',
                proficiency: 90,
                comment: 'Excellent understanding of derivatives and basic integration'
              },
              {
                topic: 'Algebra',
                proficiency: 85,
                comment: 'Good grasp of matrix operations, needs work on complex equations'
              },
              {
                topic: 'Trigonometry',
                proficiency: 88,
                comment: 'Strong foundation in identities, room for improvement in applications'
              }
            ],
            recommendations: [
              'Focus on time management strategies during problem-solving',
              'Practice showing detailed steps in solutions',
              'Dedicate extra time to complex integration techniques',
              'Continue strong performance in calculus fundamentals'
            ],
            detailedFeedback: `Your performance in Advanced Mathematics has been consistently strong, demonstrating a particularly impressive grasp of calculus concepts and problem-solving techniques. Your work shows a natural aptitude for mathematical thinking and a dedicated approach to learning.

In calculus, your understanding of derivatives and basic integration is exemplary, scoring in the top percentile of the class. Your solutions demonstrate clear logical progression and strong analytical skills. However, when dealing with complex integration problems, there's room for improvement in showing detailed step-by-step work.

Your algebra skills are solid, particularly in matrix operations and linear systems. The occasional challenges with complex equations could be addressed through more focused practice on breaking down multi-step problems into smaller, manageable components.

Regarding trigonometry, you've built a strong foundation in fundamental identities. To enhance your performance further, focus on applying these concepts to real-world problems and complex mathematical scenarios.

Time management during assessments has been identified as an area for development. Consider practicing with timed exercises to improve efficiency while maintaining accuracy. Remember, showing your work clearly not only helps in grading but also in identifying any misconceptions or areas needing clarification.

Overall, your trajectory in this course is positive, with your dedication to learning and strong problem-solving abilities setting you up for continued success. Keep focusing on the recommended improvement areas while maintaining your strengths, and you're well-positioned to excel in advanced mathematical concepts.`
          }
        };
        console.log(response.data);
        setClassroom(transformedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching classroom data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroomData();
  }, [classId]);
  
  const takeAssignment = (assignmentId) => { 
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
    navigate(`/classroom/${classcode}/assessment/0101`);
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
          <button
            className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition duration-150 ease-in-out"
          >
            Leave Class
          </button>
        </div>
      </div>
      
      {/* Classroom Overview Card */}
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
      </div>
      
      {/* Tabs Navigation - Desktop */}
      <div className="hidden sm:flex border-b border-slate-800 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'assignments' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'learning' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('learning')}
        >
          Learning Assessment
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-0">Assignments</h2>
              
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-xs bg-slate-800 px-2 sm:px-3 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'Completed').length} Completed
                </span>
                <span className="flex items-center text-xs bg-slate-800 px-2 sm:px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-yellow-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'In Progress' || a.status === 'Pending Review').length} Pending
                </span>
                <span className="flex items-center text-xs bg-slate-800 px-2 sm:px-3 py-1 rounded-full">
                  <AlertCircle className="h-3 w-3 text-red-500 mr-1" /> {classroom.assignments.filter(a => a.status === 'Not Started').length} Not Started
                </span>
              </div>
            </div>
            
            {classroom.assignments.length > 0 ? (
              <div className="space-y-4">
                {classroom.assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-slate-800 rounded-lg p-3 sm:p-4 hover:bg-slate-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-base sm:text-lg font-semibold text-cyan-300">{assignment.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-400">{assignment.description}</p>
                      </div>
                      <span className={`
                        ${assignment.status === 'Completed' ? 'bg-green-500' : 
                          'bg-red-500'} 
                        text-white px-2 py-1 rounded-full text-xs self-start sm:self-auto`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 text-xs sm:text-sm">
                      <div className="bg-slate-700 p-2 rounded flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                        <div>
                          <span className="text-xs text-slate-400">Released</span>
                          <p>{assignment.releaseDate}</p>
                        </div>
                      </div>
                      
                      {assignment.submittedOn && (
                        <div className="bg-slate-700 p-2 rounded flex items-center">
                          <Upload className="h-4 w-4 mr-2 text-green-400" />
                          <div>
                            <span className="text-xs text-slate-400">Attempted</span>
                            <p>{assignment.submittedOn}</p>
                          </div>
                        </div>
                      )}
                      
                      {assignment.score !== null && (
                        <div className="bg-slate-700 p-2 rounded flex items-center">
                          <Award className="h-4 w-4 mr-2 text-yellow-400" />
                          <div>
                            <span className="text-xs text-slate-400">Score</span>
                            <p>{assignment.score}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {assignment.feedback && (
                      <div className="mt-4 bg-slate-700 p-3 rounded-lg border-l-4 border-cyan-500">
                        <h4 className="text-xs sm:text-sm font-semibold text-cyan-300 mb-1">Feedback</h4>
                        <p className="text-xs sm:text-sm">{assignment.feedback}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      {assignment.status === 'Not Started' || assignment.status === 'In Progress' ? (
                        <button 
                          onClick={() => takeAssignment(assignment.id)} 
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors"
                        >
                          <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Start Assignment
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => viewSolution(assignment.id)} 
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors"
                          >
                            <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> View Solution
                          </button>
                          <button 
                            onClick={() => viewFeedback(assignment.id)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm flex items-center transition-colors"
                          >
                            <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> View Feedback
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
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
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
                <span className="text-base sm:text-lg font-bold">{classroom.overallFeedback.performance.score}%</span>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 ml-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Strengths */}
              <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-3 sm:mb-4 flex items-center">
                  <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Key Strengths
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {classroom.overallFeedback.performance.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5" /> Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {classroom.overallFeedback.performance.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Topic Progress */}
            {/* <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                <BookMarked className="mr-2 h-5 w-5" /> Topic Progress
              </h3>
              <div className="space-y-4">
                {classroom.overallFeedback.progressInsights.map((topic, index) => (
                  <div key={index} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">{topic.topic}</h4>
                      <span className="text-cyan-400 font-semibold">{topic.proficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                      <div 
                        className="bg-cyan-400 h-2 rounded-full" 
                        style={{ width: `${topic.proficiency}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-300">{topic.comment}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Recommendations */}
            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" /> Recommendations for Improvement
              </h3>
              <div className="grid gap-3">
                {classroom.overallFeedback.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-slate-700 p-4 rounded-lg flex items-start">
                    <div className="h-6 w-6 bg-purple-900 rounded-full flex items-center justify-center text-purple-400 mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-slate-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Written Feedback */}
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Detailed Feedback
              </h3>
              <div className="prose prose-invert max-w-none">
                {classroom.overallFeedback.detailedFeedback.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-slate-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
