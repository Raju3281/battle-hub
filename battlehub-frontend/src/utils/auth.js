// src/utils/auth.js
export const Auth = {
  // Store user data after login
  login: (user) => {
    localStorage.setItem("battlehub_user", JSON.stringify(user));
  },

  // Retrieve current user
  getUser: () => {
    const data = localStorage.getItem("battlehub_user");
    return data ? (JSON.parse(data)).role : null;
  },

  // Logout and clear
  logout: () => {
    localStorage.removeItem("battlehub_user");
    setTimeout(() => {
  window.location.reload();
    window.location.href = "/login";
    }, 2000);
  
  },
};
