import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { StaffModule } from './staff/staff.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, UsersModule, EventsModule, TicketsModule, StaffModule, AnalyticsModule, PrismaModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
