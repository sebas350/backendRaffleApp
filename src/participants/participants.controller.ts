import { Body, Controller, Get, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from './entities/participant.entity';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get()
  async getAll(): Promise<Participant[]> {
    return this.participantsService.findAll();
  }
  
  @Post()
  create(@Body() data: Partial<Participant>): Promise<Participant> {
    return this.participantsService.create(data);
  }
}