import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller("user")
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post("register")
  async register(@Body() data: RegisterUserDto) {
    return this.userService.register(data);
  }
}
