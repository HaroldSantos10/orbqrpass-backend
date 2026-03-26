
import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { RegisterPersonalInfoDto } from './dto/register-personal-info.dto';


@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    // public - anyone can buy tickets without authentication
    @Post('buy')
    buyTickets(@Body() dto: BuyTicketDto) {
        return this.ticketsService.buyTickets(dto);
    }

    // public - attende scan the QR and see info about the event
    @Get('qr/:qrCode')
    findByQrCode(@Param('qrCode') qrCode: string) {
        return this.ticketsService.findByQrCode(qrCode);
    }

    // Just staff - valide QR at the door
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STAFF')
    @Post('validate')
    validateQr(@Body() dto: ValidateQrDto, @CurrentUser() user: any) {
        return this.ticketsService.validateQr(dto, user.id);
    }

    // just organizer - see all the tickets of an event
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get('event/:eventId')
    findByEvent(@Param('eventId') eventId: string, @CurrentUser() user: any) {
        return this.ticketsService.findByEvent(eventId, user.id);
    }

    // public — attendee register the personal info required by the event
    @Post('personal-info')
    registerPersonalInfo(@Body() dto: RegisterPersonalInfoDto) {
    return this.ticketsService.registerPersonalInfo(dto);
    }

    // organizer see the personal info of the attendees of his event
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get('personal-info/:eventId')
    getPersonalInfo(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
    ) {
    return this.ticketsService.getPersonalInfoByEvent(eventId, user.id);
    }

}




