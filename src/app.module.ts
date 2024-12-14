import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/// Controller ///
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';

/// Services ///
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service'

/// Modules ///
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';



@Module({
  imports: [AuthModule, PrismaModule,ConfigModule.forRoot({isGlobal : true})],
  controllers: [AppController,AuthController],
  providers: [AppService,AuthService,PrismaService],
})
export class AppModule {}
