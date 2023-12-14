import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './common/heatlth';

@Module({
  imports: [AuthModule, HealthModule],
  providers: [],
})
export class AppModule {}
