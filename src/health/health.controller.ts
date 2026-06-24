import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  checkHealth() {
    return { status: 'ok', version: process.env.npm_package_version };
  }
}
