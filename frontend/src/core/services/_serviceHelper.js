import axios from "axios";
import UserService from "./PocketUserService";

const axiosInstance = () => {

  axios.interceptors.request.use(
    async config => {
      const {token, refreshToken} = UserService.getUserInfo();

    config.headers = {
      "Authorization": `Token ${token}, Refresh ${refreshToken}`,
      "Accept": "application/json",
    };
    return config;
  }, error => {
    throw error;
  });

  return axios;
};

export default axiosInstance;

