import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { MailService} from '../mail/mail.service';
import { ValidateQrDto } from './dto/validate-qr.dto';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { validate } from 'class-validator';
import { use } from 'passport';
import { eventNames } from 'process';

@Injectable()
export class TicketsService {
    constructor(
        private prisma: PrismaService,
        private mail: MailService,
    ) {}

    // BUY TICKETS
    async buyTickets(dto: BuyTicketDto) {
        //verify that the event exits
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
        });

        if (!event) throw new NotFoundException('Evento no encontrado');

        //verify available capacity
        const soldTickets = await this.prisma.ticket.count({
            where: { eventId: dto.eventId },
        });

        if (soldTickets + dto.quantity > event.capacity) {
            throw new BadRequestException('No hay suficientes tickets disponibles');
        }

        //create tickets in the DB
        const tickets = await Promise.all(
            Array.from({ length: dto.quantity }).map(() => 
                this.prisma.ticket.create({
                    data: {
                        buyerEmail: dto.buyerEmail,
                        buyerName: dto.buyerName,
                        eventId: dto.eventId,
                    },

                }),

            ),
        );

        //generate QR codes for each ticket
        const qrImages = await Promise.all(
            tickets.map((ticket) =>
                QRCode.toDataURL(ticket.qrCode, {
                    width: 300,
                    margin: 2,
                }),
            ),
        );


        // send email with QR codes
        await this.mail.sendTickets(
            dto.buyerEmail,
            dto.buyerName,
            event.eventName,
            event.startDate.toLocaleDateString(),
            event.location,
            qrImages,
        );

        return {
            message: `${dto.quantity} ticket(s) comprado(s) correctamente`,
            tickets: tickets.map((t) => ({ 
                id: t.id,
                qrCode: t.qrCode,
                status: t.checkinStatus
            })),
        };
    }

    // VALIDATE QR ( used by staff at the event entrance)

    async validateQr(dto: ValidateQrDto, staffId: string) {
        //verify that the ticket has access to the event
        const staffAssignment = await this.prisma.eventStaff.findUnique({
            where: {
                userId_eventId: {
                    userId: staffId,
                    eventId: dto.eventId,
                }

            }

        });
        
        if (!staffAssignment) {
            throw new ForbiddenException('No tienes permiso para validar este evento');

        }

        // search for the ticket with the provided QR code
        const ticket = await this.prisma.ticket.findUnique({
            where: { qrCode: dto.qrCode },
            include: { event: true },
        });

        if (!ticket) {
            return {
                valid: false,
                status: 'INVALID',
                message: 'QR invalido - ticket no encontrado',
            };
        }

        // verify that the ticket belongs to the correct event
        if (ticket.eventId !== dto.eventId) {
            return {
                valid: false,
                status: 'WRONG_EVENT',
                message: 'Este ticket no pertenece a este evento',
            };
        }

        // verify if the ticket has already been used for check-in
        if (ticket.checkinStatus === 'CHECKED_IN') {
            return {
                valid: false,
                status: 'ALREADY_USED',
                message: 'Este ticket ya fue utilizado',
                checkedInAt: ticket.checkedInAt,
            };
        }

        // mark the ticket as checked in
        await this.prisma.ticket.update({
            where: { id: ticket.id },
            data: {
                checkinStatus: 'CHECKED_IN',
                checkedInAt: new Date(),
            },
        });
        
        return {
            valid: true,
            status: 'CHECKED_IN',
            message: 'Acceso permitido',
            buyerName: ticket.buyerName,
            eventName: ticket.event.eventName,
        }
    }

    // SEE TICKETS FOR AN EVENT ( used by event organizers)
    async findByEvent(eventId: string, organizerId: string) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event) throw new NotFoundException('Evento no encontrado');
        if (event.organizerId !== organizerId) {
            throw new ForbiddenException('No tienes acceso a este evento');
        }

        return this.prisma.ticket.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' },
        });

    }

    // SEE TICKET BY QR CODE ( when the attendee scans the QR code)
    async findByQrCode(qrCode: string) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { qrCode },
            include: {
                event: {
                    select: {
                        eventName: true,
                        location: true,
                        startDate: true,
                        endDate: true,
                        eventImage: true,
                        personalInfo: true,
                    }
                }
            },
        });
        if (!ticket) throw new NotFoundException('Ticket no encontrado');
        return ticket;
    }




}





