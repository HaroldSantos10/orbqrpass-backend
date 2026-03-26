import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(config: ConfigService) {
        const clientID = config.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL');
        const scope = ['email', 'profile'];

        if (!clientID || !clientSecret || !callbackURL) {
            throw new Error('Google OAuth configuration is missing');
        }

        super({
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL,
            scope: scope,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const { emails, name, id } = profile;
        const user = { 
            googleId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
        };
        done(null, user);
    }
}


