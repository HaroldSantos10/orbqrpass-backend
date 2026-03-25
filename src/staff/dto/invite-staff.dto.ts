import { IsEmail, IsString } from 'class-validator';

export class InviteStaffDto {
    @IsEmail()
    email: string;

    @IsString()
    eventId: string;

}