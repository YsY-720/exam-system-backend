import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { CaptchaDto } from "./dto/captcha.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Controller("user")
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get("register/captcha")
  async registerCaptcha(@Query() query: CaptchaDto) {
    return this.userService.captcha(query.address, "register");
  }

  @Post("register")
  async register(@Body() data: RegisterUserDto) {
    return this.userService.register(data);
  }

  @Post("login")
  async userLogin(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser);
  }

  @Post("update_password")
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Get("update_password/captcha")
  async updatePasswordCaptcha(@Query() query: CaptchaDto) {
    return this.userService.captcha(query.address, "update_password");
  }
}
