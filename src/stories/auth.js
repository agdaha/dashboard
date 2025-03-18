import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import AuthService from "../services/auth.service";


export const authStore = defineStore("auth", () => {
  const user = reactive({
    token: "",
    isAuth: false,
  });

  checkValid();

  const isAuth = computed(() => {
    return user.isAuth;
  });


  function checkValid() {
    const value = localStorage.getItem("user");
    if (value) {
      const token = JSON.parse(value).token;
      if (getJwtPayload(token).exp >= (new Date()).getTime()/1000) {
        user.token = token;
        user.isAuth = true;
        return true;
      } else {
        logOut();
      }
    }
    return false;
  }

  function login(user) {
    return AuthService.login(user).then(
      (data) => {
        checkValid();
        return Promise.resolve(data);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  function logOut() {
    user.isAuth = false;
    AuthService.logout();
  }

  const userName = computed(() => {
    if (user.token) {
      return getJwtPayload(user.token).username;
    }
    return "";
  });

  const userRole = computed(() => {
    if (user.token) {
      return getJwtPayload(user.token).role;
    }
    return "";
  });

  function getJwtPayload(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  return { login, logOut, isAuth, userName, userRole, checkValid };
});
