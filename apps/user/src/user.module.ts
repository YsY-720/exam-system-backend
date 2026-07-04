import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "@app/prisma";
import { RedisModule } from "@app/redis";
import { EmailModule } from "@app/email";

@Module({
  imports: [PrismaModule, RedisModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}
