import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantsModule } from './participants/participants.module';
import { Participant } from './participants/entities/participant.entity';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bv5k1oqbbanuhe8aglnl-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'uyzcorhdoe28oqvy',
      password: 'frrf8Op1uvop9QiwocpB',
      database: 'bv5k1oqbbanuhe8aglnl',
      entities: [Participant],
      synchronize: true, // ponelo en true solo para desarrollo, nunca en producción
    }),
    ParticipantsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
