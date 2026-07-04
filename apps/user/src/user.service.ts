import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { PrismaService } from "@app/prisma";
import { RedisService } from "@app/redis";
import { EmailService } from "@app/email";
import { getCaptchaEmailHtml } from "../utils";
import { CaptchaType } from "./dto/captcha.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private redis: RedisService;

  @Inject(EmailService)
  private email: EmailService;

  @Inject(JwtService)
  private jwt: JwtService;

  private logger = new Logger();


  /**
   * 发送验证码邮件
   * @param address 邮箱地址
   * @param type 验证码类型
   */
  async captcha(address: string, type: CaptchaType) {
    const code = Math.random().toString().slice(2, 8);
    const emailOptions = this.getCaptchaEmailOptions(type);

    await this.redis.set(`captcha_${ type }_${ address }`, code, 5 * 60);
    await this.email.sendEmail({
      to: address,
      subject: emailOptions.title,
      html: getCaptchaEmailHtml(code, emailOptions)
    });
    return "发送成功";
  }

  /**
   * 获取验证码邮件配置
   * @param type 验证码类型
   */
  private getCaptchaEmailOptions(type: CaptchaType) {
    const options = {
      register: {
        title: "注册验证码",
        description: "欢迎注册考试系统，请完成邮箱验证",
      },
      resetPassword: {
        title: "修改密码验证码",
        description: "你正在修改密码，请完成邮箱验证",
      }
    };

    return options[type];
  }


  /**
   * 用户注册
   * @param user
   */
  async register(user: RegisterUserDto) {
    const captcha = await this.redis.get(`captcha_register_${ user.email }`);

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

  async login(loginUser: LoginUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: loginUser.username,
      }
    });

    if (!foundUser) throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);

    if (foundUser.password !== loginUser.password) throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);
    return {
      id: foundUser.id,
      username: foundUser.username,
      token: this.jwt.sign({
        userId: foundUser.id,
        username: foundUser.username,
      }, {
        expiresIn: "7d"
      })
    };
  }

}
