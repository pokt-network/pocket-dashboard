import axios from "axios";
import UserService from "./PocketUserService";

export const axiosInstance = () => {

  axios.interceptors.request.use(
    async config => {
      const {accesstoken, refreshToken} = UserService.getUserInfo();

    config.headers = {
      'Authorization': `AccessToken ${accesstoken}, RefreshToken ${refreshToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
  },
  error => {
    throw error;
  });

  return axios;
};


