import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [AuthModule, UsersModule, EventsModule, TicketsModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
