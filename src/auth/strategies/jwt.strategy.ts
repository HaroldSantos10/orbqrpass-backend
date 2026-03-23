import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if(!jwtSecret) {
            throw new Error('JWT_SECRET is not set');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        })

    }

// This method will be called by Passport to validate the JWT payload
// that is returned here, will be available as req.user in the controllers

    async validate(payload: { sub: string, email: string, role: string }) {
        return { 
            id:payload.sub,
            email: payload.email,
            role: payload.role
        };
    }



}