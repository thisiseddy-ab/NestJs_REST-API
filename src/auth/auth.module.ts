import {Module} from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'

/// Service ///
import { AuthService } from './auth.service'

/// Controller ///
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategy'

@Module({
    imports : [JwtModule.register({})],
    controllers :[AuthController],
    providers : [AuthService,JwtService,JwtStrategy],
    exports: [AuthService,JwtService],
})
export class AuthModule {

}