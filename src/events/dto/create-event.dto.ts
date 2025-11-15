import { IsString, IsDateString, MinLength, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  banner?: string;
}
