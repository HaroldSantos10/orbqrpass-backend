import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteStaffDto {
    @ApiProperty({ example: 'staff@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'uuid-del-evento' })
    @IsString()
    eventId: string;

}