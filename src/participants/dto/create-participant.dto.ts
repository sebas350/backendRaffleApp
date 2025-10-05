export class CreateParticipantDto {
  number: string;
  fullname: string;
  dni: string;
  cel: string;
  mail: string;
  payment_id?: string; // <--- opcional
}