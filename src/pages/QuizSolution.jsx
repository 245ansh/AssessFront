import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, Percent, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Enhanced mock data with more questions
const mockQuizData = {
  quizId: 1,
  title: 'Calculus Quiz 1',
  description: 'Covers differentiation and basic integration techniques',
  totalScore: 78,
  questions: [
    {
      type: 'mcq',
      question: 'What is the derivative of sin(x)?',
      options: [
        { id: 'a', text: 'cos(x)', isCorrect: true },
        { id: 'b', text: '-sin(x)', isCorrect: false },
        { id: 'c', text: 'tan(x)', isCorrect: false },
        { id: 'd', text: '-cos(x)', isCorrect: false }
      ],
      selectedOption: 'a',
      correctOption: 'a'
    },
    {
      type: 'paragraph',
      question: 'Explain the chain rule and provide an example of its application.',
      studentAnswer: 'The chain rule is used for differentiating composite functions. For example, if y = sin(x²), then dy/dx = 2x·cos(x²).',
      correctAnswer: 'The chain rule states that the derivative of a composite function is the derivative of the outer function evaluated at the inner function times the derivative of the inner function. For example, if y = sin(x²), then dy/dx = cos(x²)·2x = 2x·cos(x²).',
      accuracy: 85
    },
    {
      type: 'mcq',
      question: 'Which of the following is the integral of x²?',
      options: [
        { id: 'a', text: 'x³', isCorrect: false },
        { id: 'b', text: 'x³/2', isCorrect: false },
        { id: 'c', text: 'x³/3 + C', isCorrect: true },
        { id: 'd', text: '2x³ + C', isCorrect: false }
      ],
      selectedOption: 'c',
      correctOption: 'c'
    },
    {
      type: 'paragraph',
      question: 'Describe the fundamental theorem of calculus and its significance in mathematics.',
      studentAnswer: 'The fundamental theorem of calculus connects differentiation and integration, showing they are inverse operations. It allows us to evaluate definite integrals using antiderivatives.',
      correctAnswer: 'The fundamental theorem of calculus consists of two parts that establish the relationship between differentiation and integration. The first part states that if f is continuous on [a,b], then the function F(x) = ∫ₐˣ f(t)dt is continuous on [a,b], differentiable on (a,b), and F\'(x) = f(x). The second part states that if f is continuous on [a,b] and F is any antiderivative of f, then ∫ₐᵇ f(x)dx = F(b) - F(a). This theorem is significant because it provides a practical way to compute definite integrals and establishes that differentiation and integration are inverse processes.',
      accuracy: 70
    },
    {
      type: 'mcq',
      question: 'What is the limit of (sin x)/x as x approaches 0?',
      options: [
        { id: 'a', text: '0', isCorrect: false },
        { id: 'b', text: '1', isCorrect: true },
        { id: 'c', text: 'Undefined', isCorrect: false },
        { id: 'd', text: 'Infinity', isCorrect: false }
      ],
      selectedOption: 'd',
      correctOption: 'b'
    },
    {
      type: 'mcq',
      question: 'Which of the following tests is most appropriate for determining the convergence of the series Σ(n²/3ⁿ) from n=1 to infinity?',
      options: [
        { id: 'a', text: 'Ratio test', isCorrect: true },
        { id: 'b', text: 'Root test', isCorrect: false },
        { id: 'c', text: 'Integral test', isCorrect: false },
        { id: 'd', text: 'Comparison test', isCorrect: false }
      ],
      selectedOption: 'b',
      correctOption: 'a'
    },
    {
      type: 'paragraph',
      question: 'Explain the concept of a definite integral as the limit of a Riemann sum.',
      studentAnswer: 'A definite integral is found by taking the limit of Riemann sums as the number of partitions approaches infinity. We divide the interval into subintervals, multiply each subinterval width by a function value within that subinterval, sum these products, and take the limit as the width of each subinterval approaches zero.',
      correctAnswer: 'A definite integral ∫ₐᵇ f(x)dx represents the limit of Riemann sums as the number of partitions approaches infinity. Specifically, we partition the interval [a,b] into n subintervals, each with width Δx = (b-a)/n. For each subinterval [xᵢ₋₁, xᵢ], we select a sample point cᵢ and form the sum Σᵢ₌₁ⁿ f(cᵢ)Δx. The definite integral is the limit of this sum as n approaches infinity, or equivalently, as the maximum width of each subinterval approaches zero. Geometrically, for positive functions, this represents the area under the curve over the given interval.',
      accuracy: 90
    },
    {
      type: 'paragraph',
      question: 'Describe the application of derivatives in optimization problems with a real-world example.',
      studentAnswer: 'Derivatives help find maximum and minimum values in optimization problems. For example, a company can use derivatives to find the production level that maximizes profit by finding where the derivative of the profit function equals zero.',
      correctAnswer: 'Derivatives are essential in optimization problems because the critical points where the first derivative equals zero (and the second derivative confirms whether its a maximum or minimum) identify potential optimal solutions. In real-world applications, a manufacturing company might have a cost function C(x) and a revenue function R(x) based on production quantity x. The profit function P(x) = R(x) - C(x) can be maximized by finding x such that P\'(x) = 0 and P\'\'(x) < 0. For instance, if a companys profit function is P(x) = 50x - 0.01x² - 100,000, we can find the optimal production level by solving P\'(x) = 50 - 0.02x = 0, which gives x = 2,500 units. The second derivative P\'\'(x) = -0.02 < 0 confirms this is a maximum.',
      accuracy: 75
    }
  ]
};

const QuizSolution = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const renderMCQQuestion = (question, index) => (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
        <span className="px-3 py-1 rounded-full text-xs bg-purple-900 text-purple-400">
          Multiple Choice
        </span>
      </div>
      <p className="mb-6 text-white">{question.question}</p>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div 
            key={option.id} 
            className={`
              p-4 rounded-lg border-2 transition-all
              ${option.id === question.selectedOption 
                ? option.isCorrect 
                  ? 'bg-green-900/30 border-green-500' 
                  : 'bg-red-900/30 border-red-500'
                : option.isCorrect 
                  ? 'bg-cyan-900/30 border-cyan-500' 
                  : 'bg-slate-800 border-slate-700'
              }
            `}
          >
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                ${option.id === question.selectedOption
                  ? option.isCorrect
                    ? 'border-green-500 bg-green-500'
                    : 'border-red-500 bg-red-500'
                  : option.isCorrect
                    ? 'border-cyan-500 bg-cyan-500'
                    : 'border-slate-600'
                }
              `}>
                {(option.id === question.selectedOption || option.isCorrect) && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium text-white w-8">{option.id.toUpperCase()}</span>
              <span className="flex-grow text-white">{option.text}</span>
              {option.id === question.selectedOption && (
                <div className="flex items-center text-sm ml-2">
                  <span className="mr-1 text-slate-300">Your answer</span>
                  {option.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              )}
              {option.isCorrect && option.id !== question.selectedOption && (
                <div className="flex items-center text-sm ml-2">
                  <span className="mr-1 text-slate-300">Correct answer</span>
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderParagraphQuestion = (question, index) => (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
        <span className="px-3 py-1 rounded-full text-xs bg-cyan-900 text-cyan-400">
          Paragraph
        </span>
      </div>
      <p className="mb-6 text-white">{question.question}</p>
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-slate-400" />
            <h4 className="font-medium text-slate-300">Your Answer</h4>
          </div>
          <p className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-white">
            {question.studentAnswer}
          </p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-cyan-400" />
            <h4 className="font-medium text-cyan-400">Correct Answer</h4>
          </div>
          <p className="bg-slate-800 p-4 rounded-lg border border-cyan-900 text-white">
            {question.correctAnswer}
          </p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <Percent className="h-4 w-4 mr-2 text-cyan-400" />
            <h4 className="font-medium text-cyan-400">Answer Accuracy</h4>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div 
                className="bg-cyan-500 h-2.5 rounded-full" 
                style={{ width: `${question.accuracy}%` }}
              ></div>
            </div>
            <span className="ml-2 text-white">{question.accuracy}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Score summary component
  const QuizSummary = () => (
    <div className="mb-8 bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Quiz Summary</h3>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Overall Score</span>
          <span className="text-xl font-bold text-cyan-400">{mockQuizData.totalScore}%</span>
        </div>
        <div className="mt-2 w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-cyan-500 h-2.5 rounded-full" 
            style={{ width: `${mockQuizData.totalScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={goBack} 
            className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">{mockQuizData.title}</h1>
            <p className="text-slate-400">{mockQuizData.description}</p>
          </div>
        </div>
      </div>

      {/* Quiz Summary */}
      <QuizSummary />

      {/* Questions in a 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockQuizData.questions.map((question, index) => (
          <div key={index}>
            {question.type === 'mcq'
              ? renderMCQQuestion(question, index)
              : renderParagraphQuestion(question, index)
            }
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-slate-800/50 rounded-lg p-4 flex items-start">
        <HelpCircle className="text-cyan-400 mr-3 h-5 w-5 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-cyan-400">Quiz Results</h3>
          <p className="text-sm text-slate-400">
            This is a summary of your quiz results. Review your answers and compare them with the correct solutions.
            You can use the back button to return to your courses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSolution;