import CryptoJS from "crypto-js";

// Secret for encryption — use environment variable in production
const APP_SECRET = import.meta.env?.VITE_APP_SECRET || "default_dev_secret";

// 🔹 Hash the key name to obfuscate it
function getEncryptedKeyName(keyName) {
  const hash = CryptoJS.SHA256(keyName + APP_SECRET).toString(CryptoJS.enc.Hex);
  return `es_${hash.substring(0, 24)}`; // prefix for identification
}

// 🔹 Encrypt the value
function encryptValue(value) {
  const stringified = JSON.stringify(value);
  return CryptoJS.AES.encrypt(stringified, APP_SECRET).toString();
}

// 🔹 Decrypt the value
function decryptValue(encrypted) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, APP_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted);
  } catch (err) {
    console.warn("Decryption failed:", err);
    return null;
  }
}

// 🧰 EncryptedStorage utility
const EncryptedStorage = {
  set(key, value) {
    try {
      const encKey = getEncryptedKeyName(key);
      const encValue = encryptValue(value);
      localStorage.setItem(encKey, encValue);
    } catch (err) {
      console.error("EncryptedStorage.set failed:", err);
    }
  },

  get(key) {
    try {
      const encKey = getEncryptedKeyName(key);
      const encValue = localStorage.getItem(encKey);
      if (!encValue) return null;
      return decryptValue(encValue);
    } catch (err) {
      console.error("EncryptedStorage.get failed:", err);
      return null;
    }
  },

  remove(key) {
    try {
      const encKey = getEncryptedKeyName(key);
      localStorage.removeItem(encKey);
    } catch (err) {
      console.error("EncryptedStorage.remove failed:", err);
    }
  },

  obfuscatedKey(key) {
    return getEncryptedKeyName(key);
  }
};

export default EncryptedStorage;
