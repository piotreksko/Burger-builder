import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-4d2b9.firebaseio.com/'
});

export default instance;
