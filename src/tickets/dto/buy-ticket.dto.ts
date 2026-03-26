import { IsEmail, IsString, IsInt, Min, Max} from 'class-validator';

export class BuyTicketDto {
    
    @IsString()
    eventId: string;

    @IsString()
    buyerName: string;

    @IsEmail()
    buyerEmail: string;

    @IsInt()
    @Min(1)
    @Max(10) // limit of tickets per purchase
    quantity: number;


}