import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Send,
  CheckCircle,
  HelpCircle,
  Video,
  Headphones,
  FileText,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0); // 0: video, 1: audio, 2: text
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [assessmentData, setAssessmentData] = useState(null);
  const [mediaCompleted, setMediaCompleted] = useState({
    video: false,
    audio: false
  });

  // Dummy assessment data
  const dummyData = {
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    audioUrl: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
    textContent: `
      <h2>Understanding Learning Patterns</h2>
      <p>Learning is a complex process that varies from person to person. Some individuals absorb information best through visual stimuli, while others prefer auditory input or reading text. This phenomenon is often referred to as "learning styles" or "learning preferences."</p>
      
      <p>Recent research suggests that while people may have preferences for how they receive information, the most effective learning often comes from multiple modalities. When we engage with content through various channels—seeing, hearing, and reading—we create stronger neural connections and improve retention.</p>
      
      <h3>Key Principles of Effective Learning</h3>
      <ul>
        <li><strong>Active engagement</strong>: Interacting with the material rather than passively consuming it</li>
        <li><strong>Spaced repetition</strong>: Reviewing content at strategic intervals to strengthen memory</li>
        <li><strong>Contextual understanding</strong>: Connecting new information to existing knowledge</li>
        <li><strong>Application</strong>: Using the information in practical scenarios</li>
      </ul>
      
      <p>By understanding your personal learning preferences while also embracing multiple methods of information intake, you can optimize your educational experience and improve your ability to retain and apply knowledge.</p>
      
      <p>This assessment aims to evaluate how effectively you process and retain information across different media types—video, audio, and text. Your results will help identify your strengths and areas for improvement in multimodal learning scenarios.</p>
    `,
    videoQuestions: [
      {
        id: 1,
        type: "mcq",
        question: "What was the main character shown in the video?",
        options: ["A fox", "A rabbit", "A bear", "A bunny"],
        correctOption: 3
      },
      {
        id: 2,
        type: "mcq",
        question: "What was the predominant color of the background scenery?",
        options: ["Blue", "Green", "Brown", "Gray"],
        correctOption: 1
      },
      {
        id: 3,
        type: "paragraph",
        question: "Describe the main action or event that occurred in the video clip."
      }
    ],
    audioQuestions: [
      {
        id: 4,
        type: "mcq",
        question: "What type of instrument was predominantly heard in the audio?",
        options: ["Piano", "Guitar", "Drums", "Violin"],
        correctOption: 0
      },
      {
        id: 5,
        type: "mcq",
        question: "How would you describe the tempo of the audio clip?",
        options: ["Slow and melodic", "Fast and upbeat", "Moderate and rhythmic", "Varying throughout"],
        correctOption: 2
      },
      {
        id: 6,
        type: "paragraph",
        question: "How did the audio make you feel? Describe your emotional response and why you think you reacted this way."
      }
    ],
    textQuestions: [
      {
        id: 7,
        type: "mcq",
        question: "According to the text, what improves retention of information?",
        options: [
          "Focusing only on your preferred learning style",
          "Engaging with content through multiple channels",
          "Memorizing information through repetition alone",
          "Studying in complete silence"
        ],
        correctOption: 1
      },
      {
        id: 8,
        type: "mcq",
        question: "Which of the following is NOT mentioned as a key principle of effective learning?",
        options: [
          "Active engagement",
          "Spaced repetition",
          "Competitive learning",
          "Contextual understanding"
        ],
        correctOption: 2
      },
      {
        id: 9,
        type: "paragraph",
        question: "Explain how understanding your learning preferences might help you improve your study habits. Include specific examples based on the text."
      }
    ]
  };

  // Fetch assessment data (simulated)
  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      setAssessmentData(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle video completion
  const handleVideoEnded = () => {
    setMediaCompleted(prev => ({ ...prev, video: true }));
  };

  // Handle audio completion
  const handleAudioEnded = () => {
    setMediaCompleted(prev => ({ ...prev, audio: true }));
  };

  // Handle MCQ answer selection
  const handleMCQAnswerChange = (questionId, option, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        type: 'mcq',
        section: currentSection,
        selectedOption: option,
        optionIndex: optionIndex
      }
    }));
  };

  // Handle paragraph answer input
  const handleParagraphAnswerChange = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        type: 'paragraph',
        section: currentSection,
        text: text
      }
    }));
  };

  // Navigate back to previous page
  const goBack = () => {
    navigate(-1);
  };

  // Submit all answers
  const handleSubmit = async () => {
    // For demo purposes, just log the answers
    console.log('Assessment submitted:', answers);
    alert('Assessment submitted successfully!\n\nCheck the console to see the submitted data.');
    
    // In a real implementation, you would send a POST request
    // try {
    //   const response = await fetch('/api/submit-learning-assessment', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ answers })
    //   });
    //   
    //   if (response.ok) {
    //     console.log('Assessment submitted successfully');
    //     navigate('/assessment-complete');
    //   } else {
    //     console.error('Failed to submit assessment');
    //   }
    // } catch (error) {
    //   console.error('Error submitting assessment:', error);
    // }
  };

  // Check if a question has been answered
  const isQuestionAnswered = (section, questionId) => {
    return !!answers[questionId] && answers[questionId].section === section;
  };
  
  // Check if all questions in current section are answered
  const areAllCurrentSectionQuestionsAnswered = () => {
    if (!assessmentData) return false;
    
    const currentSectionQuestions = getSectionQuestions();
    return currentSectionQuestions.every((question) => 
      isQuestionAnswered(currentSection, question.id)
    );
  };
  
  // Check if all questions in all sections are answered
  const areAllQuestionsAnswered = () => {
    if (!assessmentData) return false;
    
    const allQuestions = [
      ...assessmentData.videoQuestions,
      ...assessmentData.audioQuestions,
      ...assessmentData.textQuestions
    ];
    
    return allQuestions.every((question) => !!answers[question.id]);
  };
  
  // Get questions for current section
  const getSectionQuestions = () => {
    if (!assessmentData) return [];
    
    switch (currentSection) {
      case 0:
        return assessmentData.videoQuestions;
      case 1:
        return assessmentData.audioQuestions;
      case 2:
        return assessmentData.textQuestions;
      default:
        return [];
    }
  };
  
  // Get current section name
  const getSectionName = () => {
    switch (currentSection) {
      case 0:
        return "Video";
      case 1:
        return "Audio";
      case 2:
        return "Text";
      default:
        return "";
    }
  };
  
  // Get current question
  const getCurrentQuestion = () => {
    const questions = getSectionQuestions();
    return questions[currentQuestion] || null;
  };
  
  // Check if current question is the last in the section
  const isLastQuestionInSection = () => {
    const questions = getSectionQuestions();
    return currentQuestion === questions.length - 1;
  };
  
  // Check if current section is the last section
  const isLastSection = () => {
    return currentSection === 2;
  };
  
  // Move to next section
  const moveToNextSection = () => {
    setCurrentSection(prev => prev + 1);
    setCurrentQuestion(0);
  };
  
  // Get unanswered questions
  const getUnansweredQuestions = () => {
    if (!assessmentData) return [];
    
    const allQuestions = [
      ...assessmentData.videoQuestions,
      ...assessmentData.audioQuestions,
      ...assessmentData.textQuestions
    ];
    
    return allQuestions
      .filter(question => !answers[question.id])
      .map(question => question.id);
  };

  // For testing: Skip media completion requirements
  const skipMediaRequirement = () => {
    setMediaCompleted({ video: true, audio: true });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <Loader className="h-6 w-6 md:h-8 md:w-8 animate-spin text-cyan-400 mr-2 md:mr-3" />
        <p className="text-base md:text-xl font-semibold">Loading assessment...</p>
      </div>
    );
  }

  // Render media content based on current section
  const renderMediaContent = () => {
    if (!assessmentData) return null;

    switch (currentSection) {
      case 0:
        return (
          <div className="bg-slate-900 rounded-xl shadow-lg md:shadow-2xl p-4 md:p-6 border border-slate-800 mb-4 md:mb-6">
            <div className="flex items-center mb-3 md:mb-4">
              <Video className="text-cyan-400 mr-2 h-4 w-4 md:h-5 md:w-5" />
              <h2 className="text-lg md:text-xl font-semibold">Watch the Video</h2>
            </div>
            <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden mb-3 md:mb-4">
              <video 
                src={assessmentData.videoUrl} 
                controls 
                className="w-full h-full" 
                onEnded={handleVideoEnded}
                playsInline
              />
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <p className="text-slate-400 text-xs md:text-sm mb-2 md:mb-0">
                Please watch the complete video before proceeding to the questions.
              </p>
              {/* Development aid - remove in production */}
              <button 
                onClick={skipMediaRequirement}
                className="text-xs text-slate-500 hover:text-slate-400 self-end md:self-auto"
              >
                (Skip for development)
              </button>
            </div>
            {!mediaCompleted.video && (
              <div className="mt-3 md:mt-4 bg-amber-900/30 border border-amber-800/50 rounded-lg p-2 md:p-3 flex items-center">
                <AlertCircle className="text-amber-400 mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <p className="text-amber-300 text-xs md:text-sm">
                  You must watch the entire video before answering questions.
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="bg-slate-900 rounded-xl shadow-lg md:shadow-2xl p-4 md:p-6 border border-slate-800 mb-4 md:mb-6">
            <div className="flex items-center mb-3 md:mb-4">
              <Headphones className="text-cyan-400 mr-2 h-4 w-4 md:h-5 md:w-5" />
              <h2 className="text-lg md:text-xl font-semibold">Listen to the Audio</h2>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
              <audio 
                src={assessmentData.audioUrl} 
                controls 
                className="w-full" 
                onEnded={handleAudioEnded}
              />
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <p className="text-slate-400 text-xs md:text-sm mb-2 md:mb-0">
                Please listen to the complete audio before proceeding to the questions.
              </p>
              {/* Development aid - remove in production */}
              <button 
                onClick={skipMediaRequirement}
                className="text-xs text-slate-500 hover:text-slate-400 self-end md:self-auto"
              >
                (Skip for development)
              </button>
            </div>
            {!mediaCompleted.audio && (
              <div className="mt-3 md:mt-4 bg-amber-900/30 border border-amber-800/50 rounded-lg p-2 md:p-3 flex items-center">
                <AlertCircle className="text-amber-400 mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <p className="text-amber-300 text-xs md:text-sm">
                  You must listen to the entire audio before answering questions.
                </p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="bg-slate-900 rounded-xl shadow-lg md:shadow-2xl p-4 md:p-6 border border-slate-800 mb-4 md:mb-6">
            <div className="flex items-center mb-3 md:mb-4">
              <FileText className="text-cyan-400 mr-2 h-4 w-4 md:h-5 md:w-5" />
              <h2 className="text-lg md:text-xl font-semibold">Read the Text</h2>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 md:p-4 mb-3 md:mb-4 max-h-60 md:max-h-80 overflow-y-auto">
              <div className="prose prose-sm md:prose prose-invert prose-cyan">
                <div dangerouslySetInnerHTML={{ __html: assessmentData.textContent }} />
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Please read the text carefully before answering the questions.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 md:p-6">
      {/* Confirmation Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div className="relative bg-slate-900 rounded-xl p-4 md:p-6 w-full max-w-md mx-4 border border-slate-800 shadow-xl">
            <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-3 md:mb-4">Submit Assessment?</h3>
            <p className="text-slate-300 text-sm md:text-base mb-4 md:mb-6">
              Are you sure you want to submit your learning assessment? Make sure you have reviewed all your answers.
              This action cannot be undone.
            </p>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:justify-end md:space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm md:text-base order-2 md:order-1"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm md:text-base order-1 md:order-2"
              >
                <Send className="mr-2 h-4 w-4" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <button 
            onClick={goBack} 
            className="bg-slate-800 p-1.5 md:p-2 rounded-full mr-2 md:mr-4 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-cyan-400 truncate">Learning Pattern Assessment</h1>
            <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Assess your learning through video, audio, and text content</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between mb-1 md:mb-2">
          <span className="text-xs md:text-sm text-slate-400">Progress</span>
          <span className="text-xs md:text-sm text-cyan-400">
            {currentSection === 0 ? "Video Section" : currentSection === 1 ? "Audio Section" : "Text Section"}
          </span>
        </div>
        <div className="bg-slate-800 rounded-full h-1.5 md:h-2">
          <div 
            className="bg-cyan-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(currentSection / 3) * 100 + (currentQuestion / getSectionQuestions().length) * (100 / 3)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex mb-4 md:mb-6 overflow-x-auto pb-2 gap-2">
        <button
          onClick={() => {
            if (currentSection >= 0) setCurrentSection(0);
          }}
          className={`
            flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm flex-shrink-0
            ${currentSection === 0 
              ? 'bg-cyan-600 text-white' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }
          `}
        >
          <Video className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Video
        </button>
        <button
          onClick={() => {
            if (currentSection >= 1) setCurrentSection(1);
          }}
          disabled={currentSection < 1}
          className={`
            flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm flex-shrink-0
            ${currentSection === 1 
              ? 'bg-cyan-600 text-white' 
              : currentSection < 1 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }
          `}
        >
          <Headphones className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Audio
        </button>
        <button
          onClick={() => {
            if (currentSection >= 2) setCurrentSection(2);
          }}
          disabled={currentSection < 2}
          className={`
            flex items-center justify-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm flex-shrink-0
            ${currentSection === 2 
              ? 'bg-cyan-600 text-white' 
              : currentSection < 2 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }
          `}
        >
          <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Text
        </button>
      </div>

      {/* Media Content */}
      {renderMediaContent()}

      {/* Questions */}
      {((currentSection === 0 && mediaCompleted.video) || 
         (currentSection === 1 && mediaCompleted.audio) || 
         currentSection === 2) && (
        <>
          {/* Question Navigation */}
          <div className="flex space-x-1 md:space-x-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {getSectionQuestions().map((question, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  flex items-center justify-center min-w-8 w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition-colors flex-shrink-0
                  ${currentQuestion === index 
                    ? 'bg-cyan-600 text-white' 
                    : isQuestionAnswered(currentSection, question.id) 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {isQuestionAnswered(currentSection, question.id) ? <CheckCircle className="h-3 w-3 md:h-4 md:w-4" /> : index + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          {getCurrentQuestion() && (
            <div className="bg-slate-900 rounded-xl shadow-lg md:shadow-2xl p-4 md:p-6 border border-slate-800 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-xs md:text-sm text-slate-400">
                  Question {currentQuestion + 1} of {getSectionQuestions().length} ({getSectionName()})
                </span>
                <span className={`
                  px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs
                  ${getCurrentQuestion().type === 'mcq' 
                    ? 'bg-purple-900 text-purple-400' 
                    : 'bg-cyan-900 text-cyan-400'
                  }
                `}>
                  {getCurrentQuestion().type === 'mcq' ? 'Multiple Choice' : 'Paragraph'}
                </span>
              </div>

              <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6">{getCurrentQuestion().question}</h2>

              {getCurrentQuestion().type === 'mcq' ? (
                <div className="space-y-2 md:space-y-3">
                  {getCurrentQuestion().options.map((option, index) => {
                    const currentAnswer = answers[getCurrentQuestion().id];
                    const isSelected = currentAnswer && currentAnswer.optionIndex === index;
                    
                    return (
                      <label 
                        key={index}
                        className={`
                          block p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer text-sm md:text-base
                          ${isSelected
                            ? 'bg-cyan-900/50 border-cyan-500'
                            : 'bg-slate-800 border-transparent hover:border-slate-600'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${getCurrentQuestion().id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleMCQAnswerChange(getCurrentQuestion().id, option, index)}
                          className="hidden"
                        />
                        <div className="flex items-center">
                          <div className={`
                            w-4 h-4 md:w-5 md:h-5 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0
                            ${isSelected
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-slate-600'
                            }
                          `}>
                            {isSelected && (
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="flex-1">{option}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={answers[getCurrentQuestion().id]?.text || ''}
                  onChange={(e) => handleParagraphAnswerChange(getCurrentQuestion().id, e.target.value)}
                  className="w-full h-28 md:h-48 bg-slate-800 border border-slate-700 rounded-lg p-3 md:p-4 text-sm md:text-base text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`
                px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center transition-colors text-xs md:text-sm
                ${currentQuestion === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
                }
              `}
            >
              <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Previous
            </button>

            <div className="flex space-x-2 md:space-x-3">
              {isLastQuestionInSection() && isLastSection() && (
                <button
                  onClick={() => {
                    if (areAllQuestionsAnswered()) {
                      setShowConfirmSubmit(true);
                    } else {
                      // Get unanswered question indices
                      const unanswered = getUnansweredQuestions();
                      alert(`Please answer all questions before submitting. Questions ${unanswered.join(', ')} are unanswered.`);
                    }
                  }}
                  className={`
                    px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors flex items-center text-xs md:text-sm
                    ${areAllQuestionsAnswered()
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-slate-700 text-slate-300'
                    }
                  `}
                >
                  <Send className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Submit
                </button>
              )}
              
              {isLastQuestionInSection() && !isLastSection() && (
                <button
                  onClick={moveToNextSection}
                  disabled={!areAllCurrentSectionQuestionsAnswered()}
                  className={`
                    px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors flex items-center text-xs md:text-sm
                    ${areAllCurrentSectionQuestionsAnswered()
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                    }
                  `}
                >
                  Next <ArrowLeft className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 rotate-180" />
                </button>
              )}
              
              {!isLastQuestionInSection() && (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(getSectionQuestions().length - 1, prev + 1))}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  Next <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Help Text */}
      <div className="mt-6 bg-slate-800/50 rounded-lg p-4 flex items-start">
        <HelpCircle className="text-cyan-400 mr-3 h-5 w-5 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-cyan-400">Assessment Instructions</h3>
          <p className="text-sm text-slate-400">
            This assessment evaluates your learning ability across different media types. Start by watching the video, then listen to the audio, and finally read the text content. Answer all questions in each section before moving to the next. Your answers are automatically saved. You must complete all sections to submit the assessment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningAssessment;