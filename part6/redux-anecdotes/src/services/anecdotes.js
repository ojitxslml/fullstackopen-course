import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


const createNew = async (content) => {
    const object = { 
      content, 
      important: false,
      votes: 0
    };
  
    try {
      const response = await axios.post(baseUrl, object);
      return response.data;
    } catch (error) {
      console.error('Error creating new anecdote:', error);
      throw error;
    }
  };

  const updateVotes = async (id, updatedAnecdote) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote);
    return response.data;
  };

export default {
  getAll,
  updateVotes,
  createNew,
}