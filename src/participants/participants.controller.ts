import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from './entities/participant.entity';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Get()
  async getAll(): Promise<Participant[]> {
    return this.participantsService.findAll();
  }
  
  @Get('check-number/:number')
async checkNumber(@Param('number') number: string) {
  const participant = await this.participantsService.findByNumber(number);
  return !participant;
}
  
  @Post()
  create(@Body() data: Partial<Participant>): Promise<Participant> {
    return this.participantsService.create(data);
  }
}
