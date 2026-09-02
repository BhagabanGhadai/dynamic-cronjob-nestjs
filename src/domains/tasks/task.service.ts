import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task, TaskDocument } from './task.entity';
import { TaskHelper } from './task.helper';
import { UpdateTaskDto } from './task.schema';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private taskHelper: TaskHelper,
  ) { }

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
    this.taskHelper.scheduleTask(updated);
    return updated;
  }

  async softDelete(id: string): Promise<TaskDocument> {
    const deleted = await this.taskRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return deleted;
  }
}
