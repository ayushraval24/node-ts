import crypto from "crypto";

// generate random salt
export const generateSalt = () => crypto.randomBytes(16).toString("hex");

// encrypt password
export const authentication = (salt: string, password: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};
