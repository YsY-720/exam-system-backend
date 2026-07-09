import { Injectable } from "@nestjs/common";
import { createTransport, type Transporter } from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  transport: Transporter;

  constructor(configService: ConfigService) {
    this.transport = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: configService.get("AUTH_EMAIL_USER"),
        pass: configService.get("AUTH_EMAIL_PASS"),
      }
    });
  }

  async sendEmail({ to, subject, html }) {
    await this.transport.sendMail({
      from: {
        name: "考试系统",
        address: "2285683024@qq.com"
      },
      to,
      subject,
      html
    });
  }
}
