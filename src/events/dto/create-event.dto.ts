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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {

    @ApiProperty({ example: 'Fiesta de verano' })
    @IsString()
    eventName: string;

    @ApiPropertyOptional({ example: 'Una noche increíble' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'Buenos Aires, Argentina' })
    @IsString()
    location: string;

    @ApiPropertyOptional({ example: 'https://example.com/event-image.jpg' })
    @IsOptional()
    @IsString()
    eventImage?: string;

    @ApiProperty({ example: '2026-06-01T20:00:00Z' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2026-06-01T20:00:00Z' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: 200 })
    @IsInt()
    @Min(1)
    capacity: number;

    @ApiProperty({ example: 'ONLINE' })
    @IsEnum(TicketType)
    ticketType: TicketType;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    personalInfo?: boolean;

}