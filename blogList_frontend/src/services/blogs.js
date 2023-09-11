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

export default { getAll, setToken, addBlog };