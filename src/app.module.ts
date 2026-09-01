import { Module } from '@nestjs/common';
import { DomainModule } from './domains/domain.module';
import { EnvConfig } from './configs/env.config';

@Module({
  imports: [EnvConfig, DomainModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
