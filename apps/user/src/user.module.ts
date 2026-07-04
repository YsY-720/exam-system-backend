import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "@app/prisma";
import { RedisModule } from "@app/redis";
import { EmailModule } from "@app/email";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, CommonModule } from "@app/common";

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    EmailModule,
    CommonModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: "exam",
          signOptions: {
            expiresIn: "30m"
          }
        };
      }
    })
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class UserModule {
}
