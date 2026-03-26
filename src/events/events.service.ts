import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { throwError } from 'rxjs';
import { eventNames } from 'process';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}

    // CREATE EVENT
    async create(dto: CreateEventDto, organizerId: string) {
        return this.prisma.event.create({
            data: {
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                organizerId,
            },
        });
    } 


    // GET ALL EVENTS FOR THE ORGANIZER
    async findAllByOrganizer(organizerId: string) {
        return this.prisma.event.findMany({
            where: { organizerId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { tickets: true, staff: true},
                },
            },
        });
    }

    // GET SINGLE EVENT
    async findOne(id: string, organizerId: string) {
        const event = await this.prisma.event.findFirst({
            where: {id},
            include: {
                staff: {
                    include: { user: true },
                },
                _count: {
                    select: { tickets: true },
                },
            },
        });

        if (!event) throw new NotFoundException('Event not found');

        // just the organizer can access to the event full details

        if (event.organizerId !== organizerId) {
            throw new ForbiddenException('You do not have access to this event details');

        }

        return event;

    }


    // UPDATE EVENT

    async update(id: string, dto: UpdateEventDto, organizerId: string) {
        await this.findOne(id, organizerId); // check if event exists and belongs to the organizer

        return this.prisma.event.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.startDate && { startDate: new Date(dto.startDate) }),
                ...(dto.endDate && { endDate: new Date(dto.endDate) }),
            },
        });
    }

    // DELETE EVENT
    async remove(id: string, organizerId: string) {
        await this.findOne(id, organizerId);

        await this.prisma.event.delete({ where: { id } });
        return { message: 'Event deleted successfully' };

    }

    // GET ALL EVENTS FOR THE PUBLIC (for attendees without authentication)
    async findPublic(search?: string) {
        return this.prisma.event.findMany({
            where: {
                startDate: { gte: new Date() }, // only upcoming events
                ...(search && {
                    OR: [
                        { eventName: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],

                }),
            },
            select: {
                id: true,
                eventName: true,
                description: true,
                location: true,
                eventImage: true,
                startDate: true,
                endDate: true,
                capacity: true,
                ticketType: true,
            },
            orderBy: { startDate: 'asc' },

        });
    }




}
