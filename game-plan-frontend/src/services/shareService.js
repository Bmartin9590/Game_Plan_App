import axios from "axios";

const API_URL = "http://localhost:5000/api/shares";

export const sharePlay = async (shareData) => {
  try {
    const response = await axios.post(API_URL, shareData);
    return response.data;
  } catch (error) {
    console.error("Error sharing play:", error);
    throw error;
  }
}