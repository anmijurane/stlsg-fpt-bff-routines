import { IsEnum, IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { RoutineType } from 'src/app-types/interactions';
import { RoutineFeedbackValue } from '../entities/routine-feedback.entity';

export class RoutineFeedbackDto {
  @IsEnum(['liked', 'disliked'])
  value: RoutineFeedbackValue;

  @IsEnum(['adaptation', 'muscle_gain', 'health', 'fat_burning'])
  routine: RoutineType;

  @IsString()
  @IsOptional()
  exercise_id?: string | null;

  @IsInt()
  @Min(1)
  level_id: number;

  @IsInt()
  @Min(1)
  day_routine: number;
}
