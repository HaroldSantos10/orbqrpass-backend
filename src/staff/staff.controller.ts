import {
    Controller,
    Post, 
    Get, 
    Delete, 
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('staff')
export class StaffController {
    constructor(private staffService: StaffService) {}

    //ORGANIZER IVITES STAFF
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Post('invite')
    invite(@Body() dto: InviteStaffDto, @CurrentUser() user: any) {
        return this.staffService.invite(dto, user.id);
    }

    // organizer see the staff of the event
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get('event/:eventId')
    findByEvent(@Param('eventId') eventId: string, @CurrentUser() user: any) {
        return this.staffService.findByEvent(eventId, user.id);
    }


    // organizer removes staff from the event
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.staffService.remove(id, user.id);
    }

    // staff sees the events they are staff of
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STAFF')
    @Get('my-events')
    myEvents(@CurrentUser() user: any) {
        return this.staffService.findEventsByStaff(user.id);
    }


}


