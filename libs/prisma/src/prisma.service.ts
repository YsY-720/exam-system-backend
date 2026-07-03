import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {


  constructor(configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get("DATABASE_HOST"),
      port: configService.get("DATABASE_PORT"),
      connectionLimit: 5,
      password: configService.get("DATABASE_PASSWORD"),
      user: configService.get("DATABASE_USER"),
      database: configService.get("DATABASE_NAME")
    });
    super({
      adapter,
      log: [
        { emit: "stdout", level: "query" }
      ]
    });

  }
}
