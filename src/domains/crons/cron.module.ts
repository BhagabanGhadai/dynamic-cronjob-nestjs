import { Module } from "@nestjs/common";
import { CronController } from "./cron.controller";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([])],
    controllers: [CronController],
    providers: [],
    exports: []
})

export class CronModule { }