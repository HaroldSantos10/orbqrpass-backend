import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { userInfo } from 'os';
import { use } from 'passport';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) {}

    //Public route - anyone can search for events
    @Get('public')
    findPublic(@Query('search') search?: string) {
        return this.eventsService.findPublic(search);
    }

    //Protected route - only organizers
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Post()
    create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
        return this.eventsService.create(dto, user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get()
    findAll(@CurrentUser() user: any) {
        return this.eventsService.findAllByOrganizer(user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.eventsService.findOne(id, user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateEventDto,
        @CurrentUser() user: any,
    ) {
        return this.eventsService.update(id, dto, user.id);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ORGANIZER')
    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.eventsService.remove(id, user.id);
    }


    
}


