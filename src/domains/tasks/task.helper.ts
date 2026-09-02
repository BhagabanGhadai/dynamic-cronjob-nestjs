import { HttpException, Injectable, HttpStatus, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskDocument } from './task.entity';
import { ECurrentStatus, ETaskType } from './task.interface';
import { CronJob, CronTime } from 'cron';

@Injectable()
export class TaskHelper {
    private readonly logger = new Logger(TaskHelper.name);

    static isCronExpression(cronExpression: string): boolean {
        try {
            new CronTime(cronExpression);
            return true;
        } catch {
            return false;
        }
    }

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
    ) { }

    scheduleTask(task: TaskDocument) {
        const fetchTask = this.loadTask(task);
        if (!fetchTask) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
        if (task.taskType === ETaskType.cron) {
            return this.startCronJob(task);
        }
        if (task.taskType === ETaskType.interval) {
            return this.startIntervalJob(task);
        }
        if (task.taskType === ETaskType.timeout) {
            return this.startTimeoutJob(task);
        }
    }

    loadTask(task: TaskDocument): CronJob | NodeJS.Timeout | undefined {
        if (
            task.status === ECurrentStatus.inactive ||
            task.status === ECurrentStatus.delete
        ) {
            throw new HttpException('Task is not active', HttpStatus.BAD_REQUEST);
        }

        if (task.taskType === ETaskType.cron) {
            return this.schedulerRegistry.getCronJob(task.name);
        }
        if (task.taskType === ETaskType.interval) {
            return this.schedulerRegistry.getInterval(task.name) as NodeJS.Timeout;
        }
        if (task.taskType === ETaskType.timeout) {
            return this.schedulerRegistry.getTimeout(task.name) as NodeJS.Timeout;
        }
    }

    stopTask(task: TaskDocument) {
        this.loadTask(task);
        if (task.taskType === ETaskType.timeout) {
            this.schedulerRegistry.deleteTimeout(task.name);
            return;
        }
        if (task.taskType === ETaskType.interval) {
            this.schedulerRegistry.deleteInterval(task.name);
            return;
        }
        if (task.taskType === ETaskType.cron) {
            this.schedulerRegistry.deleteCronJob(task.name);
            return;
        }
    }

    startCronJob(task: TaskDocument) {
        const newJob = new CronJob(
            task.cronExpression,
            () => {
                console.log('Cron job started', task.message);
            },
            null,
            true,
            task.timeZone,
        );

        this.schedulerRegistry.addCronJob(task.name, newJob);
        return;
    }

    startIntervalJob(task: TaskDocument) {
        const interval = setInterval(() => {
            this.logger.log(task.message);
        }, task.intervalInMs);
        this.schedulerRegistry.addInterval(task.name, interval);
        return;
    }

    startTimeoutJob(task: TaskDocument) {
        const timeout = setTimeout(() => {
            this.logger.log(task.message);
        }, task.timeoutInMs);
        this.schedulerRegistry.addTimeout(task.name, timeout);
        return;
    }
}
