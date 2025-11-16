import axios from "axios";

const API_BASE_URL = "http://localhost:2452/api/assignment";

// Get auth headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Assignment Service API functions
export const assignmentService = {
  // Create assignment
  createAssignment: async (assignmentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        {
          title: assignmentData.title,
          description: assignmentData.description,
          classroomCode: assignmentData.classroomCode,
          difficulty: assignmentData.difficulty,
          numMcqs: assignmentData.numMcqs || 5, // default values
          numWriting: assignmentData.numWriting || 2, // default values
        },
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      // Backend returns quiz JSON as string
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  // Get assignment by ID
  getAssignmentById: async (assignmentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${assignmentId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching assignment:", error);
      throw error;
    }
  },

  // Update assignment
  updateAssignment: async (assignmentId, assignmentData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${assignmentId}`,
        assignmentData,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },

  // Delete assignment
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/${assignmentId}`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  },

  // Get all assignments for a classroom
  getAllAssignmentsByClassroom: async (classroomCode) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/classroom/${classroomCode}`,
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

  // Get attempted assignments for a student in a classroom
  getAttemptedAssignments: async (classroomId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/classroom/${classroomId}/attempted-assignments`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching attempted assignments:", error);
      throw error;
    }
  },
};

export default assignmentService;
