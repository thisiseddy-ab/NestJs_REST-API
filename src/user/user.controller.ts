import { Controller,Get,Patch,Req,UseGuards } from '@nestjs/common';

import { JwtGuard} from '../auth/guard';
import { GetUser } from '../auth/decorator';

/// Primsma Model Types ///
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
    
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user : User) : User {
        return user
    }

    @Patch()
    editUser() {

    }
}
