import { IsEmail, IsString, IsInt, Min, Max} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyTicketDto {
    
    @ApiProperty({ example: 'uuid-del-evento' })
    @IsString()
    eventId: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    buyerName: string;

    @ApiProperty({ example: 'john.doe@email.com' })
    @IsEmail()
    buyerEmail: string;

    @ApiProperty({ example: 5 })
    @IsInt()
    @Min(1)
    @Max(10) // limit of tickets per purchase
    quantity: number;


}