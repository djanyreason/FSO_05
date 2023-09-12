import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  if(newToken) token = `Bearer ${newToken}`;
  else token = null;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const addBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newBlog, config);

  return response.data;
};

const updateBlog = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);

  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);

  return response.data;
};

export default { getAll, setToken, addBlog, updateBlog, deleteBlog };