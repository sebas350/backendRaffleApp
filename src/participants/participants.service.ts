import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
  ) {}

  async findAll(): Promise<Participant[]> {
    return this.participantRepo.find();
  }
  
  async create(data: Partial<Participant>): Promise<Participant> {
    const participant = this.participantRepo.create(data);
    return this.participantRepo.save(participant);
  }
}