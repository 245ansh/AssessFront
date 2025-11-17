import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  CheckCircle,
  HelpCircle,
  Loader,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const QuizForm = () => {
  const navigate = useNavigate();
  const { quizcode } = useParams();

  const [questions, setQuestions] = useState([]);
  const [testId, setTestId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------------------------------------------
  // LOAD QUESTIONS + TEST ID
  // -------------------------------------------------------------
  useEffect(() => {
  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2452/api/assignment/${quizcode}`
      );

      console.log("Loaded Assignment:", res.data);

      if (res.data?.questions) {
        setQuestions(res.data.questions);
      }

      // If backend returns test inside assignment (optional)
      if (res.data?.test?.tid) {
        setTestId(res.data.test.tid);
      }

    } catch (err) {
      console.error("Error loading assignment:", err);
    }
  };

  const loadTestId = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2452/api/assignment/test/${quizcode}`
      );

      console.log("Loaded Test ID:", res.data);
      setTestId(res.data);

    } catch (err) {
      console.error("Error loading test ID:", err);
    }
  };

  loadQuestions();
  loadTestId(); // <- always call separately

}, [quizcode]);


  // -------------------------------------------------------------
  // SAVE ANSWERS
  // -------------------------------------------------------------
  const handleMCQAnswerChange = (qid, selectedOption, index) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        type: "MCQ",
        selectedOption,
        optionIndex: index,
      },
    }));
  };

  const handleParagraphAnswerChange = (qid, text) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        type: "PARAGRAPH",
        text,
      },
    }));
  };

  // -------------------------------------------------------------
  // BUILD PAYLOAD
  // -------------------------------------------------------------
  const buildFinalPayload = () => {
    return questions.map((q) => {
      const ans = answers[q.qid];

      return {
        questionId: q.qid,
        answer:
          ans?.type === "MCQ"
            ? ans.selectedOption
            : ans?.text || "",
      };
    });
  };

  // -------------------------------------------------------------
  // SUBMIT -> EVALUATE
  // -------------------------------------------------------------
  const handleSubmitQuiz = async () => {
    if (!testId) {
      alert("Test ID not loaded yet!");
      return;
    }

    const payload = buildFinalPayload();
    console.log("Evaluation Payload:", payload);

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `http://localhost:2452/api/evaluate/${testId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Evaluation Completed:", res.data);

      navigate("/result", {
        state: { result: res.data },
      });

    } catch (err) {
      console.error("Evaluation Error:", err);
      alert("Error during evaluation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------------
  const isAnswered = (qid) => !!answers[qid];

  const allAnswered = () =>
    questions.every((q) => isAnswered(q.qid));

  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return <div className="text-white p-10">Loading...</div>;
  }

  // -------------------------------------------------------------
  // UI BELOW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">

      {/* CONFIRM SUBMIT POPUP */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>

          <div className="relative bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-800">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              Submit Quiz?
            </h3>

            <p className="text-slate-300 mb-5">
              Once submitted, you cannot change your answers.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="text-slate-300 hover:text-white"
              >
                Review Again
              </button>

              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isSubmitting
                    ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-2xl font-bold text-cyan-400">
          Assignment Quiz
        </h1>
      </div>

      {/* PROGRESS */}
      <div className="bg-slate-800 rounded-full h-2 mb-6">
        <div
          className="bg-cyan-500 h-2 rounded-full"
          style={{
            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
          }}
        ></div>
      </div>

      {/* QUESTION SELECTOR */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {questions.map((q, i) => (
          <button
            key={q.qid}
            onClick={() => setCurrentQuestion(i)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center transition
              ${
                i === currentQuestion
                  ? "bg-cyan-600 text-white"
                  : isAnswered(q.qid)
                  ? "bg-slate-700 text-cyan-400"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }
            `}
          >
            {isAnswered(q.qid) ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              i + 1
            )}
          </button>
        ))}
      </div>

      {/* QUESTION CARD */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-6 shadow-xl">
        <div className="flex justify-between mb-6">
          <span className="text-slate-400">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>

          <span
            className={`
              px-3 py-1 rounded-full text-xs
              ${
                currentQ.type === "MCQ"
                  ? "bg-purple-900 text-purple-400"
                  : "bg-cyan-900 text-cyan-400"
              }
            `}
          >
            {currentQ.type === "MCQ" ? "Multiple Choice" : "Paragraph"}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>

        {/* MCQ */}
        {currentQ.type === "MCQ" && (
          <div className="space-y-3">
            {["option1", "option2", "option3", "option4"].map(
              (opt, idx) => {
                const text = currentQ.mcq[opt];
                const selected =
                  answers[currentQ.qid]?.optionIndex === idx;

                return (
                  <label
                    key={idx}
                    className={`
                      block p-4 rounded-lg border-2 cursor-pointer
                      ${
                        selected
                          ? "bg-cyan-900/50 border-cyan-500"
                          : "bg-slate-800 border-transparent hover:border-slate-600"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={selected}
                      onChange={() =>
                        handleMCQAnswerChange(currentQ.qid, text, idx)
                      }
                    />

                    <div className="flex items-center">
                      <div
                        className={`
                          w-5 h-5 mr-3 rounded-full border-2 flex justify-center items-center
                          ${
                            selected
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-slate-600"
                          }
                        `}
                      >
                        {selected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      {text}
                    </div>
                  </label>
                );
              }
            )}
          </div>
        )}

        {/* PARAGRAPH */}
        {currentQ.type === "PARAGRAPH" && (
          <textarea
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-cyan-500"
            placeholder="Type your answer..."
            value={answers[currentQ.qid]?.text || ""}
            onChange={(e) =>
              handleParagraphAnswerChange(currentQ.qid, e.target.value)
            }
          />
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
          disabled={currentQuestion === 0}
          className={`
            px-4 py-2 rounded-lg flex items-center
            ${
              currentQuestion === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }
          `}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </button>

        {currentQuestion === totalQuestions - 1 ? (
          <button
            onClick={() =>
              allAnswered()
                ? setShowConfirmSubmit(true)
                : alert("Please answer all questions.")
            }
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white"
          >
            <Send className="mr-2 h-4 w-4 inline" /> Submit
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((p) => p + 1)}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        )}
      </div>

      <div className="mt-6 bg-slate-800/50 p-4 rounded-lg flex">
        <HelpCircle className="text-cyan-400 mr-3 h-5 w-5" />
        <p className="text-slate-400 text-sm">
          Navigate using the numbers above.  
          All answers auto-save. You must answer every question before submitting.
        </p>
      </div>
    </div>
  );
};

export default QuizForm;
