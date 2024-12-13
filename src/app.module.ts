import { Module } from '@nestjs/common';


/// Controller ///
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';

/// Services ///
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

/// Modules ///
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [AuthModule],
  controllers: [AppController,AuthController],
  providers: [AppService,AuthService],
})
export class AppModule {}
