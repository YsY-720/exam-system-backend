import { createParamDecorator, SetMetadata } from "@nestjs/common";
import { type Request } from "express";

export const RequireLogin = () => SetMetadata("require-login", true);

export const UserInfo = createParamDecorator((data: string, context) => {
  const request = context.switchToHttp().getRequest<Request>();
  if (!request.user) return null;
  return data ? request.user[data] : request.user;
});