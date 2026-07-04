import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { PrismaService } from "@app/prisma";
import { RedisService } from "@app/redis";
import { EmailService } from "@app/email";
import { getCaptchaEmailHtml } from "../utils";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private redis: RedisService;

  @Inject(EmailService)
  private email: EmailService;

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

  async captcha(address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redis.set(`captcha_${ address }`, code, 5 * 60);
    await this.email.sendEmail({
      to: address,
      subject: "注册验证码",
      html: getCaptchaEmailHtml(code, {
        title: "注册验证码",
        description: "欢迎注册考试系统，请完成邮箱验证",
      })
    });
    return "发送成功";
  }

}
