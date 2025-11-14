import EncryptedStorage from "./encryptedStorage";

// src/utils/auth.js
export const Auth = {
  // Store user data after login
  login: (user) => {
    EncryptedStorage.set("battlehub_user", JSON.stringify(user));
  },

  // Retrieve current user
  getUser: () => {
    const data = EncryptedStorage.get("battlehub_user");
    return data ? (JSON.parse(data)).role : null;
  },

  // Logout and clear
  logout: () => {
    EncryptedStorage.remove("battlehub_user");
    setTimeout(() => {
  window.location.reload();
    window.location.href = "/login";
    }, 2000);
  },
};
