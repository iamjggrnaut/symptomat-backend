import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private selfApiUrl: string;

  constructor(configService: ConfigService, private health: HealthCheckService, private dns: HttpHealthIndicator) {
    this.selfApiUrl = configService.get<string>('selfApiUrl');
  }

  @Get()
  @HealthCheck()
  checkApi() {
    return this.health.check([() => this.dns.pingCheck('api', this.selfApiUrl)]);
  }
}
