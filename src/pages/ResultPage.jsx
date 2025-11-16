import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  if (!state || !state.result) {
    return (
      <div className="text-center text-white p-10">
        <h1 className="text-2xl mb-3">No Result Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-cyan-600 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const result = state.result;

  // Correct answers count
  const correctAnswers = result.questionResults.filter((r) => r.correct).length;
  const totalQuestions = result.questionResults.length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  // Handle AI Feedback
  const handleAI_Feedback = () => {
    setLoadingFeedback(true);

    // ⚠ Only button setup. API call you will add later.
    setTimeout(() => {
      setLoadingFeedback(false);
      navigate("/ai-feedback", {
        state: { result },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-cyan-400">Quiz Result</h1>
      </div>

      {/* SCORE CARD */}
      <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-slate-800 mb-8 shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Your Performance</h2>

        {/* Accuracy Circle */}
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="60"
              stroke="#1e293b"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="60"
              stroke="#06b6d4"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${accuracy * 3.78}, 999`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-cyan-400">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center text-slate-300 space-y-1 text-lg">
          <p>
            Total Questions:{" "}
            <span className="text-white font-semibold">{totalQuestions}</span>
          </p>

          <p>
            Correct Answers:{" "}
            <span className="text-green-400 font-bold">{correctAnswers}</span>
          </p>

          <p>
            Accuracy:{" "}
            <span className="text-cyan-400 font-bold">{accuracy}%</span>
          </p>
        </div>

        {/* AI FEEDBACK BUTTON */}
        <button
          onClick={handleAI_Feedback}
          disabled={loadingFeedback}
          className={`mt-6 flex items-center gap-2 px-6 py-3 text-white rounded-lg transition text-lg 
          ${
            loadingFeedback
              ? "bg-cyan-900 cursor-wait"
              : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {loadingFeedback ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          AI Feedback
        </button>
      </div>

      {/* QUESTION RESULTS */}
      <div className="space-y-6">
        {result.questionResults.map((q, index) => (
          <div
            key={q.questionId}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Question {index + 1}
              </h3>

              {q.correct ? (
                <CheckCircle className="text-green-500 h-6 w-6" />
              ) : (
                <XCircle className="text-red-500 h-6 w-6" />
              )}
            </div>

            {/* Question */}
            <p className="text-slate-300 mb-4">{q.questionText}</p>

            {/* Student Answer */}
            <div className="mb-3">
              <span className="font-semibold text-cyan-400">Your Answer:</span>
              <p className="text-slate-300">
                {q.studentAnswer || q.studentParagraph || "Not Answered"}
              </p>
            </div>

            {/* Correct Answer */}
            <div className="mb-4">
              <span className="font-semibold text-purple-400">Correct Answer:</span>
              <p className="text-slate-300">
                {q.correctAnswer || "—"}
              </p>
            </div>

            {/* Paragraph Evaluation */}
            {q.type === "Paragraph" && (
              <>
                <span className="font-semibold text-yellow-400">
                  Evaluation:
                </span>
                <p className="text-slate-300 mt-1">
                  {q.paragraphEvaluation}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
