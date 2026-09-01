import { Module } from '@nestjs/common';
import { DomainModule } from './domains/domain.module';
import { EnvConfig } from './configs/env.config';
import { DBModule } from './db/db.config';

@Module({
  imports: [EnvConfig, DBModule, DomainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
