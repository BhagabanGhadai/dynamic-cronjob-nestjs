import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ECurrentStatus, ETaskType, ETimeZone } from "./task.interface";

@Schema({ timestamps: true })
export class Task {
    @Prop({ type: String })
    name: string;

    @Prop({ type: String, enum: ETaskType, default: ETaskType.cron })
    taskType: ETaskType;

    @Prop({ type: String, enum: ETimeZone, default: ETimeZone.IN })
    timeZone: ETimeZone;

    @Prop({ type: String })
    cronExpression: string;

    @Prop({ type: Number })
    intervalInMs: number;

    @Prop({ type: Number })
    timeoutInMs: number;

    @Prop({ type: String })
    task: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String, enum: ECurrentStatus, default: ECurrentStatus.active })
    status: ECurrentStatus;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);