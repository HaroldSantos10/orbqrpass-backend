import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';


@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [StaffController],
    providers: [StaffService],
})
export class StaffModule {}
