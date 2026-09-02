import * as z from 'zod';
import { ECurrentStatus, ETaskType, ETimeZone } from './task.interface';
import { TaskHelper } from './task.helper';
import { isValidObjectId, Types } from 'mongoose';

const baseTaskSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    message: z.string().min(1, "Message is required"),
    status: z.optional(z.literal(ECurrentStatus.active)),
});

const cronTaskSchema = baseTaskSchema.extend({
    taskType: z.literal(ETaskType.cron),
    cronExpression: z.string().refine((val) => TaskHelper.isCronExpression(val), {
        message: "Invalid cron expression",
    }),
    timeZone: z.nativeEnum(ETimeZone).optional(),
});

const intervalTaskSchema = baseTaskSchema.extend({
    taskType: z.literal(ETaskType.interval),
    intervalInMs: z.number({ message: "intervalInMs is required and must be a number" }).positive("intervalInMs must be a positive number"),
});

const timeoutTaskSchema = baseTaskSchema.extend({
    taskType: z.literal(ETaskType.timeout),
    timeoutInMs: z.number({ message: "timeoutInMs is required and must be a number" }).positive("timeoutInMs must be a positive number"),
});

export const createTaskSchema = z.discriminatedUnion('taskType', [
    cronTaskSchema,
    intervalTaskSchema,
    timeoutTaskSchema,
]);

export const updateTaskSchema = z.object({
    _id: z.string().min(1, "Id is required"),
    name: z.optional(z.string().min(3, "Name must be at least 3 characters long")),
    message: z.optional(z.string().min(1, "Message is required")),
    status: z.optional(z.literal(ECurrentStatus.active)),
    taskType: z.optional(z.literal(ETaskType.cron)),
    cronExpression: z.optional(z.string().refine((val) => TaskHelper.isCronExpression(val), {
        message: "Invalid cron expression",
    })),
    timeZone: z.optional(z.nativeEnum(ETimeZone)),
    intervalInMs: z.optional(z.number({ message: "intervalInMs is required and must be a number" }).positive("intervalInMs must be a positive number")),
    timeoutInMs: z.optional(z.number({ message: "timeoutInMs is required and must be a number" }).positive("timeoutInMs must be a positive number")),
});

export const idSchema = z.object({
    _id: z.string().refine(isValidObjectId, "Invalid ObjectId").transform((id) => new Types.ObjectId(id)),
});

export const getAllTaskSchema = z.object({
    page: z.optional(z.number().positive("Page must be a positive number")),
    limit: z.optional(z.number().positive("Limit must be a positive number")),
    search: z.optional(z.string()),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type IdSchema = z.infer<typeof idSchema>;
export type GetAllTaskSchema = z.infer<typeof getAllTaskSchema>;