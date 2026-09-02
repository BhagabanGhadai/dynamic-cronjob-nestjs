import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task, TaskDocument } from './task.entity';
import { TaskHelper } from './task.helper';
import { UpdateTaskDto } from './task.schema';
import { ECurrentStatus } from './task.interface';

@Injectable()
export class TaskService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private taskHelper: TaskHelper,
  ) {}

  async onApplicationBootstrap() {
    await this.reInstantiateTasks();
  }

  async reInstantiateTasks(): Promise<void> {
    try {
      this.logger.log(
        'ReInstantiating active tasks on application bootstrap...',
      );
      const activeTasks = await this.taskRepository.findActiveTasks();
      for (const task of activeTasks) {
        try {
          this.taskHelper.scheduleTask(task);
          this.logger.log(
            `ReInstantiated task: "${task.name}" (${task.taskType})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to reInstantiate task "${task.name}":`,
            error,
          );
        }
      }
      this.logger.log(`ReInstantiated ${activeTasks.length} active task(s).`);
    } catch (error) {
      this.logger.error('Failed to reInstantiate active tasks:', error);
    }
  }

  async findById(id: string): Promise<TaskDocument> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async findAll(
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{ data: TaskDocument[]; total: number }> {
    return this.taskRepository.findAllPaginated(params);
  }

  async findActiveTasks(): Promise<TaskDocument[]> {
    return this.taskRepository.findActiveTasks();
  }

  async create(data: Partial<Task>): Promise<TaskDocument> {
    const task = await this.taskRepository.create(data);
    this.taskHelper.scheduleTask(task);
    return task;
  }

  async update(data: UpdateTaskDto): Promise<TaskDocument> {
    const updated = await this.taskRepository.update(data);
    if (!updated) {
      throw new NotFoundException(`Task with ID "${data._id}" not found`);
    }
    if (updated.status === ECurrentStatus.active) {
      this.taskHelper.scheduleTask(updated);
    } else {
      this.taskHelper.stopTask(updated);
    }
    return updated;
  }

  async softDelete(id: string): Promise<TaskDocument> {
    const deleted = await this.taskRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.taskHelper.stopTask(deleted);
    return deleted;
  }
}
