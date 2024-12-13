import {Injectable} from '@nestjs/common'

@Injectable()
export class AuthService {

    public signup(){

        return {msg : "I Have Signed Up"}

    }


    public signin(){

        return {msg : "I Have Signed In"}

    }


}