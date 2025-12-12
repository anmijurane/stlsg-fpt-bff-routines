import { IsObject, IsOptional, IsString } from "class-validator";
import { TimestampI } from "src/app-types/interactions";


export class CommonRequestInteractionsDto {
  @IsString()
  @IsOptional()
  club_id?: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsObject()
  @IsOptional()
  timestamp?: TimestampI;

}
