import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import {ExtractJwt, Strategy} from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prismaService : PrismaService

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'), // Fixing key retrieval
    });
  }

  async validate(payload: any) {

    const user = await this.prismaService.user.findUnique({
        where : {
            id : payload.sub
        }
    })

    delete user.hash
    return user; 
  }
}