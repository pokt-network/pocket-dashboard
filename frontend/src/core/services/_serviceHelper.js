import axios from "axios";
import UserService from "./PocketUserService";

const axiosInstance = () => {

  axios.interceptors.request.use(
    async config => {
      const {accessToken, refreshToken} = UserService.getUserInfo();

    config.headers = {
      "Authorization": `Token ${accessToken}, Refresh ${refreshToken}`,
      "Accept": "application/json",
    };
    return config;
  }, error => {
    throw error;
  });

  axios.interceptors.response.use(function (response) {
    if (response.headers.Authorization) {
      // Save the new session tokens into the user cache
      UserService.saveUserSessionInCache(response.session);
    }

    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  return axios;
};



export default axiosInstance;

