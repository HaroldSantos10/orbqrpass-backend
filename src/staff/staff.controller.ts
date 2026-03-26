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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
    constructor(private staffService: StaffService) {}

    //ORGANIZER IVITES STAFF
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Invite a staff user to an event (only for organizers)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Post('invite')
    invite(@Body() dto: InviteStaffDto, @CurrentUser() user: any) {
        return this.staffService.invite(dto, user.id);
    }

    // organizer see the staff of the event
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find staff members for a specific event (only for organizers)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get('event/:eventId')
    findByEvent(@Param('eventId') eventId: string, @CurrentUser() user: any) {
        return this.staffService.findByEvent(eventId, user.id);
    }


    // organizer removes staff from the event
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove a staff user from an event (only for organizers)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.staffService.remove(id, user.id);
    }

    // staff sees the events they are staff of
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find events for which a staff user is assigned' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STAFF')
    @Get('my-events')
    myEvents(@CurrentUser() user: any) {
        return this.staffService.findEventsByStaff(user.id);
    }


}


