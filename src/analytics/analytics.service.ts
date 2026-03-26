import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getEventStats(eventId: string, organizerId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('No tenés acceso a este evento');
    }

    // all the stats in parallel to optimize response time
    const [
      totalTickets,
      checkedIn,
      registered,
      totalStaff,
    ] = await Promise.all([
      this.prisma.ticket.count({
        where: { eventId },
      }),
      this.prisma.ticket.count({
        where: { eventId, checkinStatus: 'CHECKED_IN' },
      }),
      this.prisma.ticket.count({
        where: { eventId, infoStatus: 'REGISTERED' },
      }),
      this.prisma.eventStaff.count({
        where: { eventId },
      }),
    ]);

    const availableCapacity = event.capacity - totalTickets;
    const occupancyRate =
      totalTickets > 0
        ? Math.round((checkedIn / totalTickets) * 100)
        : 0;

    return {
      event: {
        id: event.id,
        name: event.eventName,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        capacity: event.capacity,
      },
      stats: {
        totalTickets,
        availableCapacity,
        checkedIn,
        pending: totalTickets - checkedIn,
        registeredInfo: registered,
        totalStaff,
        occupancyRate: `${occupancyRate}%`,
      },
    };
  }

  // resume all the events of the orgnizer
  async getAllEventsStats(organizerId: string) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      include: {
        _count: {
          select: {
            tickets: true,
            staff: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.eventName,
      startDate: event.startDate,
      capacity: event.capacity,
      totalTickets: event._count.tickets,
      totalStaff: event._count.staff,
      availableCapacity: event.capacity - event._count.tickets,
    }));
  }
}