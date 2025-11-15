"use client"

import { motion } from "framer-motion"
import { CheckCircle, GraduationCap, Heart, Mail, MapPin, School, Target, Users } from "lucide-react"

export default function About() {
  const missionPoints = [
    {
      icon: <Target className="h-6 w-6 text-[#00d2ff]" />,
      title: "Reduce Teacher Workload",
      description: "Automate repetitive grading tasks to give educators more time to focus on teaching."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-[#00d2ff]" />,
      title: "Improve Feedback Quality",
      description: "Provide detailed, personalized feedback to help students understand their strengths and areas for improvement."
    },
    {
      icon: <Users className="h-6 w-6 text-[#00d2ff]" />,
      title: "Promote Inclusive Education",
      description: "Ensure all students receive equal attention and personalized learning experiences."
    },
    {
      icon: <School className="h-6 w-6 text-[#00d2ff]" />,
      title: "Support SDG 4: Quality Education",
      description: "Align with UN Sustainable Development Goal 4 to ensure inclusive and equitable quality education for all."
    }
  ]
  
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & CEO",
      bio: "Former educator with 15 years of experience and a PhD in Educational Technology.",
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief AI Officer",
      bio: "AI researcher with expertise in natural language processing and machine learning.",
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      name: "Priya Sharma",
      role: "Head of Education",
      bio: "Educational psychologist specializing in personalized learning and assessment.",
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      name: "James Wilson",
      role: "CTO",
      bio: "Software engineer with a passion for creating technology that makes a positive impact.",
      image: "/placeholder.svg?height=100&width=100"
    }
  ]
  
  return (
    <div className="min-h-screen bg-[#0a1929] text-white">      
      <main className="container mx-auto px-4 py-12">
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full blur opacity-50"></div>
                <div className="relative bg-[#0f2942] p-4 rounded-full border border-[#1e3a5f]">
                  <Heart className="h-10 w-10 text-[#00d2ff]" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-[#00d2ff]">AssessAI</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We're on a mission to transform education through AI-powered tools that enhance teaching and learning experiences.
            </p>
          </div>
          
          <motion.div 
            className="bg-[#0f2942] p-8 rounded-2xl border border-[#1e3a5f]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    AssessAI was founded in 2022 by a team of educators and AI specialists who recognized the growing burden of administrative tasks on teachers and the need for more personalized feedback for students.
                  </p>
                  <p>
                    What began as a small project to help local schools has grown into a comprehensive platform serving educational institutions worldwide. Our team combines expertise in education, artificial intelligence, and software development to create tools that make a real difference in classrooms.
                  </p>
                  <p>
                    We believe that technology should enhance human connection in education, not replace it. By automating routine tasks, we free educators to do what they do best: inspire, mentor, and guide their students.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {missionPoints.map((point, index) => (
                    <motion.div 
                      key={index}
                      className="bg-[#162b44] p-4 rounded-xl flex gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 210, 255, 0.1)" }}
                    >
                      <div className="mt-1">{point.icon}</div>
                      <div>
                        <h3 className="font-semibold mb-1">{point.title}</h3>
                        <p className="text-sm text-gray-400">{point.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
        
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-[#0f2942] p-6 rounded-xl border border-[#1e3a5f] text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 210, 255, 0.1)" }}
              >
                <div className="mb-4 mx-auto">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full blur opacity-50"></div>
                    <img 
                      src={member.image || "/placeholder.svg"} 
                      alt={member.name} 
                      className="relative rounded-full w-24 h-24 object-cover border-2 border-[#00d2ff]" 
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-[#00d2ff] mb-3">{member.role}</p>
                <p className="text-sm text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-2xl blur opacity-50"></div>
            <div className="relative bg-[#0f2942] p-8 rounded-2xl border border-[#1e3a5f]">
              <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#162b44] p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-[#00d2ff]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email Us</h3>
                        <p className="text-gray-300">info@assessai.edu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-[#162b44] p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-[#00d2ff]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Visit Our Office</h3>
                        <p className="text-gray-300">123 Education Lane, San Francisco, CA 94107</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-[#162b44] p-2 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-[#00d2ff]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">For Educators</h3>
                        <p className="text-gray-300">Schedule a demo for your institution</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="w-full px-4 py-2 bg-[#162b44] border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full px-4 py-2 bg-[#162b44] border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        className="w-full px-4 py-2 bg-[#162b44] border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows={4} 
                        className="w-full px-4 py-2 bg-[#162b44] border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:border-transparent"
                      ></textarea>
                    </div>
                    <motion.button 
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg bg-[#00d2ff] text-[#0a1929] font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}