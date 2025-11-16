import axios from "axios";

const API_BASE_URL = "http://localhost:2452/api/classroom";

// Get auth headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Classroom Service API functions
export const classroomService = {
  // Create new classroom
  createClassroom: async (classroomData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        classroomData,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      // Backend returns Classroom entity, extract relevant fields
      const classroom = response.data;
      return {
        classroomId: classroom.id,
        className: classroom.name,
        subject: classroom.subject,
        classroomCode: classroom.classCode || classroom.classroomCode,
        classCode: classroom.classCode || classroom.classroomCode, // for backward compatibility
      };
    } catch (error) {
      console.error("Error creating classroom:", error);
      throw error;
    }
  },

  // Get all classrooms
  getAllClassrooms: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/allClassrooms`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all classrooms:", error);
      throw error;
    }
  },

  // Delete classroom by ID
  deleteClassroom: async (classroomId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/${classroomId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting classroom:", error);
      throw error;
    }
  },

  // Get all classrooms of a teacher
  getTeacherClassrooms: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teacher/${userId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
          // Allow 302 status to be treated as success
          validateStatus: function (status) {
            return status === 200 || status === 302; // Accept both 200 and 302 as success
          }
        }
      );
      console.log("Response status:", response.status, "Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher classrooms:", error);
      throw error;
    }
  },

  // Get classroom by ID
  getClassroomById: async (classroomId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${classroomId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      // Backend returns Classroom entity, map to expected format
      const classroom = response.data;
      return {
        classroomId: classroom.id,
        className: classroom.name,
        subject: classroom.subject,
        classroomCode: classroom.classCode || classroom.classroomCode,
        classCode: classroom.classCode || classroom.classroomCode, // for backward compatibility
        studentCount: classroom.studentCount || classroom.students?.length || 0,
        learningAssessmentEnabled: classroom.learningAssessmentEnabled || true,
        assignments: classroom.assignments || [],
        assignmentCount: classroom.assignments?.length || 0,
        totalAssignments: classroom.totalAssignments || classroom.assignments?.length || 0,
      };
    } catch (error) {
      console.error("Error fetching classroom by ID:", error);
      throw error;
    }
  },

  // Get classroom by class code
  getClassroomByCode: async (classCode) => {
    try {
      // First get all teacher classrooms to find the one with matching code
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        throw new Error("User ID not found");
      }
      
      const classrooms = await classroomService.getTeacherClassrooms(user.id);
      const classroom = classrooms.find(c => c.classroomCode === classCode || c.classCode === classCode);
      
      if (!classroom) {
        throw new Error("Classroom not found");
      }
      
      // Now get full classroom data using the ID
      return await classroomService.getClassroomById(classroom.classroomId);
    } catch (error) {
      console.error("Error fetching classroom by code:", error);
      throw error;
    }
  },

  // Get all classrooms of a student
  getStudentClassrooms: async (studentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/${studentId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
          validateStatus: function (status) {
            return status >= 200 && status < 400; // Accept any 2xx or 3xx status
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student classrooms:", error);
      throw error;
    }
  },

  // Join classroom with classroom code
  joinClassroom: async (classroomCode) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${classroomCode}/student/join`,
        {},
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error joining classroom:", error);
      throw error;
    }
  },

  // Remove student from classroom
  removeStudent: async (classroomId, studentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/${classroomId}/student/${studentId}/remove`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing student:", error);
      throw error;
    }
  },

  // Get all assignments of a classroom with classroom code
  getClassroomAssignments: async (classroomCode) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${classroomCode}/assignment`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching classroom assignments:", error);
      throw error;
    }
  },
};

export default classroomService;
