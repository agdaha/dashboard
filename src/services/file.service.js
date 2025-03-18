import axios from 'axios';
import authHeader from '@/services/auth-header';

const API_URL = import.meta.env.VITE_BASE_URL + '/files';

class FileService {
  getFile(name) {
    const URL=API_URL+"/"+name;
    return axios.get(URL, {headers: authHeader()}).then(response => {
      return response.data;
    });
  }
}

export default new FileService();
