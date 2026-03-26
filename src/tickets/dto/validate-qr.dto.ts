import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateQrDto {
    @ApiProperty({ example: 'uuid-del-qr-code' })
    @IsString()
    qrCode: string;

    @ApiProperty({ example: 'uuid-del-evento' })
    @IsString()
    eventId: string;
}