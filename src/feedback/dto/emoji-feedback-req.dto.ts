import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Emoji } from '../types';

export class EmojiFeedbackDto {
  @IsEnum(['happy', 'neutral', 'sad'])
  emoji: Emoji;

  @IsString()
  @IsOptional()
  comment: string;

  @IsString()
  page_path: string;

  @IsBoolean()
  @IsOptional()
  rejected: boolean;

  @IsString()
  sede_id: string;
}
