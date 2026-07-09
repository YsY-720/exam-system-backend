import { Injectable } from "@nestjs/common";
import { createTransport, type Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  transport: Transporter;

  constructor() {
    this.transport = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: "xxxxxx@qq.com",
        pass: "XXXX"
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
