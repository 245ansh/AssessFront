import React from 'react';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-center sm:justify-start">
              <img 
                src="education.png" 
                alt="AssessAI Logo" 
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <span className="ml-2 text-xl md:text-2xl font-bold text-gray-200">
                Assess<span className="text-cyan-500">AI</span>
              </span>
            </div>
            <p className="mt-4 text-gray-400 text-center sm:text-left text-sm md:text-base">
              Revolutionizing education with AI-powered feedback for teachers and students.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg font-semibold mb-4 text-cyan-500 text-center sm:text-left">Quick Links</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Features
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="/testimonials" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          
          {/* Portal Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg font-semibold mb-4 text-cyan-500 text-center sm:text-left">Portals</h3>
            <ul className="space-y-2 text-center sm:text-left">
              <li>
                <a href="/student-login" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Student Login
                </a>
              </li>
              <li>
                <a href="/student-signup" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Student Sign Up
                </a>
              </li>
              <li>
                <a href="/teacher-login" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Teacher Login
                </a>
              </li>
              <li>
                <a href="/teacher-signup" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  Teacher Sign Up
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg font-semibold mb-4 text-cyan-500 text-center sm:text-left">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-cyan-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm md:text-base">123 Education Ave, Learning City</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-cyan-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm md:text-base">(555) 123-4567</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-cyan-500 mr-2 flex-shrink-0" />
                <a href="mailto:info@assessai.com" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">
                  info@assessai.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} AssessAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;