import { IsEnum, IsInt, IsString, Min, ValidateIf } from 'class-validator';
import { RoutineType } from 'src/app-types/interactions';
import { RoutineFeedbackType, RoutineFeedbackValue } from '../entities/routine-feedback.entity';

export class RoutineFeedbackDto {
  // @IsEnum(['feedback_routine', 'feedback_exercise'])
  // type: RoutineFeedbackType;

  @IsEnum(['liked', 'disliked'])
  value: RoutineFeedbackValue;

  @IsEnum(['adaptation', 'muscle_gain', 'health', 'fat_burning'])
  routine: RoutineType;

  @IsString()
  exercise_id?: string;

  @IsInt()
  @Min(1)
  level_id: number;

  @IsInt()
  @Min(1)
  day_routine: number;
}
