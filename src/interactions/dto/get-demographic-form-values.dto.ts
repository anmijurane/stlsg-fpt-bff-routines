import { IsObject, IsOptional } from "class-validator";
import { CommonRequestInteractionsDto } from "./CommonRequestInteractions.dto";
import { PaginationI } from "src/app-types/interactions";
import { DemographicAgeRange, DemographicGender, DemographicMembership } from "src/app-types/demographic-form";

export class GetDemographicFormValuesDto extends CommonRequestInteractionsDto {
  @IsOptional()
  gender?: DemographicGender;

  @IsOptional()
  age_range?: DemographicAgeRange;

  @IsOptional()
  membership?: DemographicMembership;

  @IsObject()
  @IsOptional()
  pagination?: PaginationI;

}
