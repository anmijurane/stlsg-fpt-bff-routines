import { IsDate, IsObject, IsOptional, IsString } from "class-validator";

interface Client {
  ip: string;
  browser: string;
  os: string;
  device: string;
}

interface Page {
  path: string;
  query_string: string;
}

export class CreateInteractionDto {
  @IsString()
  session_ref: string;

  @IsString()
  club_id: string;

  @IsObject({ each: true })
  client: Client;

  @IsObject({ each: true })
  page: Page;

  @IsString()
  @IsOptional()
  date: string;

}
