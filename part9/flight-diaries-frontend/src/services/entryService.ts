import axios from "axios";
import { Entry, NewEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllEntries = async () => {
  try {
    const response = await axios.get<Entry[]>(baseUrl);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in GET request:", error.response?.data || error.message);
      throw new Error("Error fetching entries. Please try again later.");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const createEntry = async (object: NewEntry) => {
  try {
    const response = await axios.post<Entry>(baseUrl, object);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in POST request:", error.response?.data || error.message);
      throw new Error("Error creating entry. Please try again later.");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
