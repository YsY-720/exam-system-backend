import { IsEmail, IsNotEmpty } from "class-validator";

export type CaptchaType = "register" | "resetPassword";

export class CaptchaDto {
  @IsNotEmpty({ message: "邮箱不能为空" })
  @IsEmail({}, { message: "不是合法的邮箱格式" })
  address: string;
}