import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ECurrentStatus, ETimeZone } from "./cron.interface";

@Schema({ timestamps: true })
export class Cron {
    @Prop({ type: String })
    name: string;

    @Prop({ type: String, enum: ETimeZone, default: ETimeZone.IN })
    timeZone: ETimeZone;

    @Prop({ type: String })
    cronExpression: string;

    @Prop({ type: String })
    task: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: String, enum: ECurrentStatus, default: ECurrentStatus.active })
    status: ECurrentStatus;
}

export type CronDocument = HydratedDocument<Cron>;
export const CronSchema = SchemaFactory.createForClass(Cron);