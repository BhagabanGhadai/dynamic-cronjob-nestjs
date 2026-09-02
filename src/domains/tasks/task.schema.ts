import * as v from 'valibot';
import { ECurrentStatus, ETaskType } from './task.interface';
import { TaskHelper } from './task.helper';

export const createTaskSchema = v.object({
    name: v.string(),
    description: v.string(),
    type: v.union([v.literal(ETaskType.cron), v.literal(ETaskType.cron)]),
    schedule: v.union([
        v.string()
    ]),
    message: v.string(),
    status: v.optional(v.literal(ECurrentStatus.active)),
})