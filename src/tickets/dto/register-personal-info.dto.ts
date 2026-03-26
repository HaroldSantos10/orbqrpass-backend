import { IsString, IsOptional, IsUUID } from 'class-validator';

export class RegisterPersonalInfoDto {
  @IsUUID()
  ticketId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;
}