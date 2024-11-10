import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  };

const getAll = async () => {
    const request = await axios.get(baseUrl);
    return request.data;
  };

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  return response.data;
};


const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
}

export default { getAll, getById, setToken, create, update, remove }
