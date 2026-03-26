import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
    @IsEmail()
    @ApiProperty({ example: 'organizador@email.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Harold' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ example: 'Mi Empresa S.A.' })
    @IsOptional()
    @IsString()
    companyName?: string;

}