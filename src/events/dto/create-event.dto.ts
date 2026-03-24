import {
    IsString,
    IsInt,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsOptional,
    Min,
    IsDate,
} from 'class-validator';
import { TicketType } from '@prisma/client';

export class CreateEventDto {

    @IsString()
    eventName: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    eventImage?: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsEnum(TicketType)
    ticketType: TicketType;

    @IsOptional()
    @IsBoolean()
    personalInfo?: boolean;

}