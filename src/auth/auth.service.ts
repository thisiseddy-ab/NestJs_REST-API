import {ForbiddenException, Injectable} from '@nestjs/common'

/// Foreing Librays ///
import * as argon from 'argon2'

/// Services ///
import { PrismaService } from 'src/prisma/prisma.service'

/// DTO'S ///
import { AuthDTO } from './dto'

/// Prisma Model Types ///
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

    constructor (
        private prismaService : PrismaService
    ){

    }

    public async signup(dto : AuthDTO) : Promise<Partial<User>> {
        
        const hash = await argon.hash(dto.password)
        
        try{
            const user = await this.prismaService.user.create({
                data : {
                    email : dto.email,
                    hash : hash
                },
                select : {
                    id: true,
                    email : true,
                    createdAt : true
                }
            })

            return user
            
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials taken'
                    );
                }
                throw error
            }
        }
    }


    public async signin(dto : AuthDTO) : Promise<Partial<User>> {

        const user = await this.prismaService.user.findUnique({
            where : {
                email : dto.email
            }
        })

        if(!user){
            throw new ForbiddenException('Credentials Incorect')
        }

        const pwMatches = await argon.verify(user.hash,dto.password)

        if(!pwMatches){
            throw new ForbiddenException('Credentials Incorect')
        }

        delete user.hash
        return user

    }


}