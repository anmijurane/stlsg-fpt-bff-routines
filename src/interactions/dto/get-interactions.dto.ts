import { PaginationI, RoutineI } from 'src/app-types/interactions';
import { CommonRequestInteractionsDto } from './CommonRequestInteractions.dto';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class GetInteractionsDto extends CommonRequestInteractionsDto {
  @IsString()
  @IsOptional()
  exercise_id?: string;

  @IsObject()
  @IsOptional()
  routine?: RoutineI;

  @IsObject()
  @IsOptional()
  pagination?: PaginationI;
}
