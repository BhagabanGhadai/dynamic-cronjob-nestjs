import { Module } from '@nestjs/common';
import { DomainModule } from './domains/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
