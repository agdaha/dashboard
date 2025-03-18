import axios from 'axios';
import authHeader from '@/services/auth-header';

const API_URL = import.meta.env.VITE_BASE_URL + '/users';


class UserService {
  getUsers() {
    return axios.get(API_URL, {headers: authHeader()}).then(response => {
      return response.data;
    });
  }

  getUser(id) {
    return axios.get(API_URL+`/${id}`, {headers: authHeader()})
  }
}

export default new UserService();
