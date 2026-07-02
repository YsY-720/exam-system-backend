import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class UserService {
  getHello(): string {
    return "Hello World!";
  }

  async create(data: RegisterUserDto) {
    return {
      username: data.username,
      email: data.email
    };
  }
}
