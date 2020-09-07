import axios from "axios";
import UserService from "./PocketUserService";

const axiosInstance = () => {

  axios.interceptors.request.use(
    async config => {
      const {accessToken, refreshToken, email} = UserService.getUserInfo();

    config.headers = {
      "Authorization": `Token ${accessToken}, Refresh ${refreshToken}, Email ${email}`,
      "Accept": "application/json",
    };
    return config;
  }, error => {
    throw error;
  });

  axios.interceptors.response.use(function (response) {
    if (response.status === 401) {
      // Clear user cache and return to the login page
      UserService.removeUserFromCached();
    } else if (response.headers.authorization) {
      // Save the new session tokens into the user cache
      if (response.headers.authorization.split(", ")[0].split(" ")[0] === "Token" &&
      response.headers.authorization.split(", ")[1].split(" ")[0] === "Refresh" &&
      response.headers.authorization.split(", ")[1].split(" ")[0] === "Refresh") {

        const accessToken = response.headers.authorization.split(", ")[0].split(" ")[1];
        const refreshToken = response.headers.authorization.split(", ")[1].split(" ")[1];
        const userEmail = response.headers.authorization.split(", ")[1].split(" ")[2];

        // Check if the session header belongs to the current user
        const {email} = UserService.getUserInfo();

        // Save response session information only if it belongs to the logged in user
        if (userEmail === email) {
          UserService.saveUserSessionInCache({accessToken, refreshToken});
        }
      }
    }

    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  return axios;
};



export default axiosInstance;

