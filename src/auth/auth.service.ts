import {ForbiddenException, Injectable} from '@nestjs/common'

/// Foreing Librays ///
import * as argon from 'argon2'

/// Exceptions ///
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/// Services ///
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt';

/// DTO'S ///
import { AuthDTO } from './dto'

/// Prisma Model Types ///
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {

    constructor (
        private prismaService : PrismaService,
        private jwtService: JwtService,
        private cofigService : ConfigService
    ){

    }

    public async signup(dto : AuthDTO, ) : Promise<String> {
        
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

            return await this.signToken(user.id,user.email)
            
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


    private async signToken(userId : number, email: string) : Promise<String> {
        
        const payload = {
            sub : userId,
            email : email
        }

        const secret = this.cofigService.get("JWT_SECRET")

        return await this.jwtService.signAsync(payload,{
            expiresIn: '15m',
            secret : secret
            }
        )
    }


}