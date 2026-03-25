import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { InviteStaffDto } from './dto/invite-staff.dto';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
        private mail: MailService,
        private jwt: JwtService, 
    ) {}

    //INVITE STAFF
    async invite(dto: InviteStaffDto, organizerId: string) {
        // check if event exists and belongs to organizer
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
        });

        if (!event) throw new NotFoundException('Evento no encontrado');
        if (event.organizerId !== organizerId) {
            throw new ForbiddenException('No tienes acceso a este evento');
        }

        // search is the user exists
        let staffUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // if user doesn't exist, create a new role STAFF without password
        if (!staffUser) {
            staffUser = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: '',
                    lastName: '',
                    role: 'STAFF',
                },
            });
        }

        // check if the user is already staff of the event
        const existing = await this.prisma.eventStaff.findUnique({
            where: {
                userId_eventId: {
                    userId: staffUser.id,
                    eventId: dto.eventId,
                },
            },
        });

        if (existing){
            throw new ConflictException('El usuario ya es staff de este evento');
        }

        // assign to the event
        await this.prisma.eventStaff.create({
            data: {
                userId: staffUser.id,
                eventId: dto.eventId,
            },
        })

        // generate invitation token (valid for 24 hours)
        const token = this.jwt.sign(
            { email: dto.email, eventId: dto.eventId },
            { expiresIn: '24h' },
        );

        // send email
        await this.mail.sendStaffInvitation(dto.email, event.eventName, token);

        return { message: `Invitación enviada a ${dto.email}` }; 
    }

    // SEE STAFF OF AN EVENT
    async findByEvent(eventId: string, organizerId: string) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) throw new NotFoundException('Evento no encontrado');
        if (event.organizerId !== organizerId) {
            throw new ForbiddenException('No tienes acceso a este evento');
        }

        return this.prisma.eventStaff.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }

        });

    }


    // REMOVE STAFF FROM AN EVENT
    async remove(staffAssignmentId: string, organizerId: string) {
        const assignment = await this.prisma.eventStaff.findUnique({
            where: { id: staffAssignmentId},
            include: { event: true }, 
        });

        if (!assignment) throw new NotFoundException('Asignación no encontrada');
        if (assignment.event.organizerId !== organizerId) {
            throw new ForbiddenException('No tienes acceso a este evento');
        }

        await this.prisma.eventStaff.delete({
            where: { id: staffAssignmentId },
        });

        return { message: 'Staff eliminado del evento' };

    }


    // SEE ASSIGNED EVENTS FOR A STAFF USER
    async findEventsByStaff(staffId: string) {
        return this.prisma.eventStaff.findMany({
            where: { userId: staffId },
            include: {
                event: true,
            }
        });

    }


}