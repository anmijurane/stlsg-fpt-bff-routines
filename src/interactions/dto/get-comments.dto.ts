import { IsEnum, IsObject, IsOptional } from "class-validator";
import { CommonRequestInteractionsDto } from "./CommonRequestInteractions.dto";
import { Emoji } from "src/feedback/types";
import { PaginationI } from "src/app-types/interactions";

export class GetCommentsDto extends CommonRequestInteractionsDto {
  @IsEnum(['happy', 'neutral', 'sad'])
  emoji: Emoji;

  @IsObject()
  @IsOptional()
  pagination?: PaginationI;
}