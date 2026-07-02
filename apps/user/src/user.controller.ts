import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post("register")
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.create(registerUser);
  }
}
