import axios from 'axios';

/**
  * @description - store the user token
  * @param  {string} token
  * @return {void} no return or void
  */
export default function setToken(token) {
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-access-token'];
  }
}
