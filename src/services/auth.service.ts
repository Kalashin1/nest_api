import { Injectable } from "@nestjs/common";
import { User } from "../entity/user";
import { AppDataSource } from "src/data-source";
import { ObjectId } from "mongodb";
import {
  decodeToken,
  generatePasswordResetCode,
  generateToken,
  hashPassword,
  verifyPassword,
  verifyToken,
} from "src/helper";

@Injectable()
export class AuthService {
  async createAccount({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const user = await this.save(
      AppDataSource.mongoManager.create(User, {
        fullName: name,
        email: email.toLowerCase().trim(),
        password: await hashPassword(password),
      }),
    );
    const token = generateToken({
      email: user.email,
      _id: user._id,
    });
    return { user, token };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await AppDataSource.mongoManager.findOne(User, {
      where: {
        email: {
          $eq: email,
        },
      },
    });

    if (!user) throw Error("Invalid email");
    //

    if (verifyPassword(password, user.password)) {
      const token = generateToken({
        email: user.email,
        _id: user._id,
      });
      return { user, token };
    } else throw Error("Incorrect password");
  }

  getUserByToken(token: string) {
    if (verifyToken(token)) {
      const { _id } = decodeToken(token);
      return this.getUserById(_id.toString());
    } else return null;
  }

  getUserById(id: string) {
    return AppDataSource.mongoManager.findOne(User, {
      where: {
        _id: {
          $eq: new ObjectId(id),
        },
      },
    });
  }

  getUsers() {
    return AppDataSource.mongoManager.find(User, {});
  }

  async generatePasswordResetToken(email: string) {
    const user = await AppDataSource.mongoManager.findOne(User, {
      where: {
        email: { $eq: email },
      },
    });

    if (user) {
      user.passwordResetToken = generatePasswordResetCode();
      return await this.save(user);
    } else {
      return null;
    }
  }

  async updateUserPassword(
    email: string,
    password: string,
    resetPasswordToken: number,
  ) {
    const user = await AppDataSource.mongoManager.findOne(User, {
      where: {
        email: { $eq: email },
        passwordResetToken: { $eq: resetPasswordToken },
      },
    });

    if (user) {
      user.password = await hashPassword(password);
      user.passwordResetToken = null;
      return await this.save(user);
    } else {
      return null;
    }
  }

  save(user: User) {
    return AppDataSource.mongoManager.save(User, user);
  }
}
