"use client"

import { motion } from "framer-motion"
import { BarChart2, Brain, Clock, FileText, Lightbulb, MessageSquare, Sparkles, TrendingUp, Users } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Brain className="h-12 w-12 text-[#00d2ff]" />,
      title: "AI-Powered Grading",
      description:
        "Our advanced AI algorithms can grade assignments across multiple subjects with high accuracy, providing consistent evaluation based on customizable rubrics.",
      animation: {
        rotate: [0, 10, -10, 10, 0],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 },
      },
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-[#00d2ff]" />,
      title: "Personalized Feedback",
      description:
        "Generate detailed, constructive feedback for each student based on their specific strengths and areas for improvement, helping them understand how to progress.",
      animation: { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 } },
    },
    {
      icon: <Clock className="h-12 w-12 text-[#00d2ff]" />,
      title: "Time-Saving Automation",
      description:
        "Reduce grading time by up to 75%, allowing educators to focus more on teaching and less on administrative tasks.",
      animation: { y: [0, -10, 0], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 } },
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-[#00d2ff]" />,
      title: "Learning Analytics",
      description:
        "Track student progress over time with comprehensive analytics that highlight trends, improvements, and areas needing attention.",
      animation: { x: [0, 10, 0], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 6 } },
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-[#00d2ff]" />,
      title: "Learning Gap Identification",
      description:
        "Automatically identify knowledge gaps and misconceptions across your classroom, enabling targeted interventions.",
      animation: {
        opacity: [1, 0.8, 1],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 },
      },
    },
    {
      icon: <Users className="h-12 w-12 text-[#00d2ff]" />,
      title: "Classroom Management",
      description:
        "Easily organize students into classes, assign work, and track completion status all in one intuitive dashboard.",
      animation: {
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 },
      },
    },
    {
      icon: <FileText className="h-12 w-12 text-[#00d2ff]" />,
      title: "Assignment Creation",
      description:
        "Create, customize, and distribute assignments with our easy-to-use templates or build your own from scratch.",
      animation: {
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5 },
      },
    },
    {
      icon: <Sparkles className="h-12 w-12 text-[#00d2ff]" />,
      title: "Continuous Improvement",
      description:
        "Our AI models continuously learn and improve based on teacher feedback, ensuring ever-increasing accuracy and relevance.",
      animation: { y: [0, 5, 0], transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.5 } },
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful <span className="text-[#00d2ff]">Features</span> for Modern Educators
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Discover how AssessAI transforms the educational experience with cutting-edge AI technology designed to
            support teachers and enhance student learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#0f2942] p-8 rounded-xl border border-[#1e3a5f] hover:border-[#00d2ff] transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 210, 255, 0.1)" }}
            >
              <motion.div className="mb-6" animate={feature.animation}>
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.section
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-2xl blur opacity-50"></div>
            <div className="relative bg-[#0f2942] p-8 rounded-2xl border border-[#1e3a5f]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">AI Dashboard Demo</h2>
                  <p className="text-gray-300 mb-6">
                    Experience the power of our AI-driven analytics dashboard. Track student progress, identify learning
                    gaps, and gain valuable insights to improve educational outcomes.
                  </p>
                  <motion.button
                    className="px-6 py-3 rounded-full bg-[#00d2ff] text-[#0a1929] font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request Live Demo
                  </motion.button>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-[#162b44] p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart2 className="h-5 w-5 text-[#00d2ff]" />
                      <h3 className="text-lg font-semibold">Performance Overview</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Grading Accuracy</span>
                          <span>92%</span>
                        </div>
                        <div className="w-full bg-[#0a1929] rounded-full h-2">
                          <motion.div
                            className="bg-[#00d2ff] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "92%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Time Efficiency</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full bg-[#0a1929] rounded-full h-2">
                          <motion.div
                            className="bg-[#00d2ff] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1, delay: 0.7 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Student Satisfaction</span>
                          <span>88%</span>
                        </div>
                        <div className="w-full bg-[#0a1929] rounded-full h-2">
                          <motion.div
                            className="bg-[#00d2ff] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "88%" }}
                            transition={{ duration: 1, delay: 0.9 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}