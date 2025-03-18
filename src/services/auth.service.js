import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

class AuthService {
  login(user) {
    return axios
      .post(API_URL + '/login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.status < 400) {
          if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          return response.data;
        }
      })
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
