import { Controller,Get,Patch,Req,UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';

import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';

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
