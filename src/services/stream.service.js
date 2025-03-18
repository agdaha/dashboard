import axios from 'axios';
import authHeader from '@/services/auth-header';

const API_URL = import.meta.env.VITE_BASE_URL + '/streams';


class StreamService {
  getStreams() {
    return axios.get(API_URL, {headers: authHeader()}).then(response => {
      return response.data;
    });
  }
}

export default new StreamService();
