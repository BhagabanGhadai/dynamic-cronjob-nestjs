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
        if (
            task.status === ECurrentStatus.inactive ||
            task.status === ECurrentStatus.delete
        ) {
            this.stopTask(task);
            return;
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
        if (task.taskType === ETaskType.cron) {
            return this.schedulerRegistry.doesExist('cron', task.name)
                ? this.schedulerRegistry.getCronJob(task.name)
                : undefined;
        }
        if (task.taskType === ETaskType.interval) {
            return this.schedulerRegistry.doesExist('interval', task.name)
                ? (this.schedulerRegistry.getInterval(task.name) as NodeJS.Timeout)
                : undefined;
        }
        if (task.taskType === ETaskType.timeout) {
            return this.schedulerRegistry.doesExist('timeout', task.name)
                ? (this.schedulerRegistry.getTimeout(task.name) as NodeJS.Timeout)
                : undefined;
        }
    }

    stopTask(task: TaskDocument) {
        if (task.taskType === ETaskType.cron) {
            if (this.schedulerRegistry.doesExist('cron', task.name)) {
                const job = this.schedulerRegistry.getCronJob(task.name);
                job.stop();
                this.schedulerRegistry.deleteCronJob(task.name);
                this.logger.log(`Cron job "${task.name}" stopped and removed.`);
            }
            return;
        }
        if (task.taskType === ETaskType.interval) {
            if (this.schedulerRegistry.doesExist('interval', task.name)) {
                const interval = this.schedulerRegistry.getInterval(task.name);
                clearInterval(interval);
                this.schedulerRegistry.deleteInterval(task.name);
                this.logger.log(`Interval job "${task.name}" stopped and removed.`);
            }
            return;
        }
        if (task.taskType === ETaskType.timeout) {
            if (this.schedulerRegistry.doesExist('timeout', task.name)) {
                const timeout = this.schedulerRegistry.getTimeout(task.name);
                clearTimeout(timeout);
                this.schedulerRegistry.deleteTimeout(task.name);
                this.logger.log(`Timeout job "${task.name}" stopped and removed.`);
            }
            return;
        }
    }

    startCronJob(task: TaskDocument) {
        if (this.schedulerRegistry.doesExist('cron', task.name)) {
            const existingJob = this.schedulerRegistry.getCronJob(task.name);
            existingJob.stop();
            this.schedulerRegistry.deleteCronJob(task.name);
        }

        const newJob = new CronJob(
            task.cronExpression,
            () => {
                this.logger.log(`[Cron] ${task.name}: ${task.message}`);
            },
            null,
            true,
            task.timeZone,
        );

        this.schedulerRegistry.addCronJob(task.name, newJob);
        this.logger.log(
            `Cron job "${task.name}" scheduled with expression: ${task.cronExpression}`,
        );
        return;
    }

    startIntervalJob(task: TaskDocument) {
        if (this.schedulerRegistry.doesExist('interval', task.name)) {
            const existingInterval = this.schedulerRegistry.getInterval(task.name);
            clearInterval(existingInterval);
            this.schedulerRegistry.deleteInterval(task.name);
        }

        const interval = setInterval(() => {
            this.logger.log(`[Interval] ${task.name}: ${task.message}`);
        }, task.intervalInMs);

        this.schedulerRegistry.addInterval(task.name, interval);
        this.logger.log(
            `Interval job "${task.name}" scheduled every ${task.intervalInMs}ms`,
        );
        return;
    }

    startTimeoutJob(task: TaskDocument) {
        if (this.schedulerRegistry.doesExist('timeout', task.name)) {
            const existingTimeout = this.schedulerRegistry.getTimeout(task.name);
            clearTimeout(existingTimeout);
            this.schedulerRegistry.deleteTimeout(task.name);
        }

        const timeout = setTimeout(() => {
            this.logger.log(`[Timeout] ${task.name}: ${task.message}`);
            if (this.schedulerRegistry.doesExist('timeout', task.name)) {
                this.schedulerRegistry.deleteTimeout(task.name);
            }
        }, task.timeoutInMs);

        this.schedulerRegistry.addTimeout(task.name, timeout);
        this.logger.log(
            `Timeout job "${task.name}" scheduled to run in ${task.timeoutInMs}ms`,
        );
        return;
    }
}
