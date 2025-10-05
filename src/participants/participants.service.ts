import { Injectable, ConflictException } from '@nestjs/common';
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
  
  async findByNumber(number: string): Promise<Participant | null> {
  return this.participantRepo.findOne({
    where: { number },
  });
}

async removeByPaymentId(paymentId: string): Promise<void> {
  await this.participantRepo.delete({ payment_id: paymentId });
}
  
  async create(data: Partial<Participant>): Promise<Participant> {
  const existing = await this.participantRepo.findOne({
    where: { number: data.number },
  });

  if (existing) {
    throw new ConflictException(`El número ${data.number} ya está ocupado.`);
  }
    const participant = this.participantRepo.create(data);
    return this.participantRepo.save(participant);
  }
}
