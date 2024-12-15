import {Body, Controller, HttpCode, HttpStatus, Post,} from '@nestjs/common'

/// Services ///
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
    constructor (private authService : AuthService) {

    }

    @Post('signup')
    async signup(@Body() dto : AuthDTO ) {
        return await this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto : AuthDTO ) {
        return await this.authService.signin(dto)
    }
}