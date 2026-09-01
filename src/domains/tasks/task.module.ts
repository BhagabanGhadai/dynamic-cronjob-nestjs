import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [MongooseModule.forFeature([])],
    controllers: [TaskController],
    providers: [],
    exports: []
})

export class TaskModule { }