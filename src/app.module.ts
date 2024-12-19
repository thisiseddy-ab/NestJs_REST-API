import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

/// Controller ///
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';

/// Services ///
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service'

/// Modules ///
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';



@Module({
  imports: [
    AuthModule, 
    PrismaModule,
    ConfigModule.forRoot({isGlobal : true}),
    UserModule,
    BookmarkModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService],
})
export class AppModule {}
