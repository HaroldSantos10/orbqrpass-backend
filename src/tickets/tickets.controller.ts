
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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    // public - anyone can buy tickets without authentication
    @ApiOperation({ summary: 'Buy tickets for an event' })
    @Post('buy')
    buyTickets(@Body() dto: BuyTicketDto) {
        return this.ticketsService.buyTickets(dto);
    }

    // public - attende scan the QR and see info about the event
    @ApiOperation({ summary: 'Find ticket by QR code' })
    @Get('qr/:qrCode')
    findByQrCode(@Param('qrCode') qrCode: string) {
        return this.ticketsService.findByQrCode(qrCode);
    }

    // Just staff - valide QR at the door
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Validate QR code at the door' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STAFF')
    @Post('validate')
    validateQr(@Body() dto: ValidateQrDto, @CurrentUser() user: any) {
        return this.ticketsService.validateQr(dto, user.id);
    }

    // just organizer - see all the tickets of an event
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find tickets for a specific event (only for organizers)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get('event/:eventId')
    findByEvent(@Param('eventId') eventId: string, @CurrentUser() user: any) {
        return this.ticketsService.findByEvent(eventId, user.id);
    }

    // public — attendee register the personal info required by the event
    @ApiOperation({ summary: 'Register personal information for an event' })
    @Post('personal-info')
    registerPersonalInfo(@Body() dto: RegisterPersonalInfoDto) {
    return this.ticketsService.registerPersonalInfo(dto);
    }

    // organizer see the personal info of the attendees of his event
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get personal information for attendees of a specific event (only for organizers)' })
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




