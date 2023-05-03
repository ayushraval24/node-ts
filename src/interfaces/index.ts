import User from "../models/user.model";
// ?: number means it can be number or undefined

// error interface
interface Error {
  status?: number;
  message?: string;
}

export { Error };
