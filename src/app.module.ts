import { Module } from '@nestjs/common';
import { DomainModule } from './domains/domain.module';
import { EnvConfig } from './configs/env.config';
import { DBModule } from './db/db.config';
import { CronModule } from './crons';

@Module({
  imports: [EnvConfig, DBModule, DomainModule, CronModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
