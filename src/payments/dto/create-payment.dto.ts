import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  token: string;

  @IsString()
  description: string;

  @IsString()
  payment_method_id: string;

  @IsEmail()
  email: string;
  
  @IsString()
  payment_id?: string;
}
