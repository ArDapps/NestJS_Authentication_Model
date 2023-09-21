import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { UserService } from "./user/user.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
