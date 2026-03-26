import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterPersonalInfoDto {
  @ApiProperty({ example: 'uuid-del-ticket' })
  @IsUUID()
  ticketId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;
  
    @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'O+' })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiPropertyOptional({ example: 'Penicilina, gluten, maní' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'María Perez - 099123456' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;
}