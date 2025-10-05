import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ParticipantsModule } from '../participants/participants.module';
import { MailModule } from '../mail/mail.module';


@Module({
imports:
[ParticipantsModule, MailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
