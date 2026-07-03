import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { PrismaService } from "@app/prisma";
import { RedisService } from "@app/redis";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private redis: RedisService;

  private logger = new Logger();

  /**
   * 用户注册
   * @param user
   */
  async register(user: RegisterUserDto) {
    const captcha = await this.redis.get(`captcha_${ user.email }`);

    if (!captcha) throw new HttpException("验证码已失效", HttpStatus.BAD_REQUEST);

    if (user.captcha !== captcha) throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);

    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: user.username
      }
    });

    if (foundUser) throw new HttpException("用户已存在", HttpStatus.BAD_REQUEST);


    try {
      return this.prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          email: user.email
        },
        select: {
          id: true,
          username: true,
          email: true,
          createTime: true,
        }
      });

    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }
}
