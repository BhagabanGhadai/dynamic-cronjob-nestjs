import { Module } from "@nestjs/common";
import { CronModule } from "./crons/cron.module";

@Module({
    imports: [CronModule],
})

export class DomainModule { }