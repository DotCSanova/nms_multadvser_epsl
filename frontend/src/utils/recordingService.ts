
import axios from 'axios';
import { toast } from 'sonner';

/**
 * Service for handling recording-related API calls
 */
export const recordingService = {
  /**
   * Start recording a stream
   * @param streamName - Name of the stream to record
   * @param token - Authentication token
   * @returns Promise with the response data
   */
  startRecording: async (streamName: string, token: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get the current username from localStorage
    const username = localStorage.getItem('username');
    
    // Check if username exists
    if (!username) {
      throw new Error('Username not found');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${streamName}_${timestamp}`;
    
    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    const response = await axios.post(
      `${API_URL}/api/record/start-recording`,
      { 
        username, 
        streamName, 
        filename 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    toast.success("Recording started successfully");
    return response.data;
  },

  /**
   * Stop recording a stream
   * @param streamName - Name of the stream to stop recording
   * @param token - Authentication token
   * @returns Promise with the response data
   */
  stopRecording: async (streamName: string, token: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    const response = await axios.post(
      `${API_URL}/api/record/stop-recording`,
      { streamName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    toast.success("Recording stopped successfully");
    return response.data;
  }
};
