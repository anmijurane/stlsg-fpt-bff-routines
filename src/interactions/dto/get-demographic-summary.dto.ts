import { IsObject, IsOptional } from "class-validator";
import { PaginationI } from "src/app-types/interactions";
import { CommonRequestInteractionsDto } from "./CommonRequestInteractions.dto";

export class GetDemographicSummaryDto extends CommonRequestInteractionsDto {
  @IsObject()
  @IsOptional()
  pagination?: PaginationI;
}
