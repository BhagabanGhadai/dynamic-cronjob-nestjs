import { Module } from "@nestjs/common";
import { CronController } from "./cron.controller";

@Module({
    imports: [],
    controllers: [CronController],
    providers: [],
    exports: []
})

export class CronModule { }