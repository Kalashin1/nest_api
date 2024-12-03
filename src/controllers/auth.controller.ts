import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ForbiddenException,
} from "@nestjs/common";
import { AuthService } from "src/services/auth.service";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("register")
  CreateAccount(
    @Body() body: { name: string; password: string; email: string },
  ) {
    const { name, email, password } = body;
    return this.authService.createAccount({ name, email, password });
  }

  @Post("login")
  Login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login({ email, password });
  }

  @Get("users")
  GetUsers() {
    return this.authService.getUsers();
  }

  @Get("user/:token")
  async GetUserByToken(@Param("token") token: string) {
    return await this.authService.getUserByToken(token);
  }

  @Get("password/:email")
  async GeneratePasswordResetToken(@Param("email") email: string) {
    const user = await this.authService.generatePasswordResetToken(email);

    if (!user) {
      throw new ForbiddenException("User not found");
    } else {
      return user;
    }
  }

  @Post("password/")
  async UpdateUserPassword(
    @Body()
    body: {
      email: string;
      password: string;
      resetPasswordToken: number;
    },
  ) {
    const { email, password, resetPasswordToken } = body;
    const user = await this.authService.updateUserPassword(
      email,
      password,
      resetPasswordToken,
    );

    if (!user) throw new ForbiddenException("User not found");
    else if (user) return user;
  }
}
