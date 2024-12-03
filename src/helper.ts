import { hash, compare } from "bcrypt";
import { User } from "./entity/user";
import { sign, decode, verify } from "jsonwebtoken";

export const hashPassword = (password: string) => {
  return hash(password, 12);
};

export const verifyPassword = (password: string, hash: string) => {
  return compare(password, hash);
};

export const generateToken = (
  payload: Partial<Pick<User, "email" | "_id">>,
) => {
  return sign(payload, "Test1234", {
    expiresIn: 60 * 60 * 24 * 3,
  });
};

export const decodeToken = (token: string) => {
  return decode(token) as Pick<User, "email" | "_id">;
};

export const verifyToken = (token: string) => {
  return verify(token, "Test1234");
};

export const generatePasswordResetCode = () => {
  return Math.floor(Math.random() * 9999999);
};
