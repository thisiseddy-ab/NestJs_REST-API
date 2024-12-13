import {Injectable} from '@nestjs/common'

/// Services ///
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {

    constructor (
        private prismaService : PrismaService
    ){

    }

    public signup(){
        return {msg : "I Have Signed Up"}

    }


    public signin(){

        return {msg : "I Have Signed In"}

    }


}