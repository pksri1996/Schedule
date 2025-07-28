import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // your backend base URL
  withCredentials: true,
});

export default instance;